import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * FractionsGameCM1 - Fractions Quiz for CM1
 * - Easy level: simple fractions (1/2, 1/3, 1/4, etc.)
 * - QCM format with visual fraction bars
 * - Race to 10 correct answers to win
 * - Saves results to Firebase
 */

const questions = [
  {
    id: 'q1',
    question: 'Quelle fraction représente la partie colorée ?',
    image: '█ █ █ | ░ ░',
    description: '3 parts sur 5',
    options: ['3/5', '2/5', '5/3', '1/3'],
    correctIndex: 0
  },
  {
    id: 'q2',
    question: 'Quelle fraction est égale à la moitié ?',
    description: 'La moitié d\'un gâteau',
    options: ['1/2', '1/3', '1/4', '2/3'],
    correctIndex: 0
  },
  {
    id: 'q3',
    question: 'Combien de quarts y a-t-il dans un entier ?',
    description: 'Un gâteau coupé en 4 parts',
    options: ['4', '3', '2', '1'],
    correctIndex: 0
  },
  {
    id: 'q4',
    question: 'Quelle fraction représente 2 parts sur 3 ?',
    description: 'Deux tiers du gâteau',
    options: ['2/3', '1/3', '3/2', '1/2'],
    correctIndex: 0
  },
  {
    id: 'q5',
    question: 'Un gâteau est coupé en 6 parts. Combien représente 1/6 ?',
    description: 'Une part sur six',
    options: ['1 part', '2 parts', '3 parts', '6 parts'],
    correctIndex: 0
  },
  {
    id: 'q6',
    question: 'Quelle fraction est la plus grande ?',
    description: 'Comparer 1/2 et 1/4',
    options: ['1/2', '1/4', 'Elles sont égales', '1/3'],
    correctIndex: 0
  },
  {
    id: 'q7',
    question: 'Si je mange 1/4 d\'une pizza, combien reste-t-il ?',
    description: 'Pizza entière moins un quart',
    options: ['3/4', '2/4', '1/4', '4/4'],
    correctIndex: 0
  },
  {
    id: 'q8',
    question: 'Quel est le dénominateur de 3/8 ?',
    description: 'Le nombre en bas',
    options: ['8', '3', '11', '5'],
    correctIndex: 0
  },
  {
    id: 'q9',
    question: '1/2 est égal à combien de quarts (1/4) ?',
    description: 'Fractions équivalentes',
    options: ['2', '3', '4', '1'],
    correctIndex: 0
  },
  {
    id: 'q10',
    question: 'Quelle fraction représente tout le gâteau ?',
    description: 'Un entier',
    options: ['1', '2/2', '4/4', 'Toutes les réponses'],
    correctIndex: 3
  }
];

const FractionsGameCM1 = ({ onGameEnd }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const question = questions[index];
    const isCorrect = selected === question.correctIndex;

    if (isCorrect) {
      setCorrectAnswers(c => c + 1);
    }

    setTotalAnswers(t => t + 1);
    setShowExplanation(true);

    // Vérifier si le joueur a atteint 10 bonnes réponses
    if (isCorrect && correctAnswers + 1 === 10) {
      setTimeout(() => {
        const finalTime = Math.round((Date.now() - startTime) / 1000);
        setTimeSpent(finalTime);
        setGameEnded(true);
      }, 1500);
    }
  };

  const handleNext = () => {
    const nextQ = (index + 1) % questions.length;
    setIndex(nextQ);
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
        lessonId: 'cm1-fractions',
        lessonTitle: '🥧 Fractions - CM1',
        score: correctAnswers,
        total: 10,
        percentage: 100,
        timeSpent: timeSpent,
        totalAttempts: totalAnswers,
        createdAt: serverTimestamp(),
        metadata: {
          gameType: 'fractions-qcm',
          difficulty: 'easy',
          maxCorrectAnswers: 10,
          totalQuestionsAnswered: totalAnswers,
          avgTimePerAttempt: (timeSpent / totalAnswers).toFixed(1)
        }
      };

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

          <Text style={styles.message}>⭐ Excellent travail sur les fractions !</Text>

          <TouchableOpacity
            style={styles.endBtn}
            onPress={saveResult}
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

  const question = questions[index];
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
      <ScrollView style={styles.questionContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionTitle}>{question.question}</Text>
        <Text style={styles.questionDescription}>{question.description}</Text>

        {question.image && (
          <View style={styles.imageBox}>
            <Text style={styles.imageText}>{question.image}</Text>
          </View>
        )}

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
            <Text style={styles.explanationText}>
              La bonne réponse était : {question.options[question.correctIndex]}
            </Text>
          </View>
        )}
      </ScrollView>

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
  attemptsText: {
    color: '#e0e7ff',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center'
  },
  questionContainer: {
    flex: 1
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
    marginBottom: 12,
    fontStyle: 'italic'
  },
  imageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center'
  },
  imageText: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'monospace',
    fontWeight: 'bold'
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
    marginTop: 16,
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

export default FractionsGameCM1;
