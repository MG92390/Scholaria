# 📊 Guide d'Intégration des Cloud Functions Firebase

## Vue d'ensemble

Vous avez deux couches d'intégration :

1. **Services** (`src/services/FirebaseFunctionsService.js`)
   - Fonctions bas niveau pour appeler les Cloud Functions
   - `fetchStudentResults()` — récupère les résultats
   - `fetchStudentStats()` — récupère les statistiques
   - Formatage optionnel des données

2. **Composants UI** (`src/components/dashboard/StudentDashboard.js`)
   - Composant prêt-à-l'emploi affichant stats + historique
   - Gestion du loading/error
   - Onglets pour navigation

## Utilisation Basique

### Dans votre App.js ou un écran

```javascript
import StudentDashboard from './src/components/dashboard/StudentDashboard';

export default function MyApp() {
  const currentUserId = auth.currentUser?.uid; // ou depuis votre contexte

  return (
    <StudentDashboard studentId={currentUserId} />
  );
}
```

### Appels directs du service (optionnel)

Si vous voulez plus de contrôle, appelez directement le service :

```javascript
import { fetchStudentStats, fetchStudentResults } from './src/services/FirebaseFunctionsService';

// Dans un useEffect ou handler
const loadStats = async () => {
  try {
    const data = await fetchStudentStats({ studentId: userId });
    console.log('Stats:', data.stats);
    // data.stats = { attempts, totalScore, avgScore, bestScore, lastPlayed }
  } catch (error) {
    console.error('Erreur:', error);
  }
};

const loadResults = async () => {
  try {
    const data = await fetchStudentResults({
      studentId: userId,
      lessonId: '2nde-vecteurs', // optionnel
      limit: 20
    });
    console.log('Résultats:', data.results);
    // data.results = [{ id, studentId, lessonId, score, total, timeSpent, createdAt, ... }]
  } catch (error) {
    console.error('Erreur:', error);
  }
};
```

## Structure de Données Retournée

### `fetchStudentStats`

```javascript
{
  stats: {
    attempts: 15,              // nombre de fois où l'élève a joué
    totalScore: 1250,          // somme de tous les scores
    avgScore: 83.33,           // moyenne (totalScore / attempts)
    bestScore: 100,            // meilleur score
    lastPlayed: "2025-11-17"   // dernière date (ou Timestamp Firestore)
  }
}
```

### `fetchStudentResults`

```javascript
{
  results: [
    {
      id: "result-001",
      studentId: "user-uid",
      lessonId: "2nde-vecteurs",
      lessonTitle: "🎯 Vecteurs",
      score: 85,               // points obtenus
      total: 100,              // points max
      timeSpent: 120,          // secondes
      createdAt: Timestamp,    // quand le résultat a été enregistré
      metadata: { /* optionnel */ }
    },
    // ... plus de résultats
  ]
}
```

## Configuration Requise

### 1. Firebase SDK mis à jour dans votre app

Vérifiez que `src/firebase/config.js` exporte `functions` :

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions'; // ✅ important

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'europe-west1'); // région doit correspondre
```

### 2. Functions déployées

Assurez-vous d'avoir exécuté :
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 3. Authentification

L'utilisateur doit être connecté pour utiliser les Cloud Functions. Le contexte auth est géré automatiquement par Firebase.

## Exemples Avancés

### Afficher stats dans un widget mini

```javascript
import { fetchStudentStats, formatStats } from './src/services/FirebaseFunctionsService';
import { useFocusEffect } from '@react-navigation/native';

function StatsWidget({ userId }) {
  const [stats, setStats] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        const data = await fetchStudentStats({ studentId: userId });
        setStats(formatStats(data.stats));
      };
      load();
    }, [userId])
  );

  if (!stats) return <Text>Chargement...</Text>;

  return (
    <View>
      <Text>Moyenne: {stats.avgScore}%</Text>
      <Text>Tentatives: {stats.attempts}</Text>
      <Text>Meilleur: {stats.bestScore}</Text>
    </View>
  );
}
```

### Filtrer résultats par leçon

```javascript
const vectorResults = await fetchStudentResults({
  studentId: userId,
  lessonId: '2nde-vecteurs',
  limit: 50
});

console.log('Résultats Vecteurs:', vectorResults.results);
```

### Gestion d'erreur personnalisée

```javascript
try {
  const data = await fetchStudentResults({ studentId: userId });
} catch (error) {
  if (error.code === 'unauthenticated') {
    console.log('Veuillez vous reconnecter');
  } else if (error.code === 'permission-denied') {
    console.log('Accès refusé');
  } else {
    console.log('Erreur:', error.message);
  }
}
```

## Points Importants

✅ Les fonctions vérifient que `context.auth.uid === studentId` — seule l'accès aux propres données est autorisé.

✅ Les statistiques sont pré-calculées par le trigger `onResultCreatedAggregate` et stockées dans `users/{uid}.stats` — lectures rapides.

✅ Les historiques (résultats individuels) restent dans `results` collection — utilisez `limit` pour paginer.

✅ Erreurs courantes :
- ❌ Oublier d'importer `functions` depuis config
- ❌ Appeler avec un `studentId` différent de l'utilisateur connecté (permission-denied)
- ❌ Region mismatch (`europe-west1` doit correspondre)

## Prochaines Étapes

- Intégrer `StudentDashboard` dans votre écran principal de profil utilisateur
- Ajouter graphiques/charts pour visualiser la progression (optionnel : `react-native-svg-charts`)
- Ajouter notifications quand un résultat est enregistré
