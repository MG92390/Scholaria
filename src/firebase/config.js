import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration Firebase avec vos vraies clés
const firebaseConfig = {
  apiKey: "AIzaSyBQrLIMIlzqVEgtHmRY79PJQe_pNiO3z7Y",
  authDomain: "scholaria-bdacd.firebaseapp.com",
  projectId: "scholaria-bdacd",
  storageBucket: "scholaria-bdacd.firebasestorage.app",
  messagingSenderId: "425316631071",
  appId: "1:425316631071:web:c5b2f3c79f729a08c60b2a",
  measurementId: "G-GHGP0H8DZD"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser l'authentification avec persistence AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

// Initialiser Cloud Functions (région: europe-west1)
export const functions = getFunctions(app, 'us-central1');

export default app;