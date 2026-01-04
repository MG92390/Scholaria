# 🔑 Guide détaillé : Obtenir les clés API Firebase

## ÉTAPE 1 : Créer un projet Firebase

1. **Allez sur Firebase Console**

   - Ouvrez https://console.firebase.google.com
   - Connectez-vous avec votre compte Google

2. **Créer un nouveau projet**
   - Cliquez sur "Ajouter un projet" ou "Create a project"
   - Nom du projet : `scholaria-app` (ou le nom de votre choix)
   - Acceptez les conditions
   - Choisissez votre pays/région
   - Google Analytics : OPTIONNEL (vous pouvez désactiver pour commencer)
   - Cliquez "Créer le projet"

## ÉTAPE 2 : Configurer l'authentification

1. **Dans votre projet Firebase**

   - Menu de gauche → "Authentication"
   - Cliquez "Get started" ou "Commencer"

2. **Configurer les méthodes de connexion**
   - Onglet "Sign-in method"
   - Cliquez sur "Email/Password"
   - Activez "Email/Password" (premier bouton)
   - Sauvegardez

## ÉTAPE 3 : Configurer Firestore Database

1. **Créer la base de données**

   - Menu de gauche → "Firestore Database"
   - Cliquez "Create database" ou "Créer une base de données"

2. **Choisir le mode de sécurité**

   - Sélectionnez "Start in test mode" (pour débuter)
   - ⚠️ IMPORTANT : Changez les règles plus tard pour la production !

3. **Choisir la région**
   - Sélectionnez une région proche (ex: europe-west1 pour l'Europe)
   - Cliquez "Done"

## ÉTAPE 4 : Ajouter une application Web

1. **Ajouter une app Web**

   - Dans la vue d'ensemble du projet (🏠 icône maison)
   - Cliquez sur l'icône Web `</>`
   - Nom de l'app : "Scholaria Web"
   - ✅ Cochez "Also set up Firebase Hosting"
   - Cliquez "Register app"

2. **RÉCUPÉRER VOS CLÉS** ⭐
   - Firebase va afficher un code comme celui-ci :
   ```javascript
   const firebaseConfig = {
     apiKey: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
     authDomain: 'scholaria-app-12345.firebaseapp.com',
     projectId: 'scholaria-app-12345',
     storageBucket: 'scholaria-app-12345.appspot.com',
     messagingSenderId: '123456789012',
     appId: '1:123456789012:web:abcdef123456789',
   };
   ```
3. **COPIEZ TOUT CE CODE !** 📋
   - Sélectionnez tout le contenu de `firebaseConfig`
   - Copiez-le (Ctrl+C)

## ÉTAPE 5 : Installer Firebase CLI (si pas déjà fait)

```bash
npm install -g firebase-tools
```

## ÉTAPE 6 : Se connecter à Firebase

```bash
firebase login
```

- Une page web s'ouvrira
- Connectez-vous avec le même compte Google
- Autorisez Firebase CLI

## DÉPANNAGE FRÉQUENT

### ❌ "Je ne vois pas le code de configuration"

**Solution :**

1. Allez dans Paramètres du projet (⚙️ en haut à gauche)
2. Faites défiler vers "Your apps" / "Vos applications"
3. Trouvez votre app web
4. Cliquez sur "Config" ou l'icône `</>`

### ❌ "Authentication n'apparaît pas"

**Solution :**

1. Attendez que le projet soit complètement créé (1-2 minutes)
2. Rafraîchissez la page
3. Menu de gauche → Authentication → Get started

### ❌ "Firestore n'apparaît pas"

**Solution :**

1. Menu de gauche → Firestore Database
2. Si vous voyez "Realtime Database" au lieu de Firestore, cliquez sur l'onglet "Cloud Firestore"

## ÉTAPE 7 : Copier vos clés dans le projet

Une fois que vous avez vos clés, je vous aiderai à les mettre dans le bon fichier !

## 🆘 BESOIN D'AIDE ?

Si vous êtes bloqué à une étape, dites-moi exactement :

1. À quelle étape vous êtes
2. Ce que vous voyez à l'écran
3. Le message d'erreur éventuel

Je vous guiderai personnellement ! 🤝
