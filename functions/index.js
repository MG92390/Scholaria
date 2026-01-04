const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize admin if not already initialized (avoids double-init in local testing)
if (!admin.apps.length) {
  admin.initializeApp();
}

const firestore = admin.firestore();

// Helper: ensure the requester is the student (or throw)
function assertIsSelf(context, studentId) {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentification requise');
  }
  if (studentId && context.auth.uid !== studentId) {
    throw new functions.https.HttpsError('permission-denied', 'Accès refusé : seuls les élèves peuvent consulter leurs propres résultats');
  }
}

/**
 * getStudentResults - callable
 * Params: { studentId?, lessonId?, limit = 50 }
 * If studentId is omitted, returns results for context.auth.uid
 */
exports.getStudentResults = functions.region('europe-west1').https.onCall(async (data, context) => {
  const { studentId: maybeStudentId, lessonId, limit = 50 } = data || {};
  const studentId = maybeStudentId || (context.auth && context.auth.uid);

  assertIsSelf(context, studentId);

  let q = firestore.collection('results').where('studentId', '==', studentId);
  if (lessonId) q = q.where('lessonId', '==', lessonId);
  q = q.orderBy('createdAt', 'desc').limit(Math.min(500, limit));

  const snap = await q.get();
  const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return { results };
});

/**
 * getStudentStats - callable
 * Params: { studentId? }
 * Returns aggregated stats for the student (avg, attempts, best, lastPlayed)
 */
exports.getStudentStats = functions.region('europe-west1').https.onCall(async (data, context) => {
  const { studentId: maybeStudentId } = data || {};
  const studentId = maybeStudentId || (context.auth && context.auth.uid);

  assertIsSelf(context, studentId);

  // Prefer precomputed stats stored under users/{uid}/stats
  const userRef = firestore.doc(`users/${studentId}`);
  const userSnap = await userRef.get();
  const stats = (userSnap.exists && userSnap.data().stats) || null;

  if (stats) {
    return { stats };
  }

  // Fallback: compute lightweight aggregation from recent results (last 200)
  const snap = await firestore.collection('results')
    .where('studentId', '==', studentId)
    .orderBy('createdAt', 'desc')
    .limit(200)
    .get();

  const docs = snap.docs.map(d => d.data());
  const attempts = docs.length;
  const totalScore = docs.reduce((s, r) => s + (r.score || 0), 0);
  const bestScore = docs.reduce((b, r) => Math.max(b, (r.score || 0)), 0);
  const avgScore = attempts ? (totalScore / attempts) : 0;
  const last = docs[0]?.createdAt || null;

  return {
    stats: {
      attempts,
      totalScore,
      bestScore,
      avgScore,
      lastPlayed: last
    }
  };
});

/**
 * onResultCreatedAggregate - firestore trigger (us-central1)
 */
exports.onResultCreatedAggregate = functions
  .region('us-central1')
  .firestore.document('results/{resultId}')
  .onCreate(async (snap) => {
    const resultData = snap.data();
    const studentId = resultData.studentId;

    if (!studentId) {
      console.warn('No studentId in result');
      return;
    }

    const userRef = firestore.collection('users').doc(studentId);
    
    try {
      await userRef.set(
        {
          stats: {
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          }
        },
        { merge: true }
      );
      console.log(`Trigger executed for user ${studentId}`);
    } catch (error) {
      console.error('Trigger error:', error);
    }
  });
