# Guide de publication sur Google Play Store

## 1. Configuration de l'application

### Mettre à jour app.json pour Android

```json
{
  "expo": {
    "name": "Scholaria",
    "slug": "scholaria",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.scholaria.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.scholaria.app",
      "versionCode": 1,
      "permissions": ["INTERNET", "ACCESS_NETWORK_STATE"]
    },
    "web": {
      "bundler": "metro",
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": 34,
            "targetSdkVersion": 34,
            "buildToolsVersion": "34.0.0"
          }
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "votre-project-id-eas"
      }
    }
  }
}
```

## 2. Installer EAS CLI

```bash
npm install -g @expo/eas-cli
```

## 3. Configuration EAS Build

```bash
eas login
eas build:configure
```

## 4. Créer le fichier eas.json

```json
{
  "cli": {
    "version": ">= 5.4.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./path/to/api-key.json",
        "track": "internal"
      }
    }
  }
}
```

## 5. Générer les icônes et splash screens

Créez ces fichiers dans le dossier assets/ :

- icon.png (1024x1024)
- adaptive-icon.png (1024x1024)
- splash.png (1242x2436)
- favicon.png (48x48)

## 6. Build de production

```bash
# Build APK pour test
eas build --platform android --profile preview

# Build AAB pour Play Store
eas build --platform android --profile production
```

## 7. Configuration Google Play Console

1. Créer un compte développeur Google Play (25$ une fois)
2. Créer une nouvelle application
3. Remplir les informations de l'app
4. Uploader l'AAB généré par EAS
5. Configurer les descriptions et screenshots

## 8. Prérequis pour la publication

- Politique de confidentialité
- Icônes en différentes tailles
- Screenshots (phone, 7", 10")
- Description courte et longue
- Classification du contenu
- Configuration des prix et distribution

## 9. Commandes utiles

```bash
# Vérifier le status du build
eas build:list

# Soumettre à Google Play
eas submit --platform android

# Mettre à jour la version
# Dans app.json : "version": "1.0.1" et "versionCode": 2
```
