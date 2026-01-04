# 🔥 Correction de l'erreur Firebase auth/operation-not-allowed

## Problème identifié

L'erreur peut venir de plusieurs sources même si l'authentification Email/Password est activée.

## Solutions à essayer dans l'ordre :

### 1. Vérifier les règles Firestore

Dans votre Console Firebase → Firestore Database → Rules, remplacez par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre la lecture/écriture pour les utilisateurs authentifiés
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Cliquez "Publish" après modification**

### 2. Vérifier la configuration Authentication

Dans Console Firebase → Authentication → Sign-in method :

- ✅ Email/Password doit être "Enabled"
- ✅ Vérifiez qu'il n'y a pas de domaines autorisés restrictifs

### 3. Domaines autorisés

Dans Authentication → Settings → Authorized domains :

- Ajoutez `localhost` si pas présent
- Ajoutez votre domaine de production si nécessaire

### 4. Si l'erreur persiste

L'erreur peut venir d'un problème de cache. Essayez :

```bash
npx expo r -c
```

### 5. Mode de développement Firebase

Pour le développement, utilisez les règles de test :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // UNIQUEMENT pour le développement !
    }
  }
}
```

**⚠️ ATTENTION : Changez cela en production !**

## Test après correction

1. Sauvegardez les règles Firestore
2. Rafraîchissez votre application
3. Essayez de créer un compte de test

Une fois que Firebase fonctionne, on pourra embellir l'interface ! 🎨
