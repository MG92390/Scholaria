import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * VectorGameTimed - Jeu des vecteurs en mode "Course"
 * - Première personne à avoir 10 bonnes réponses gagne
 * - Pas de limite de temps
 * - Enregistrement du temps quand 10 bonnes réponses atteintes
 * - Tracking de la progression
 */

const VectorGameTimed = ({ onGameEnd }) => {
  // Questions
  const questions = [
    {
      id: 'q1',
      question: 'Quel est le résultat de l\'addition : Vecteur A(2, 3) + Vecteur B(1, 4) ?',
      description: 'Addition de vecteurs',
      options: ['(3, 7)', '(3, 1)', '(2, 4)', '(1, -1)'],
      correctIndex: 0,
      explanation: 'Pour additionner deux vecteurs, on additionne leurs composantes : (2+1, 3+4) = (3, 7)'
    },
    {
      id: 'q2',
      question: 'Quelle est la norme du vecteur V(3, 4) ?',
      description: 'Norme d\'un vecteur',
      options: ['5', '7', '12', '√7'],
      correctIndex: 0,
      explanation: 'La norme est √(3² + 4²) = √(9 + 16) = √25 = 5'
    },
    {
      id: 'q3',
      question: 'Que vaut 2 × vecteur U(1, -2) ?',
      description: 'Multiplication par un scalaire',
      options: ['(2, -4)', '(2, -2)', '(3, -2)', '(1, -4)'],
      correctIndex: 0,
      explanation: 'Pour multiplier par un scalaire, on multiplie chaque composante : 2 × (1, -2) = (2, -4)'
    },
    {
      id: 'q4',
      question: 'Deux vecteurs sont colinéaires quand...',
      description: 'Propriété des vecteurs',
      options: ['Ils ont la même direction', 'Ils ont la même longueur', 'Leurs coordonnées sont égales', 'Ils sont perpendiculaires'],
      correctIndex: 0,
      explanation: 'Deux vecteurs sont colinéaires s\'ils ont la même direction (même si leurs sens ou normes diffèrent)'
    },
    {
      id: 'q5',
      question: 'Quel est le vecteur nul ?',
      description: 'Vecteur nul',
      options: ['(0, 0)', '(1, 1)', '(0, 1)', 'Aucun vecteur'],
      correctIndex: 0,
      explanation: 'Le vecteur nul est (0, 0), il n\'a ni direction ni magnitude'
    },
    {
      id: 'q6',
      question: 'Soustraction : Vecteur A(5, 3) - Vecteur B(2, 1) = ?',
      description: 'Soustraction de vecteurs',
      options: ['(3, 2)', '(7, 4)', '(2, 1)', '(3, 4)'],
      correctIndex: 0,
      explanation: 'Pour soustraire deux vecteurs, on soustrait leurs composantes : (5-2, 3-1) = (3, 2)'
    },
    {
      id: 'q7',
      question: 'Quel est l\'opposé du vecteur V(2, -3) ?',
      description: 'Opposé d\'un vecteur',
      options: ['(-2, 3)', '(2, 3)', '(-2, -3)', '(3, 2)'],
      correctIndex: 0,
      explanation: 'L\'opposé d\'un vecteur V est -V. Pour V(2, -3), l\'opposé est (-2, 3)'
    },
    {
      id: 'q8',
      question: 'Que vaut (1/2) × Vecteur W(4, -6) ?',
      description: 'Multiplication par un scalaire fractionnaire',
      options: ['(2, -3)', '(4, -6)', '(8, -12)', '(1, -1.5)'],
      correctIndex: 0,
      explanation: 'En multipliant par 1/2, chaque composante est divisée par 2 : (4/2, -6/2) = (2, -3)'
    },
    {
      id: 'q9',
      question: 'Un vecteur unitaire a une norme égale à...',
      description: 'Vecteur unitaire',
      options: ['1', '0', '∞', 'Variable'],
      correctIndex: 0,
      explanation: 'Un vecteur unitaire a une norme (longueur) égale à 1'
    },
    {
      id: 'q10',
      question: 'Deux vecteurs A et B sont orthogonaux si leur produit scalaire est...',
      description: 'Vecteurs orthogonaux',
      options: ['0', '1', '-1', 'Positif'],
      correctIndex: 0,
      explanation: 'Deux vecteurs sont orthogonaux (perpendiculaires) quand leur produit scalaire A·B = 0'
    }
  ];

  // State
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0); // compte les bonnes réponses
  const [totalAnswers, setTotalAnswers] = useState(0); // nombre total de questions répondues
  const [gameEnded, setGameEnded] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime] = useState(Date.now()); // temps de début du jeu
  const [timeSpent, setTimeSpent] = useState(0); // temps total quand jeu fini
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // pour afficher temps en direct

  // Timer pour afficher le temps écoulé en direct
  useEffect(() => {
    if (gameEnded) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - startTime) / 1000));
    }, 100);

    return () => clearInterval(interval);
  }, [gameEnded, startTime]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const ss = secs % 60;
    return `${mins}:${ss < 10 ? '0' : ''}${ss}`;
  };

  const handleAnswer = () => {
    if (selected === null) return;

    const question = questions[currentQ];
    const isCorrect = selected === question.correctIndex;

    if (isCorrect) {
      setCorrectAnswers(c => c + 1);
    }

    setTotalAnswers(t => t + 1);
    setShowExplanation(true);

    // Vérifier si le joueur a atteint 10 bonnes réponses
    if (isCorrect && correctAnswers + 1 === 10) {
      // Gagné !
      setTimeout(() => {
        const finalTime = Math.round((Date.now() - startTime) / 1000);
        setTimeSpent(finalTime);
        setGameEnded(true);
      }, 1500); // attendre un peu pour voir la dernière explication
    }
  };

  const handleNext = async () => {
    // Passer à la question suivante (recycler si nécessaire)
    const nextQ = (currentQ + 1) % questions.length;
    setCurrentQ(nextQ);
    setSelected(null);
    setShowExplanation(false);
  };

  const saveResult = async () => {
    setIsSubmitting(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Erreur', 'Utilisateur non identifié');
        return;
      }

      const resultData = {
        studentId: userId,
        lessonId: '2nde-vecteurs',
        lessonTitle: '🎯 Vecteurs - Course Rapide',
        score: correctAnswers,
        total: 10, // toujours 10 bonnes réponses pour gagner
        percentage: 100, // il faut 10/10 pour gagner
        timeSpent: timeSpent, // temps en secondes
        totalAttempts: totalAnswers, // nombre de questions posées avant de gagner
        createdAt: serverTimestamp(),
        metadata: {
          gameType: 'race',
          maxCorrectAnswers: 10,
          totalQuestionsAnswered: totalAnswers,
          avgTimePerAttempt: (timeSpent / totalAnswers).toFixed(1)
        }
      };

      // Save to Firestore
      await addDoc(collection(db, 'results'), resultData);

      if (onGameEnd) {
        onGameEnd({
          score: correctAnswers,
          total: 10,
          timeSpent: timeSpent
        });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder le résultat');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (gameEnded) {
    const avgTimePerAttempt = (timeSpent / totalAnswers).toFixed(1);

    return (
      <LinearGradient
        colors={['#1e40af', '#3b82f6', '#60a5fa']}
        style={styles.container}
      >
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>🏆 Tu as Gagné !</Text>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Temps</Text>
            <Text style={styles.resultValue}>{formatTime(timeSpent)}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Bonnes Réponses</Text>
            <Text style={styles.resultValue}>{correctAnswers}/10</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Questions Totales</Text>
            <Text style={styles.resultValue}>{totalAnswers}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Temps Moyen par Tentative</Text>
            <Text style={styles.resultValue}>{avgTimePerAttempt}s</Text>
          </View>

          <Text style={styles.message}>⚡ Super performance ! C'est du vecteur express !</Text>

          <TouchableOpacity
            style={styles.endBtn}
            onPress={() => {
              saveResult();
              if (onGameEnd) {
                onGameEnd({ score: correctAnswers, total: 10, timeSpent });
              }
            }}
            disabled={isSubmitting}
          >
            <Text style={styles.endBtnText}>
              {isSubmitting ? 'Sauvegarde...' : 'Terminer'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const question = questions[currentQ];
  const isAnswered = selected !== null;

  return (
    <LinearGradient
      colors={['#1e40af', '#3b82f6', '#60a5fa']}
      style={styles.container}
    >
      {/* Header avec compteurs */}
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(correctAnswers / 10) * 100}%` }
            ]}
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerText}>
            ✅ {correctAnswers}/10 Bonnes Réponses
          </Text>
          <Text style={styles.timerText}>
            ⏱️ {formatTime(elapsedTime)}
          </Text>
        </View>
        <Text style={styles.attemptsText}>
          Tentatives: {totalAnswers}
        </Text>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionTitle}>{question.question}</Text>
        <Text style={styles.questionDescription}>{question.description}</Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => !isAnswered && setSelected(idx)}
              disabled={isAnswered}
              style={[
                styles.optionBtn,
                selected === idx && styles.optionBtnSelected,
                isAnswered && selected === idx && idx === question.correctIndex && styles.optionBtnCorrect,
                isAnswered && selected === idx && idx !== question.correctIndex && styles.optionBtnWrong,
                isAnswered && idx === question.correctIndex && styles.optionBtnCorrect
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  selected === idx && styles.optionTextSelected
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Explanation (après réponse) */}
        {showExplanation && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>
              {selected === question.correctIndex ? '✅ Correct !' : '❌ Incorrect !'}
            </Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
      </View>

        <TouchableOpacity
          style={[
            styles.actionBtn,
            !isAnswered && styles.actionBtnDisabled,
            showExplanation && styles.actionBtnNext
          ]}
          onPress={showExplanation ? handleNext : handleAnswer}
          disabled={!isAnswered && !showExplanation}
        >
          <Text style={styles.actionBtnText}>
            {showExplanation ? 'Suivant' : 'Valider'}
          </Text>
        </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between'
  },
  header: {
    marginTop: 20,
    marginBottom: 20
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden'
  },
  progressFill: {
    height: 6,
    backgroundColor: '#10b981',
    borderRadius: 3
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  timerText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700'
  },
  timerCritical: {
    color: '#fca5a5',
    fontSize: 20
  },
  attemptsText: {
    color: '#e0e7ff',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center'
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center'
  },
  questionDescription: {
    fontSize: 14,
    color: '#e0e7ff',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic'
  },
  optionsContainer: {
    gap: 12
  },
  optionBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  optionBtnSelected: {
    borderColor: '#fbbf24',
    backgroundColor: 'rgba(251, 191, 36, 0.2)'
  },
  optionBtnCorrect: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)'
  },
  optionBtnWrong: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.2)'
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500'
  },
  optionTextSelected: {
    fontWeight: '600'
  },
  explanationBox: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#fbbf24'
  },
  explanationTitle: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8
  },
  explanationText: {
    color: '#e0e7ff',
    fontSize: 14,
    lineHeight: 20
  },
  actionBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16
  },
  actionBtnDisabled: {
    backgroundColor: '#94a3b8'
  },
  actionBtnNext: {
    backgroundColor: '#3b82f6'
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 30
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    minWidth: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  resultLabel: {
    color: '#e0e7ff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  resultValue: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '700'
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fbbf24',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 16
  },
  endBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 20
  },
  endBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
  }
});

export default VectorGameTimed;
