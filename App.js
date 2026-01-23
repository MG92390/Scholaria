import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LEVELS, PRIMAIRE_SUBLEVELS, COLLEGE_SUBLEVELS, LYCEE_SUBLEVELS, SUBJECTS_BY_LEVEL, CONTENT } from './src/data/data';
import VectorCoordinatesGame from './src/components/games/VectorCoordinatesGame';
import VectorGamePlane from './src/components/games/VectorGamePlane';
import FractionsGameCM1 from './src/components/games/FractionsGameCM1';
import AuthScreen from './src/app/AuthScreen';
import Dashboard from './src/components/dashboard/Dashboard';
import { useAuth } from './src/hooks/useAuth';

export default function App() {
  const { user, loading, userProgress, updateProgress, logout } = useAuth();
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'levels' | 'primaire-sublevels' | 'college-sublevels' | 'lycee-sublevels' | 'subjects' | 'content' | 'lesson' | 'quiz' | 'game'
  const [selectedLevel, setSelectedLevel] = useState(null); // id
  const [selectedSubLevel, setSelectedSubLevel] = useState(null); // id pour les sous-niveaux
  const [selectedSubject, setSelectedSubject] = useState(null); // id
  const [selectedLesson, setSelectedLesson] = useState(null); // lesson object
  const [query, setQuery] = useState('');

  // Utiliser la progression depuis Firebase au lieu du localStorage
  const progress = userProgress;

  // Supprimer la gestion localStorage car on utilise Firebase
  // useEffect(() => {
  //   if (Platform.OS === 'web') {
  //     try {
  //       const raw = window.localStorage.getItem('ssrn_progress');
  //       if (raw) setProgress(JSON.parse(raw));
  //     } catch (e) {}
  //   }
  // }, []);
  // useEffect(() => {
  //   if (Platform.OS === 'web') {
  //     try {
  //       window.localStorage.setItem('ssrn_progress', JSON.stringify(progress));
  //     } catch (e) {}
  //   }
  // }, [progress]);

  const goBack = () => {
    if (view === 'quiz' || view === 'lesson' || view === 'game') {
      setView('content');
      setSelectedLesson(null);
    } else if (view === 'content') {
      setView('subjects');
    } else if (view === 'subjects') {
      if (selectedLevel === 'primaire') {
        setView('primaire-sublevels');
      } else if (selectedLevel === 'college') {
        setView('college-sublevels');
      } else if (selectedLevel === 'lycee') {
        setView('lycee-sublevels');
      } else {
        setView('levels');
        setSelectedLevel(null);
      }
      setSelectedSubject(null);
      setSelectedSubLevel(null);
    } else if (view === 'primaire-sublevels' || view === 'college-sublevels' || view === 'lycee-sublevels') {
      setView('levels');
      setSelectedLevel(null);
      setSelectedSubLevel(null);
    } else if (view === 'levels') {
      setView('dashboard');
    }
    setQuery('');
  };

  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === 'web' ? 'auto' : 'dark'} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : !user ? (
        <AuthScreen onAuthSuccess={() => setView('dashboard')} />
      ) : view === 'dashboard' ? (
        <Dashboard
          user={user}
          onLogout={() => {
            logout();
            setView('dashboard');
          }}
          userProgress={progress}
          onContinueLearning={() => setView('levels')}
        />
      ) : (
        <>
          <Header
            title={
              view === 'levels'
                ? 'Scholaria - Apprentissage'
                : view === 'primaire-sublevels'
                  ? 'Primaire - Choisir le niveau'
                  : view === 'college-sublevels'
                    ? 'Collège - Choisir le niveau'
                    : view === 'lycee-sublevels'
                      ? 'Lycée - Choisir le niveau'
                      : view === 'subjects'
                        ? `Matières — ${labelForLevel(selectedSubLevel || selectedLevel)}`
                        : view === 'content'
                          ? `${labelForSubject(selectedSubLevel || selectedLevel, selectedSubject)}`
                          : view === 'lesson'
                            ? 'Leçon'
                            : selectedLesson?.title || 'Quiz'
            }
            canGoBack={true}
            onBack={goBack}
          />

          <SearchBar value={query} onChange={setQuery} visible={view !== 'content' && view !== 'quiz'} />

          {view === 'levels' && (
            <LevelsList
              query={query}
              onSelect={(lvl) => {
                setSelectedLevel(lvl.id);
                if (lvl.id === 'primaire') {
                  setView('primaire-sublevels');
                } else if (lvl.id === 'college') {
                  setView('college-sublevels');
                } else if (lvl.id === 'lycee') {
                  setView('lycee-sublevels');
                } else {
                  setView('subjects');
                }
                setQuery('');
              }}
            />
          )}

          {view === 'primaire-sublevels' && (
            <SubLevelsList
              query={query}
              subLevels={PRIMAIRE_SUBLEVELS}
              onSelect={(subLevel) => {
                setSelectedSubLevel(subLevel.id);
                setView('subjects');
                setQuery('');
              }}
            />
          )}

          {view === 'college-sublevels' && (
            <SubLevelsList
              query={query}
              subLevels={COLLEGE_SUBLEVELS}
              onSelect={(subLevel) => {
                setSelectedSubLevel(subLevel.id);
                setView('subjects');
                setQuery('');
              }}
            />
          )}

          {view === 'lycee-sublevels' && (
            <SubLevelsList
              query={query}
              subLevels={LYCEE_SUBLEVELS}
              onSelect={(subLevel) => {
                setSelectedSubLevel(subLevel.id);
                setView('subjects');
                setQuery('');
              }}
            />
          )}

          {view === 'subjects' && (selectedLevel || selectedSubLevel) && (
            <SubjectsList
              level={selectedSubLevel || selectedLevel}
              query={query}
              onSelect={(subject) => {
                setSelectedSubject(subject.id);
                setView('content');
              }}
            />
          )}

          {view === 'content' && (selectedLevel || selectedSubLevel) && selectedSubject && (
            <ContentList
              level={selectedSubLevel || selectedLevel}
              subject={selectedSubject}
              progress={progress}
              onViewLesson={(lesson) => {
                setSelectedLesson(lesson);
                setView('lesson');
              }}
              onStartQuiz={(lesson) => {
                setSelectedLesson(lesson);
                setView('quiz');
              }}
              onStartGame={(lesson) => {
                setSelectedLesson(lesson);
                setView('game');
              }}
            />
          )}

          {view === 'lesson' && selectedLesson && (
            <LessonView
              lesson={selectedLesson}
              onBack={() => setView('content')}
            />
          )}

          {view === 'quiz' && selectedLesson && (
            <QuizView
              lesson={selectedLesson}
              onDone={(score) => {
                if (selectedLesson?.id) {
                  const result = {
                    score: score.correct || score.score || 0,
                    total: score.total || score.questions?.length || 0,
                    timeSpent: score.timeSpent || 0,
                    lessonTitle: selectedLesson.title,
                    subject: selectedSubject,
                    level: selectedSubLevel || selectedLevel
                  };
                  updateProgress(selectedLesson.id, true, result);
                }
                setView('content');
                setSelectedLesson(null);
              }}
              onOpenGame={() => {
                // Open the associated game (keeps selectedLesson)
                setView('game');
              }}
            />
          )}

          {view === 'game' && selectedLesson && (
            <View style={{ flex: 1 }}>
              {selectedLesson.id === '2nde-vecteurs' ? (
                <VectorGamePlane
                  onGameEnd={(result) => {
                    if (selectedLesson?.id) {
                      const gameResult = {
                        score: result.score || 0,
                        total: result.total || 0,
                        timeSpent: result.timeSpent || 0,
                        lessonTitle: selectedLesson.title,
                        subject: selectedSubject,
                        level: selectedSubLevel || selectedLevel
                      };
                      updateProgress(selectedLesson.id, true, gameResult);
                    }
                    setView('content');
                    setSelectedLesson(null);
                  }}
                />
              ) : selectedLesson.id === 'cm1-fractions' ? (
                <FractionsGameCM1
                  onGameEnd={(result) => {
                    if (selectedLesson?.id) {
                      const gameResult = {
                        score: result.score || 0,
                        total: result.total || 0,
                        timeSpent: result.timeSpent || 0,
                        lessonTitle: selectedLesson.title,
                        subject: selectedSubject,
                        level: selectedSubLevel || selectedLevel
                      };
                      updateProgress(selectedLesson.id, true, gameResult);
                    }
                    setView('content');
                    setSelectedLesson(null);
                  }}
                />
              ) : (
                <VectorCoordinatesGame
                  onGameEnd={(result) => {
                    if (selectedLesson?.id) {
                      const gameResult = {
                        score: result.score || 0,
                        total: result.total || 0,
                        timeSpent: result.timeSpent || 0,
                        lessonTitle: selectedLesson.title,
                        subject: selectedSubject,
                        level: selectedSubLevel || selectedLevel
                      };
                      updateProgress(selectedLesson.id, true, gameResult);
                    }
                    setView('content');
                    setSelectedLesson(null);
                  }}
                />
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
}

function labelForLevel(levelId) {
  // Chercher dans les niveaux principaux
  const level = LEVELS.find((l) => l.id === levelId);
  if (level) return level.label;

  // Chercher dans les sous-niveaux du primaire
  const primaireSubLevel = PRIMAIRE_SUBLEVELS.find((sl) => sl.id === levelId);
  if (primaireSubLevel) return primaireSubLevel.label;

  // Chercher dans les sous-niveaux du collège
  const collegeSubLevel = COLLEGE_SUBLEVELS.find((sl) => sl.id === levelId);
  if (collegeSubLevel) return collegeSubLevel.label;

  // Chercher dans les sous-niveaux du lycée
  const lyceeSubLevel = LYCEE_SUBLEVELS.find((sl) => sl.id === levelId);
  if (lyceeSubLevel) return lyceeSubLevel.label;

  return '';
}

function labelForSubject(levelId, subjectId) {
  return SUBJECTS_BY_LEVEL[levelId]?.find((s) => s.id === subjectId)?.label ?? '';
}

function Header({ title, canGoBack, onBack }) {
  return (
    <View style={styles.header}>
      {canGoBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backTxt}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.backBtnPlaceholder} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.backBtnPlaceholder} />
    </View>
  );
}

function SearchBar({ value, onChange, visible }) {
  if (!visible) return null;
  return (
    <View style={styles.searchBar}>
      <TextInput
        placeholder="Rechercher..."
        value={value}
        onChangeText={onChange}
        style={styles.searchInput}
        clearButtonMode="while-editing"
      />
    </View>
  );
}

function LevelsList({ query, onSelect }) {
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? LEVELS.filter((l) => l.label.toLowerCase().includes(q)) : LEVELS;
  }, [query]);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Card title={item.label} subtitle="Choisir ce niveau" onPress={() => onSelect(item)} />
      )}
    />
  );
}

function SubLevelsList({ query, subLevels, onSelect }) {
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? subLevels.filter((l) => l.label.toLowerCase().includes(q)) : subLevels;
  }, [query, subLevels]);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Card title={item.label} subtitle="Choisir ce niveau" onPress={() => onSelect(item)} />
      )}
    />
  );
}

function SubjectsList({ level, query, onSelect }) {
  const subjects = SUBJECTS_BY_LEVEL[level] ?? [];
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? subjects.filter((s) => s.label.toLowerCase().includes(q)) : subjects;
  }, [query, subjects]);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Card title={item.label} subtitle="Ouvrir les cours" onPress={() => onSelect(item)} />
      )}
    />
  );
}

function ContentList({ level, subject, progress, onViewLesson, onStartQuiz, onStartGame }) {
  const lessons = CONTENT[level]?.[subject] ?? [];
  if (!lessons.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Pas encore de contenu</Text>
        <Text style={styles.emptyText}>Du contenu pour cette matière sera ajouté prochainement.</Text>
      </View>
    );
  }

  // Organiser les chapitres par catégorie pour les maths de 3ème
  const organizedData = [];
  if (level === '3eme' && subject === 'maths') {
    // Géométrie
    organizedData.push({ type: 'header', title: '🔺 GÉOMÉTRIE' });
    lessons.slice(0, 5).forEach(item => organizedData.push({ type: 'chapter', ...item }));

    // Algèbre
    organizedData.push({ type: 'header', title: '🧮 ALGÈBRE' });
    lessons.slice(5, 10).forEach(item => organizedData.push({ type: 'chapter', ...item }));

    // Statistiques et Probabilités
    organizedData.push({ type: 'header', title: '📊 STATISTIQUES ET PROBABILITÉS' });
    lessons.slice(10, 12).forEach(item => organizedData.push({ type: 'chapter', ...item }));

    // Applications numériques
    organizedData.push({ type: 'header', title: '💯 APPLICATIONS NUMÉRIQUES' });
    lessons.slice(12).forEach(item => organizedData.push({ type: 'chapter', ...item }));
  } else {
    // Pour les autres matières, afficher normalement
    lessons.forEach(item => organizedData.push({ type: 'chapter', ...item }));
  }

  return (
    <FlatList
      data={organizedData}
      keyExtractor={(item, index) => item.type === 'header' ? `header-${index}` : item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        if (item.type === 'header') {
          return <SectionHeader title={item.title} />;
        }
        return (
          <ChapterCard
            title={item.title}
            hasLesson={!!item.lesson}
            hasQuiz={Array.isArray(item.quiz) && item.quiz.length > 0}
            hasGame={!!item.hasGame}
            completed={!!progress[item.id]}
            onViewLesson={() => onViewLesson(item)}
            onStartQuiz={() => onStartQuiz(item)}
            onStartGame={() => onStartGame(item)}
          />
        );
      }}
    />
  );
}

function Card({ title, subtitle, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
    </TouchableOpacity>
  );
}

function SectionHeader({ title }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

function ChapterCard({ title, hasLesson, hasQuiz, hasGame, completed, onViewLesson, onStartQuiz, onStartGame }) {
  return (
    <View style={styles.chapterCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={styles.chapterTitle}>{title}</Text>
        {completed ? <Badge text="Terminé" /> : null}
      </View>

      <View style={styles.buttonContainer}>
        {hasLesson ? (
          <TouchableOpacity onPress={onViewLesson} style={[styles.actionBtn, styles.lessonBtn]}>
            <Text style={styles.lessonBtnText}>📖 Leçon</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.actionBtn, styles.disabledBtn]}>
            <Text style={styles.disabledBtnText}>📖 Leçon (bientôt)</Text>
          </View>
        )}

        {hasQuiz ? (
          <TouchableOpacity onPress={onStartQuiz} style={[styles.actionBtn, styles.quizBtn]}>
            <Text style={styles.quizBtnText}>🎯 Exercices</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.actionBtn, styles.disabledBtn]}>
            <Text style={styles.disabledBtnText}>🎯 Exercices (bientôt)</Text>
          </View>
        )}

        {hasGame ? (
          <TouchableOpacity onPress={onStartGame} style={[styles.actionBtn, styles.gameBtn]}>
            <Text style={styles.gameBtnText}>🎮 Jeu</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

function LessonView({ lesson, onBack }) {
  if (!lesson?.lesson) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Aucune leçon disponible</Text>
        <TouchableOpacity onPress={onBack} style={styles.quizBtn}>
          <Text style={styles.quizBtnText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.lessonContainer}>
      <Text style={styles.lessonTitlePage}>{lesson.title}</Text>
      <Text style={styles.lessonContent}>{lesson.lesson}</Text>
    </View>
  );
}

function Badge({ text }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

function QuizView({ lesson, onDone, onOpenGame }) {
  const questions = Array.isArray(lesson?.quiz) ? lesson.quiz : [];
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!questions.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Aucun quiz disponible</Text>
        <TouchableOpacity onPress={() => onDone(0)} style={styles.quizBtn}>
          <Text style={styles.quizBtnText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = questions[idx];

  const submit = () => {
    if (selected == null) return;
    if (selected === q.correctIndex) setScore((s) => s + 1);
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <View style={styles.quizContainer}>
        <Text style={styles.quizTitle}>Résultat</Text>
        <Text style={styles.quizScore}>{score} / {questions.length}</Text>
        <TouchableOpacity onPress={() => onDone(score)} style={styles.quizBtn}>
          <Text style={styles.quizBtnText}>Terminer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.quizContainer}>
      {lesson?.hasGame ? (
        <TouchableOpacity onPress={() => typeof onOpenGame === 'function' && onOpenGame()} style={[styles.actionBtn, styles.gameBtn, { alignSelf: 'flex-end', marginBottom: 12 }]}>
          <Text style={styles.gameBtnText}>🎮 Jouer au jeu</Text>
        </TouchableOpacity>
      ) : null}
      <Text style={styles.quizTitle}>{lesson.title}</Text>
      <Text style={styles.quizQuestion}>{q.question}</Text>
      {q.options.map((opt, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => setSelected(i)}
          style={[styles.quizOption, selected === i && styles.quizOptionSelected]}
        >
          <Text style={[styles.quizOptionText, selected === i && styles.quizOptionTextSelected]}>{opt}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={submit} style={[styles.quizBtn, { marginTop: 16 }]}>
        <Text style={styles.quizBtnText}>{idx + 1 === questions.length ? 'Voir le résultat' : 'Suivant'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fb'
  },
  header: {
    paddingTop: Platform.OS === 'web' ? 20 : 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomColor: '#e9e9ef',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827'
  },
  backBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f1f4'
  },
  backTxt: {
    fontSize: 18,
    color: '#374151'
  },
  backBtnPlaceholder: { width: 36, height: 36 },
  searchBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomColor: '#e9e9ef',
    borderBottomWidth: 1
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 16
  },
  list: {
    padding: 16,
    gap: 12
  },
  sectionHeader: {
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb'
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
    letterSpacing: 0.5
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827'
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6b7280'
  },
  chapterCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderColor: '#e5e7eb',
    borderWidth: 1
  },
  chapterTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
  },
  actionBtn: {
    flex: 1,
    minWidth: 90,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  lessonBtn: {
    backgroundColor: '#10b981'
  },
  lessonBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15
  },
  gameBtn: {
    backgroundColor: '#8b5cf6'
  },
  gameBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15
  },
  disabledBtn: {
    backgroundColor: '#f3f4f6'
  },
  disabledBtnText: {
    color: '#9ca3af',
    fontWeight: '600',
    fontSize: 15
  },
  lessonContainer: {
    flex: 1,
    padding: 20
  },
  lessonTitlePage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center'
  },
  lessonContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    textAlign: 'justify'
  },
  lessonCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderColor: '#e5e7eb',
    borderWidth: 1
  },
  quizBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 12
  },
  quizBtnText: {
    color: '#ffffff',
    fontWeight: '600'
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8
  },
  lessonBody: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center'
  },
  badge: {
    backgroundColor: '#10b98122',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999
  },
  badgeText: {
    color: '#047857',
    fontWeight: '600',
    fontSize: 12
  },
  quizContainer: {
    flex: 1,
    padding: 16
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: '700'
  },
  quizQuestion: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 8
  },
  quizOption: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10
  },
  quizOptionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff'
  },
  quizOptionText: {
    color: '#111827'
  },
  quizOptionTextSelected: {
    color: '#1d4ed8',
    fontWeight: '600'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
  }
});
