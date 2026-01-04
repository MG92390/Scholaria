import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { fetchStudentStats, fetchStudentResults, formatStats, formatResult } from '../../services/FirebaseFunctionsService';

/**
 * Composant d'exemple : Affiche les stats et résultats de l'élève
 * Utilise les Cloud Functions Firebase
 */
const StudentDashboard = ({ studentId }) => {
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' ou 'results'

  useEffect(() => {
    loadData();
  }, [studentId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Charger les stats
      const statsData = await fetchStudentStats({ studentId });
      setStats(formatStats(statsData.stats));

      // Charger les résultats (10 derniers)
      const resultsData = await fetchStudentResults({
        studentId,
        limit: 10
      });
      setResults(resultsData.results.map(formatResult));
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1e40af" />
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <TouchableOpacity onPress={loadData} style={styles.retryBtn}>
          <Text style={styles.retryBtnText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.tabActive]}
          onPress={() => setActiveTab('stats')}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.tabTextActive]}>
            📊 Mes Stats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'results' && styles.tabActive]}
          onPress={() => setActiveTab('results')}
        >
          <Text style={[styles.tabText, activeTab === 'results' && styles.tabTextActive]}>
            📈 Historique
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats View */}
      {activeTab === 'stats' && stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Vos Statistiques</Text>

          <View style={styles.statCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Tentatives</Text>
              <Text style={styles.statValue}>{stats.attempts}</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Score Moyen</Text>
              <Text style={styles.statValue}>{stats.avgScore}%</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Meilleur Score</Text>
              <Text style={styles.statValue}>{stats.bestScore}</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Points Totaux</Text>
              <Text style={styles.statValue}>{stats.totalScore}</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Dernière activité</Text>
              <Text style={styles.statValue}>{stats.lastPlayed}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Results View */}
      {activeTab === 'results' && (
        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>10 Derniers Résultats</Text>

          {results.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Aucun résultat pour le moment</Text>
            </View>
          ) : (
            results.map((result, idx) => (
              <View key={result.id || idx} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultLesson}>{result.lessonTitle}</Text>
                  <View style={[
                    styles.resultBadge,
                    { backgroundColor: result.percentage >= 70 ? '#10b981' : '#ef4444' }
                  ]}>
                    <Text style={styles.resultPercentage}>{result.percentage}%</Text>
                  </View>
                </View>

                <View style={styles.resultDetails}>
                  <Text style={styles.resultDetail}>
                    Score: {result.score} / {result.total}
                  </Text>
                  <Text style={styles.resultDetail}>
                    Temps: {result.timeSpent}
                  </Text>
                  <Text style={styles.resultDetail}>
                    📅 {result.date}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* Refresh Button */}
      <TouchableOpacity onPress={loadData} style={styles.refreshBtn}>
        <Text style={styles.refreshBtnText}>🔄 Rafraîchir</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center'
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center'
  },
  retryBtn: {
    backgroundColor: '#1e40af',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12
  },
  retryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  tabActive: {
    borderBottomColor: '#1e40af'
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b'
  },
  tabTextActive: {
    color: '#1e40af'
  },

  // Stats
  statsContainer: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1e40af'
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500'
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e40af'
  },

  // Results
  resultsContainer: {
    marginBottom: 20
  },
  emptyBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '500'
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  resultLesson: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  resultPercentage: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  },
  resultDetails: {
    gap: 6
  },
  resultDetail: {
    fontSize: 13,
    color: '#64748b'
  },

  // Buttons
  refreshBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16
  },
  refreshBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default StudentDashboard;
