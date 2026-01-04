# 🔧 Solution Définitive Firebase Auth Error

## 🚨 Erreur: Firebase: Error (auth/operation-not-allowed)

Cette erreur signifie que l'authentification Email/Password n'est PAS activée dans votre projet Firebase.

## ✅ Solution Étape par Étape

### 1. Ouvrir la Console Firebase

1. Allez sur https://console.firebase.google.com/
2. Sélectionnez votre projet **"scholaria-bdacd"**

### 2. Activer l'Authentification Email/Password

1. Dans le menu de gauche, cliquez sur **"Authentication"**
2. Cliquez sur l'onglet **"Sign-in method"**
3. Dans la liste des fournisseurs, trouvez **"Email/Password"**
4. Cliquez sur **"Email/Password"**
5. **ACTIVEZ** le premier toggle "Email/Password"
6. Cliquez sur **"Save"**

### 3. Configurer Firestore (Important!)

1. Dans le menu de gauche, cliquez sur **"Firestore Database"**
2. Si pas encore créé, cliquez **"Create database"**
3. Choisissez **"Start in test mode"**
4. Sélectionnez votre région (europe-west1 recommandé)
5. Cliquez sur l'onglet **"Rules"**
6. Remplacez le contenu par :

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
match /{document=\*\*} {
allow read, write: if request.auth != null;
}
}
}
\`\`\`

7. Cliquez **"Publish"**

### 4. Vérifications Supplémentaires

#### A. Vérifier les Clés API

- Assurez-vous que votre fichier `src/firebase/config.js` contient les bonnes clés du projet "scholaria-bdacd"

#### B. Vérifier les Domaines Autorisés

1. Dans Authentication > Settings > Authorized domains
2. Ajoutez si nécessaire :
   - localhost
   - 127.0.0.1
   - Votre domaine de production

## 🎯 Après Configuration

Redémarrez votre application :
\`\`\`bash
npx expo start --clear
\`\`\`

L'erreur `auth/operation-not-allowed` devrait disparaître et vous pourrez créer des comptes !

## 📱 Test de Fonctionnement

1. Essayez de créer un nouveau compte
2. Vérifiez dans Firebase Console > Authentication > Users
3. Votre utilisateur devrait apparaître dans la liste

---

💡 **Note**: Cette erreur est très commune et vient simplement du fait que Firebase Authentication n'était pas activé dans la console. Une fois activé, tout fonctionnera parfaitement!
