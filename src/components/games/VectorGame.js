import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const VectorGame = ({ onComplete }) => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'completed'
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const questions = [
    {
      id: 1,
      question: "Quel est le résultat de l'addition de ces vecteurs ?",
      description: "Vecteur A(2, 3) + Vecteur B(1, 4)",
      options: ["(3, 7)", "(1, 1)", "(2, 12)"],
      correctAnswer: 0,
      explanation: "Pour additionner deux vecteurs, on additionne leurs composantes : (2+1, 3+4) = (3, 7)"
    },
    {
      id: 2,
      question: "Quelle est la norme du vecteur V(3, 4) ?",
      description: "Utilise la formule : ||V|| = √(x² + y²)",
      options: ["5", "7", "12"],
      correctAnswer: 0,
      explanation: "||V|| = √(3² + 4²) = √(9 + 16) = √25 = 5"
    },
    {
      id: 3,
      question: "Que vaut 2 × vecteur U(1, -2) ?",
      description: "Multiplication d'un vecteur par un scalaire",
      options: ["(2, -4)", "(3, 0)", "(1, -4)"],
      correctAnswer: 0,
      explanation: "Pour multiplier un vecteur par un scalaire, on multiplie chaque composante : 2 × (1, -2) = (2, -4)"
    },
    {
      id: 4,
      question: "Deux vecteurs sont colinéaires quand...",
      description: "Propriété fondamentale des vecteurs",
      options: ["Ils ont la même direction", "Ils ont la même norme", "Ils sont perpendiculaires"],
      correctAnswer: 0,
      explanation: "Deux vecteurs sont colinéaires s'ils ont la même direction (même si leurs sens ou normes diffèrent)"
    }
  ];

  // Timer pour le jeu
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCurrentQuestion(0);
    setTimeLeft(30);
  };

  const answerQuestion = (selectedAnswer) => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 10);
      Alert.alert(
        "Correct ! 🎉",
        questions[currentQuestion].explanation,
        [{ text: "Continuer", onPress: nextQuestion }]
      );
    } else {
      Alert.alert(
        "Incorrect 😔",
        `Bonne réponse : ${questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}\n\n${questions[currentQuestion].explanation}`,
        [{ text: "Continuer", onPress: nextQuestion }]
      );
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30); // Reset timer pour la nouvelle question
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameState('completed');
    onComplete && onComplete(score);
  };

  const restartGame = () => {
    setGameState('menu');
  };

  if (gameState === 'menu') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎯 Jeu des Vecteurs</Text>
        <Text style={styles.description}>
          Teste tes connaissances sur les vecteurs !{'\n'}
          4 questions - 30 secondes par question
        </Text>
        
        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>📋 Règles du jeu :</Text>
          <Text style={styles.rule}>• Addition et soustraction de vecteurs</Text>
          <Text style={styles.rule}>• Calcul de normes</Text>
          <Text style={styles.rule}>• Multiplication par un scalaire</Text>
          <Text style={styles.rule}>• Propriétés des vecteurs</Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>🚀 Commencer le jeu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (gameState === 'playing') {
    const question = questions[currentQuestion];
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.questionNumber}>Question {currentQuestion + 1}/{questions.length}</Text>
          <Text style={styles.timer}>⏰ {timeLeft}s</Text>
          <Text style={styles.score}>Score: {score}</Text>
        </View>

        <Text style={styles.questionTitle}>{question.question}</Text>
        <Text style={styles.questionDescription}>{question.description}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => answerQuestion(index)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
            ]} 
          />
        </View>
      </View>
    );
  }

  if (gameState === 'completed') {
    const maxScore = questions.length * 10;
    const percentage = (score / maxScore) * 100;
    let message = "";
    let emoji = "";

    if (percentage >= 80) {
      message = "Excellent ! Tu maîtrises bien les vecteurs !";
      emoji = "🏆";
    } else if (percentage >= 60) {
      message = "Bien joué ! Continue à t'entraîner !";
      emoji = "👏";
    } else {
      message = "Pas mal ! Révise un peu et recommence !";
      emoji = "💪";
    }

    return (
      <View style={styles.container}>
        <Text style={styles.completedTitle}>{emoji} Jeu terminé !</Text>
        <Text style={styles.finalScore}>Score final : {score}/{maxScore}</Text>
        <Text style={styles.percentage}>{percentage.toFixed(0)}%</Text>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <Text style={styles.restartButtonText}>🔄 Rejouer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7fb',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2563eb',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 30,
    lineHeight: 22,
  },
  rulesContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  rule: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 5,
  },
  startButton: {
    backgroundColor: '#10b981',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 10,
  },
  questionDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 20,
  },
  finalScore: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#2563eb',
    marginBottom: 10,
  },
  percentage: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#10b981',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 40,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  restartButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  restartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default VectorGame;