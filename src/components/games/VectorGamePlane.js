import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Line, G, Text as SvgText, Polyline } from 'react-native-svg';
import { auth, db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * VectorGamePlane
 * - QCM-style vector quiz
 * - Draws an orthonormal grid and overlays the vector for the current question
 * - Keeps the "race to 10" mechanic from the previous game
 *
 * Note: requires `react-native-svg` in the project.
 */

const SIZE = 320; // svg viewport square
const UNITS = 8; // +/- units on each axis
const STEP = SIZE / (UNITS * 2);

const questions = [
  {
    id: 'q1',
    question: "Quel est A + B si A(2,3) et B(1,4)",
    vector: { x: 2, y: 3 },
    options: ['(3,7)', '(3,1)', '(2,4)', '(1,-1)'],
    correctIndex: 0
  },
  {
    id: 'q2',
    question: 'Norme de V(3,4)?',
    vector: { x: 3, y: 4 },
    options: ['5', '7', '12', '√7'],
    correctIndex: 0
  },
  {
    id: 'q3',
    question: '2 × U(1,-2)',
    vector: { x: 1, y: -2 },
    options: ['(2,-4)', '(2,-2)', '(3,-2)', '(1,-4)'],
    correctIndex: 0
  }
];

function toSvgCoords(vec) {
  // convert cartesian (units) to svg coordinates
  const cx = SIZE / 2 + vec.x * STEP;
  const cy = SIZE / 2 - vec.y * STEP;
  return { cx, cy };
}

const VectorArrow = ({ x, y, color = '#ef4444' }) => {
  const { cx, cy } = toSvgCoords({ x, y });
  const origin = toSvgCoords({ x: 0, y: 0 });
  const dx = cx - origin.cx;
  const dy = cy - origin.cy;
  // simple arrow as polyline: origin -> head -> small wings
  const headLen = Math.min(20, Math.hypot(dx, dy) * 0.2);
  const angle = Math.atan2(dy, dx);
  const hx = cx - headLen * Math.cos(angle);
  const hy = cy - headLen * Math.sin(angle);
  // wings
  const wing1 = {
    x: hx + 8 * Math.cos(angle + Math.PI / 2),
    y: hy + 8 * Math.sin(angle + Math.PI / 2)
  };
  const wing2 = {
    x: hx + 8 * Math.cos(angle - Math.PI / 2),
    y: hy + 8 * Math.sin(angle - Math.PI / 2)
  };

  const points = `${origin.cx},${origin.cy} ${cx},${cy} ${wing1.x},${wing1.y} ${cx},${cy} ${wing2.x},${wing2.y}`;

  return <Polyline points={points} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />;
};

const VectorGamePlane = ({ onGameEnd }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (correctAnswers >= 10 && !gameEnded) {
      const finalTime = Math.round((Date.now() - startTime) / 1000);
      setTimeSpent(finalTime);
      setGameEnded(true);
    }
  }, [correctAnswers, gameEnded, startTime]);

  const q = questions[index];

  const handleValidate = () => {
    if (selected === null) return;
    const isCorrect = selected === q.correctIndex;
    if (isCorrect) setCorrectAnswers(c => c + 1);
    setTotalAnswers(t => t + 1);
    // next question
    setTimeout(() => {
      setSelected(null);
      setIndex((i) => (i + 1) % questions.length);
    }, 500);
  };

  const saveResult = async () => {
    setIsSubmitting(true);
    try {
      const userId = auth.currentUser?.uid || 'anon-test';
      const resultData = {
        studentId: userId,
        lessonId: '2nde-vecteurs',
        lessonTitle: 'Vecteurs - Plan orthonormé',
        score: correctAnswers,
        total: 10,
        percentage: Math.round((correctAnswers / 10) * 100),
        timeSpent,
        totalAttempts: totalAnswers,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'results'), resultData);
      if (onGameEnd) onGameEnd(resultData);
    } catch (err) {
      console.error(err);
      Alert.alert('Erreur', 'Impossible de sauvegarder le résultat.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (gameEnded) {
    return (
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.title}>🏁 Tu as gagné !</Text>
          <Text style={styles.stat}>Bonnes réponses : {correctAnswers}/10</Text>
          <Text style={styles.stat}>Temps : {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, '0')}</Text>
          <TouchableOpacity style={styles.button} onPress={saveResult} disabled={isSubmitting}>
            <Text style={styles.buttonText}>{isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#f8fafc", "#eef2ff"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>✅ {correctAnswers}/10</Text>
        <Text style={styles.headerText}>Tentatives: {totalAnswers}</Text>
      </View>

      <View style={styles.svgWrapper}>
        <Svg width={SIZE} height={SIZE}>
          <G>
            {/* grid lines */}
            {Array.from({ length: UNITS * 2 + 1 }).map((_, i) => {
              const pos = i * STEP;
              const color = i === UNITS ? '#1f2937' : '#e6e6e6';
              return (
                <Line key={`v-${i}`} x1={pos} y1={0} x2={pos} y2={SIZE} stroke={color} strokeWidth={i === UNITS ? 1.6 : 0.8} />
              );
            })}

            {Array.from({ length: UNITS * 2 + 1 }).map((_, i) => {
              const pos = i * STEP;
              const color = i === UNITS ? '#1f2937' : '#e6e6e6';
              return (
                <Line key={`h-${i}`} x1={0} y1={pos} x2={SIZE} y2={pos} stroke={color} strokeWidth={i === UNITS ? 1.6 : 0.8} />
              );
            })}

            {/* axes arrows */}
            <Line x1={SIZE / 2} y1={0} x2={SIZE / 2} y2={10} stroke="#111827" strokeWidth={2} />
            <Line x1={SIZE / 2} y1={SIZE} x2={SIZE / 2} y2={SIZE - 10} stroke="#111827" strokeWidth={2} />
            <Line x1={0} y1={SIZE / 2} x2={10} y2={SIZE / 2} stroke="#111827" strokeWidth={2} />
            <Line x1={SIZE} y1={SIZE / 2} x2={SIZE - 10} y2={SIZE / 2} stroke="#111827" strokeWidth={2} />

            {/* current question vector */}
            <VectorArrow x={q.vector.x} y={q.vector.y} color="#ef4444" />

            {/* labels for axes units (simple) */}
            {[-UNITS, -UNITS + 1, -UNITS + 2, -UNITS + 3, -UNITS + 4, -UNITS + 5, -UNITS + 6, -UNITS + 7, -UNITS + 8].map((u, i) => {
              const pos = SIZE / 2 + u * STEP;
              return (
                <SvgText key={`xl-${i}`} x={pos} y={SIZE / 2 + 14} fontSize="8" fill="#111827" textAnchor="middle">{u}</SvgText>
              );
            })}
          </G>
        </Svg>
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>{q.question}</Text>
        {q.options.map((opt, i) => (
          <TouchableOpacity key={i} style={[styles.option, selected === i && styles.optionSelected]} onPress={() => setSelected(i)}>
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={[styles.validate, selected === null && styles.disabled]} onPress={handleValidate} disabled={selected === null}>
          <Text style={styles.validateText}>Valider</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 12, flexDirection: 'row', justifyContent: 'space-between' },
  headerText: { fontSize: 16, fontWeight: '700' },
  svgWrapper: { alignItems: 'center', justifyContent: 'center', padding: 12 },
  card: { padding: 12 },
  question: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  option: { padding: 10, borderRadius: 8, backgroundColor: '#fff', marginVertical: 6 },
  optionSelected: { backgroundColor: '#fde68a' },
  optionText: { fontSize: 16 },
  validate: { marginTop: 10, backgroundColor: '#10b981', padding: 12, borderRadius: 8, alignItems: 'center' },
  disabled: { backgroundColor: '#94a3b8' },
  validateText: { color: '#fff', fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#fff' },
  stat: { color: '#fff', marginTop: 8 }
});

export default VectorGamePlane;
