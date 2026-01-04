# SSRN — Application de soutien scolaire (React Native / Expo)

Application simple de soutien scolaire avec niveaux (Primaire, Collège, Lycée) et matières, faite avec React Native (Expo). Elle fonctionne sur PC via le mode Web d’Expo, et peut aussi tourner sur Android/iOS si vous avez les outils.

Nouveau: Quiz interactif par leçon (QCM) et suivi de progression (badge « Terminé »). La progression est sauvegardée sur Web (localStorage) et en mémoire sur mobile.

## Prérequis

- Node.js LTS installé
- Accès réseau pour installer les dépendances npm

## Installation

```bash
npm install
```

## Lancer sur PC (Web)

```bash
npx expo start
# puis appuyez sur "w" pour ouvrir dans le navigateur
```

## Lancer sur mobile (optionnel)

- Android: `npm run android` (émulateur ouvert ou téléphone branché)
- iOS (macOS): `npm run ios`

## Structure

- `App.js` — UI principale (niveaux → matières → contenus)
- `src/data/data.js` — Données statiques d’exemple
- `package.json`, `app.json`, `babel.config.js` — Configuration Expo

## Personnalisation rapide

- Ajoutez/supprimez des niveaux ou matières dans `src/data/data.js`.
- Remplacez/ajoutez du contenu (cours, quiz) dans `CONTENT` au même endroit. Pour un quiz, ajoutez `quiz: [{ id, question, options: string[], correctIndex: number }]` à une leçon.

## Notes

- Le projet utilise Expo SDK ~51 et React Native 0.74. Si votre environnement utilise une autre version d’Expo, vous pouvez ajuster les versions de dépendances dans `package.json` via `npx expo install`.
- Aucun backend n’est requis pour cet exemple. Pour persister des favoris ou le progrès, ajoutez par la suite `@react-native-async-storage/async-storage` et/ou une API.

## Idées d’amélioration

- Navigation avancée avec `@react-navigation/native` (pile d’écrans).
- Persistance cross‑plateformes avec `@react-native-async-storage/async-storage` (au lieu de localStorage web).
- Ajout d’un mode examen avec limite de temps et explications détaillées des réponses.
