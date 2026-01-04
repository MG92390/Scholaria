import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'; 
import Svg, { Circle, Defs, Line, Marker, Path } from 'react-native-svg';

// Types pour les questions (commenté en JavaScript)
// interface Question {
//   question: string;
//   options: string[];
//   correctAnswer: number;
//   explanation: string;
//   vectorX: number;
//   vectorY: number;
//   startX: number;
//   startY: number;
// }

export default function VectorCoordinatesGame({ onGameEnd }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gamePhase, setGamePhase] = useState('playing'); // 'playing' | 'finished'

  const width = 300;
  const height = 300;
  const unit = 30; // 1 unité = 30 pixels
  const origin = { x: width / 2, y: height / 2 };
  const maxQuestions = 5; // Limiter le jeu à 5 questions

  // Fonction pour générer un nombre aléatoire entre min et max
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Fonction pour formater les coordonnées avec signe explicite
  const formatCoordinate = (x, y) => {
    const xStr = x >= 0 ? `+${x}` : x.toString();
    const yStr = y >= 0 ? `+${y}` : y.toString();
    return `(${xStr};${yStr})`;
  };

  // Générer une nouvelle question
  const newQuestion = useCallback(() => {
    // Fonction pour générer une question aléatoire
    const generateQuestion = () => {
      // Générer d'abord un point de départ
      const startX = randomInt(-2, 2);
      const startY = randomInt(-2, 2);

      // Puis générer un vecteur qui garde le point d'arrivée visible
      const maxVectorX = Math.min(4, 4 - Math.abs(startX));
      const maxVectorY = Math.min(4, 4 - Math.abs(startY));

      const vectorX = randomInt(-maxVectorX, maxVectorX);
      const vectorY = randomInt(-maxVectorY, maxVectorY);

      // S'assurer qu'on a un vecteur non nul
      if (vectorX === 0 && vectorY === 0) {
        return generateQuestion(); // Regenerer si vecteur nul
      }

      const questionTypes = [
        // Type 1: Coordonnées du vecteur
        {
          question: `Quelles sont les coordonnées du vecteur représenté ?`,
          correctAnswer: formatCoordinate(vectorX, vectorY),
          wrongAnswers: [
            formatCoordinate(vectorY, vectorX),
            formatCoordinate(-vectorX, vectorY),
            formatCoordinate(vectorX, -vectorY)
          ]
        }
      ];

      const questionType = questionTypes[0];
      
      // S'assurer que toutes les réponses sont différentes
      const correctAnswer = questionType.correctAnswer;
      const wrongAnswers = questionType.wrongAnswers.filter(answer => answer !== correctAnswer);
      
      // Ajouter des réponses alternatives si nécessaire
      while (wrongAnswers.length < 3) {
        const randomX = randomInt(-4, 4);
        const randomY = randomInt(-4, 4);
        const newWrongAnswer = formatCoordinate(randomX, randomY);
        if (newWrongAnswer !== correctAnswer && !wrongAnswers.includes(newWrongAnswer)) {
          wrongAnswers.push(newWrongAnswer);
        }
      }

      const options = [correctAnswer, ...wrongAnswers.slice(0, 3)];

      // Mélanger les options
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }

      const correctIndex = options.indexOf(correctAnswer);

      return {
        question: questionType.question,
        options,
        correctAnswer: correctIndex,
        explanation: `La bonne réponse est ${correctAnswer}`,
        vectorX,
        vectorY,
        startX,
        startY
      };
    };

    const question = generateQuestion();
    setCurrentQuestion(question);
    setShowAnswer(false);
    setSelectedAnswer(null);
  }, []);

  // Gérer la réponse
  const handleAnswer = (answerIndex) => {
    if (showAnswer) return;

    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    setQuestionCount((prev) => prev + 1);

    if (answerIndex === currentQuestion?.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    // Passer automatiquement à la question suivante après 2 secondes
    setTimeout(() => {
      if (questionCount + 1 >= maxQuestions) {
        // Fin du jeu
        setGamePhase('finished');
      } else {
        newQuestion();
      }
    }, 2000);
  };

  // Initialiser avec une première question
  useEffect(() => {
    newQuestion();
  }, [newQuestion]);

  // Terminer le jeu et retourner à l'app principale
  const finishGame = () => {
    if (onGameEnd) {
      onGameEnd({ score, total: questionCount });
    }
  };

  if (gamePhase === 'finished') {
    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>🎉 Jeu terminé !</Text>
          <Text style={styles.resultScore}>Score final: {score}/{questionCount}</Text>
          <Text style={styles.resultPercentage}>
            {Math.round((score / questionCount) * 100)}% de réussite
          </Text>
          <TouchableOpacity style={styles.finishButton} onPress={finishGame}>
            <Text style={styles.finishButtonText}>Retour au cours</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  // Coordonnées du vecteur pour l'affichage
  const A = {
    x: origin.x + currentQuestion.startX * unit,
    y: origin.y - currentQuestion.startY * unit
  };
  const B = {
    x: A.x + currentQuestion.vectorX * unit,
    y: A.y - currentQuestion.vectorY * unit
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.score}>
          Score: {score}/{questionCount} | Question {questionCount + 1}/{maxQuestions}
        </Text>
      </View>

      <Text style={styles.title}>Vecteur AB</Text>

      <Svg height={height} width={width} style={styles.svg}>
        {/* Grille */}
        {[...Array(11)].map((_, i) => (
          <Line
            key={`v${i}`}
            x1={i * unit}
            y1={0}
            x2={i * unit}
            y2={height}
            stroke="#eee"
          />
        ))}
        {[...Array(11)].map((_, i) => (
          <Line
            key={`h${i}`}
            x1={0}
            y1={i * unit}
            x2={width}
            y2={i * unit}
            stroke="#eee"
          />
        ))}

        {/* Axes */}
        <Line
          x1={0}
          y1={origin.y}
          x2={width}
          y2={origin.y}
          stroke="black"
          strokeWidth="2"
        />
        <Line
          x1={origin.x}
          y1={0}
          x2={origin.x}
          y2={height}
          stroke="black"
          strokeWidth="2"
        />

        {/* Pointe de flèche */}
        <Defs>
          <Marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <Path d="M0,0 L10,5 L0,10 z" fill="red" />
          </Marker>
        </Defs>

        {/* Vecteur AB */}
        <Line
          x1={A.x}
          y1={A.y}
          x2={B.x}
          y2={B.y}
          stroke="red"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />

        {/* Points A et B */}
        <Circle cx={A.x} cy={A.y} r="3" fill="blue" />
        <Circle cx={B.x} cy={B.y} r="3" fill="blue" />
      </Svg>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>{currentQuestion.question}</Text>

        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === index && (
                index === currentQuestion.correctAnswer
                  ? styles.correctOption
                  : styles.wrongOption
              ),
              showAnswer && index === currentQuestion.correctAnswer && styles.correctOption
            ]}
            onPress={() => handleAnswer(index)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}

        {showAnswer && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanation}>{currentQuestion.explanation}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  svg: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  questionContainer: {
    width: '100%',
  },
  question: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  correctOption: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
  },
  wrongOption: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
  },
  optionText: {
    fontSize: 14,
    textAlign: 'center',
  },
  explanationContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
  },
  explanation: {
    fontSize: 14,
    textAlign: 'center',
    color: '#0066cc',
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 20,
  },
  resultScore: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  resultPercentage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  finishButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});