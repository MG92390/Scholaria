import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  updateDoc,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';

export class StudentResultsService {
  
  // Enregistrer un résultat de quiz/jeu
  static async saveResult(userId, lessonId, result) {
    try {
      const resultData = {
        userId,
        lessonId,
        score: result.score || 0,
        totalQuestions: result.total || 0,
        percentage: result.score && result.total ? Math.round((result.score / result.total) * 100) : 0,
        timeSpent: result.timeSpent || 0,
        completed: true,
        createdAt: serverTimestamp(),
        lessonTitle: result.lessonTitle || '',
        subject: result.subject || '',
        level: result.level || ''
      };

      const docRef = await addDoc(collection(db, 'results'), resultData);
      console.log('Résultat enregistré avec ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du résultat:', error);
      throw error;
    }
  }

  // Récupérer tous les résultats d'un élève
  static async getStudentResults(userId) {
    try {
      const q = query(
        collection(db, 'results'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const results = [];
      
      querySnapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        });
      });
      
      return results;
    } catch (error) {
      console.error('Erreur lors de la récupération des résultats:', error);
      throw error;
    }
  }

  // Récupérer les statistiques d'un élève
  static async getStudentStats(userId) {
    try {
      const results = await this.getStudentResults(userId);
      
      const stats = {
        totalTests: results.length,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
        subjectsProgress: {},
        recentActivity: results.slice(0, 5)
      };

      if (results.length > 0) {
        // Calcul moyenne
        const totalPercentage = results.reduce((sum, result) => sum + (result.percentage || 0), 0);
        stats.averageScore = Math.round(totalPercentage / results.length);

        // Meilleur score
        stats.bestScore = Math.max(...results.map(r => r.percentage || 0));

        // Temps total
        stats.totalTimeSpent = results.reduce((sum, result) => sum + (result.timeSpent || 0), 0);

        // Progression par matière
        const subjectStats = {};
        results.forEach(result => {
          if (result.subject) {
            if (!subjectStats[result.subject]) {
              subjectStats[result.subject] = {
                count: 0,
                totalScore: 0,
                averageScore: 0
              };
            }
            subjectStats[result.subject].count++;
            subjectStats[result.subject].totalScore += (result.percentage || 0);
          }
        });

        // Calculer les moyennes par matière
        Object.keys(subjectStats).forEach(subject => {
          subjectStats[subject].averageScore = Math.round(
            subjectStats[subject].totalScore / subjectStats[subject].count
          );
        });

        stats.subjectsProgress = subjectStats;
      }

      return stats;
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      throw error;
    }
  }

  // Récupérer le classement général
  static async getLeaderboard(limitCount = 10) {
    try {
      const q = query(
        collection(db, 'users'),
        orderBy('totalScore', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const leaderboard = [];

      querySnapshot.forEach((doc, index) => {
        const userData = doc.data();
        leaderboard.push({
          id: doc.id,
          name: userData.name || 'Utilisateur anonyme',
          totalScore: userData.totalScore || 0,
          lessonsCompleted: userData.lessonsCompleted || 0,
          position: index + 1
        });
      });

      return leaderboard;
    } catch (error) {
      console.error('Erreur lors de la récupération du classement:', error);
      throw error;
    }
  }

  // Fonction pour les enseignants : récupérer tous les résultats d'une classe
  static async getClassResults(studentIds) {
    try {
      const allResults = [];

      for (const studentId of studentIds) {
        const userDoc = await getDoc(doc(db, 'users', studentId));
        const studentResults = await this.getStudentResults(studentId);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          allResults.push({
            studentId,
            studentName: userData.name || 'Élève',
            results: studentResults,
            stats: await this.getStudentStats(studentId)
          });
        }
      }

      return allResults;
    } catch (error) {
      console.error('Erreur lors de la récupération des résultats de classe:', error);
      throw error;
    }
  }

  // Récupérer les résultats par matière et niveau
  static async getResultsBySubjectAndLevel(subject, level) {
    try {
      const q = query(
        collection(db, 'results'),
        where('subject', '==', subject),
        where('level', '==', level),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const results = [];

      querySnapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        });
      });

      return results;
    } catch (error) {
      console.error('Erreur lors de la récupération par matière/niveau:', error);
      throw error;
    }
  }

  // Mettre à jour les statistiques de l'utilisateur
  static async updateUserStats(userId, lessonId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentProgress = userData.progress || {};
        const newProgress = { ...currentProgress, [lessonId]: true };
        
        const stats = await this.getStudentStats(userId);
        
        await updateDoc(userRef, {
          progress: newProgress,
          lessonsCompleted: Object.keys(newProgress).length,
          totalScore: stats.totalTests * 100, // Score approximatif
          lastActivity: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des stats utilisateur:', error);
      throw error;
    }
  }
}