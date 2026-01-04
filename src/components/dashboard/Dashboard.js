import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/config';

export default function Dashboard({ user, onLogout, userProgress, onContinueLearning }) {
  const [userStats, setUserStats] = useState({
    name: '',
    totalScore: 0,
    lessonsCompleted: 0,
    lastActivity: null,
    level: 'Débutant',
    badges: []
  });

  useEffect(() => {
    loadUserStats();
  }, [userProgress]);

  const loadUserStats = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const completedLessons = Object.keys(userProgress || {}).length;
        const totalScore = calculateTotalScore(userProgress || {});
        
        setUserStats({
          name: userData.name || 'Utilisateur',
          totalScore: totalScore,
          lessonsCompleted: completedLessons,
          lastActivity: userData.lastActivity,
          level: determineLevel(completedLessons),
          badges: calculateBadges(completedLessons, totalScore)
        });

        // Mettre à jour les stats dans Firebase
        await updateDoc(doc(db, 'users', user.uid), {
          progress: userProgress || {},
          totalScore: totalScore,
          lessonsCompleted: completedLessons,
          lastActivity: new Date()
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    }
  };

  const calculateTotalScore = (progress) => {
    // Simuler un score basé sur les leçons terminées
    return Object.keys(progress).length * 100;
  };

  const determineLevel = (completedLessons) => {
    if (completedLessons >= 50) return 'Expert 🏆';
    if (completedLessons >= 25) return 'Avancé 🌟';
    if (completedLessons >= 10) return 'Intermédiaire ⭐';
    return 'Débutant 🌱';
  };

  const calculateBadges = (completedLessons, totalScore) => {
    const badges = [];
    
    if (completedLessons >= 1) badges.push('🎯 Premier pas');
    if (completedLessons >= 5) badges.push('📚 Studieux');
    if (completedLessons >= 10) badges.push('🔥 En feu');
    if (completedLessons >= 25) badges.push('💎 Brillant');
    if (totalScore >= 1000) badges.push('⚡ Fulgurant');
    
    return badges;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const getProgressPercentage = () => {
    // Simuler un pourcentage basé sur les leçons terminées
    const totalAvailableLessons = 100; // Nombre estimé de leçons disponibles
    return Math.min(Math.round((userStats.lessonsCompleted / totalAvailableLessons) * 100), 100);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Bonjour,</Text>
          <Text style={styles.userName}>{userStats.name} ! 👋</Text>
          <Text style={styles.level}>{userStats.level}</Text>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Overview */}
      <View style={styles.progressCard}>
        <Text style={styles.cardTitle}>📈 Votre Progression</Text>
        
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]} />
        </View>
        <Text style={styles.progressText}>{getProgressPercentage()}% terminé</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{userStats.lessonsCompleted}</Text>
            <Text style={styles.statLabel}>Leçons</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{userStats.totalScore}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{userStats.badges.length}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>
      </View>

      {/* Badges */}
      <View style={styles.badgesCard}>
        <Text style={styles.cardTitle}>🏆 Vos Badges</Text>
        <View style={styles.badgesContainer}>
          {userStats.badges.length > 0 ? (
            userStats.badges.map((badge, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noBadges}>Terminez des leçons pour gagner des badges !</Text>
          )}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>🚀 Actions rapides</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={onContinueLearning}>
          <Text style={styles.actionEmoji}>📖</Text>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Continuer l'apprentissage</Text>
            <Text style={styles.actionDescription}>Reprendre là où vous vous êtes arrêté</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionEmoji}>🎯</Text>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Défi du jour</Text>
            <Text style={styles.actionDescription}>Testez vos connaissances</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionEmoji}>📊</Text>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Voir les statistiques</Text>
            <Text style={styles.actionDescription}>Analysez votre progression</Text>
          </View>
          <Text style={styles.actionArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentCard}>
        <Text style={styles.cardTitle}>⏰ Activité récente</Text>
        {userStats.lastActivity ? (
          <Text style={styles.lastActivity}>
            Dernière connexion : {new Date(userStats.lastActivity.seconds * 1000).toLocaleDateString('fr-FR')}
          </Text>
        ) : (
          <Text style={styles.lastActivity}>Première visite ! Bienvenue sur Scholaria 🎉</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    color: '#64748b',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  level: {
    fontSize: 16,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }
    })
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  badgesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }
    })
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: '#92400e',
    fontWeight: '600',
    fontSize: 14,
  },
  noBadges: {
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  actionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }
    })
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  actionArrow: {
    fontSize: 18,
    color: '#94a3b8',
  },
  recentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }
    })
  },
  lastActivity: {
    fontSize: 14,
    color: '#64748b',
  },
});