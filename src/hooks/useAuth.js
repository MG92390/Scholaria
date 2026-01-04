import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { StudentResultsService } from '../services/StudentResultsService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadUserProgress(user.uid);
      } else {
        setUser(null);
        setUserProgress({});
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserProgress = async (userId) => {
    try {
      // Charger depuis Firebase
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProgress(userData.progress || {});
        
        // Sauvegarder localement aussi
        await AsyncStorage.setItem('userProgress', JSON.stringify(userData.progress || {}));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la progression:', error);
      // En cas d'erreur, charger depuis le stockage local
      try {
        const localProgress = await AsyncStorage.getItem('userProgress');
        if (localProgress) {
          setUserProgress(JSON.parse(localProgress));
        }
      } catch (localError) {
        console.error('Erreur lors du chargement local:', localError);
      }
    }
  };

  const updateProgress = async (lessonId, completed = true, result = null) => {
    if (!user) return;

    const newProgress = { ...userProgress, [lessonId]: completed };
    setUserProgress(newProgress);

    try {
      // Sauvegarder le résultat si fourni
      if (result && completed) {
        await StudentResultsService.saveResult(user.uid, lessonId, {
          ...result,
          lessonTitle: result.lessonTitle || lessonId,
          subject: result.subject || 'general',
          level: result.level || 'unknown'
        });
      }

      // Sauvegarder dans Firebase
      await updateDoc(doc(db, 'users', user.uid), {
        progress: newProgress,
        lastActivity: new Date()
      });

      // Mettre à jour les stats utilisateur
      await StudentResultsService.updateUserStats(user.uid, lessonId);

      // Sauvegarder localement
      await AsyncStorage.setItem('userProgress', JSON.stringify(newProgress));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setUserProgress({});
    AsyncStorage.removeItem('userProgress');
  };

  return {
    user,
    loading,
    userProgress,
    updateProgress,
    logout
  };
}