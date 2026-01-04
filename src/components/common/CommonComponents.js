import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

export function Header({ title, canGoBack, onBack }) {
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

export function Card({ title, subtitle, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
    </TouchableOpacity>
  );
}

export function Badge({ text }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

export function SectionHeader({ title }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  backBtnPlaceholder: { 
    width: 36, 
    height: 36 
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
  }
});