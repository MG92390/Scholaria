import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase/config';

/**
 * Service pour appeler les Cloud Functions Firebase
 * Utilise les fonctions déployées dans functions/index.js
 */

/**
 * getStudentResults - Récupère les résultats de l'élève
 * @param {Object} options - { studentId?, lessonId?, limit? }
 * @returns {Promise<{results: Array}>}
 */
export const fetchStudentResults = async (options = {}) => {
  try {
    const getResults = httpsCallable(functions, 'getStudentResults');
    const response = await getResults({
      studentId: options.studentId, // optionnel, defaults à context.auth.uid
      lessonId: options.lessonId,   // optionnel, pour filtrer par leçon
      limit: options.limit || 50     // nombre de résultats (max 500)
    });
    return response.data; // { results: [...] }
  } catch (error) {
    console.error('Erreur lors de la récupération des résultats:', error);
    throw error;
  }
};

/**
 * getStudentStats - Récupère les stats agrégées de l'élève
 * @param {Object} options - { studentId? }
 * @returns {Promise<{stats: Object}>}
 */
export const fetchStudentStats = async (options = {}) => {
  try {
    const getStats = httpsCallable(functions, 'getStudentStats');
    const response = await getStats({
      studentId: options.studentId // optionnel
    });
    // Retour: { stats: { attempts, totalScore, avgScore, bestScore, lastPlayed } }
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};

/**
 * Utilitaire: formater les stats pour affichage
 */
export const formatStats = (stats) => {
  if (!stats) return null;
  return {
    attempts: stats.attempts || 0,
    totalScore: stats.totalScore || 0,
    avgScore: ((stats.avgScore || 0) * 100).toFixed(1),
    bestScore: stats.bestScore || 0,
    lastPlayed: stats.lastPlayed ? new Date(stats.lastPlayed).toLocaleDateString('fr-FR') : 'Jamais'
  };
};

/**
 * Utilitaire: formater un résultat unique
 */
export const formatResult = (result) => {
  if (!result) return null;
  return {
    id: result.id,
    lessonTitle: result.lessonTitle || 'Leçon',
    score: result.score || 0,
    total: result.total || 100,
    percentage: ((result.score / (result.total || 100)) * 100).toFixed(1),
    timeSpent: result.timeSpent ? `${(result.timeSpent / 60).toFixed(1)}min` : '-',
    date: result.createdAt ? new Date(result.createdAt).toLocaleDateString('fr-FR') : '-'
  };
};
