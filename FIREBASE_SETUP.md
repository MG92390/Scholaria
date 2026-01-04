# Configuration Firebase pour Scholaria

## 1. Créer le projet Firebase

1. Allez sur https://console.firebase.google.com
2. Cliquez sur "Ajouter un projet"
3. Nom du projet : `scholaria-app`
4. Activez Google Analytics (optionnel)
5. Choisissez votre région (Europe - europe-west1)

## 2. Configurer Authentication

1. Dans la console Firebase, allez dans "Authentication"
2. Cliquez sur "Commencer"
3. Onglet "Sign-in method"
4. Activez "E-mail/Mot de passe"

## 3. Configurer Firestore Database

1. Allez dans "Firestore Database"
2. Cliquez "Créer une base de données"
3. Choisir "Commencer en mode test" (pour le développement)
4. Sélectionner la région : europe-west1

## 4. Configurer l'application Web

1. Dans "Vue d'ensemble du projet" → ⚙️ Paramètres du projet
2. Faites défiler vers "Vos applications"
3. Cliquez sur l'icône Web (</>)
4. Nom de l'application : "Scholaria"
5. Cochez "Configurer Firebase Hosting" (optionnel)
6. Copiez la configuration qui apparaît

## 5. Règles de sécurité Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour les utilisateurs
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Règles pour les résultats (lecture seule pour les profs)
    match /results/{resultId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow read: if request.auth != null &&
        exists(/databases/$(database)/documents/teachers/$(request.auth.uid));
    }

    // Règles pour les enseignants
    match /teachers/{teacherId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == teacherId;
    }
  }
}
```

## 6. Configuration des index Firestore

Les index suivants seront automatiquement créés, mais vous pouvez les optimiser :

```javascript
// Index pour rechercher les résultats par utilisateur et date
collection: results;
fields: userId(Ascending), createdAt(Descending);

// Index pour les classements
collection: users;
fields: totalScore(Descending), lessonsCompleted(Descending);
```

## 7. Functions (server-side) - dossier `functions/`

J'ai ajouté dans le repo un dossier `functions/` prêt à déployer contenant :

- `functions/package.json` (Node 18, dépendances `firebase-admin` + `firebase-functions`)
- `functions/index.js` avec :
  - `getStudentResults` (callable) — retourne uniquement les résultats de `context.auth.uid` (ou `studentId` si identique)
  - `getStudentStats` (callable) — retourne des statistiques pré-calculées si présentes, sinon calcule un résumé léger
  - `onResultCreatedAggregate` (firestore onCreate trigger) — met à jour `users/{uid}.stats` pour lectures rapides

### Déployer les fonctions (rapide)

```bash
cd "C:\\Users\\Moharajuku\\Desktop\\VSCAI\\SSRN\\functions"
npm install
cd ..
firebase login
firebase init functions   # si pas déjà initialisé
firebase deploy --only functions
```

### Remarques sécurité
- Les fonctions `onCall` vérifient `context.auth.uid` et refusent l'accès si l'utilisateur tente de lire les données d'un autre élève.
- Le trigger `onResultCreatedAggregate` s'exécute côté serveur et met à jour les agrégats en toute sécurité.

