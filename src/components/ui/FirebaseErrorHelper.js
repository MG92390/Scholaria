import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const FirebaseErrorHelper = ({ error }) => {
  const showFirebaseHelp = () => {
    Alert.alert(
      '🔧 Configuration Firebase requise',
      `L'erreur "${error}" indique que Firebase n'est pas correctement configuré.\n\n` +
      '✅ Solutions:\n' +
      '1. Ouvrez Firebase Console\n' +
      '2. Allez dans Authentication > Sign-in method\n' +
      '3. Activez "Email/Password"\n' +
      '4. Dans Firestore Database > Rules, utilisez:\n\n' +
      'rules_version = \'2\';\n' +
      'service cloud.firestore {\n' +
      '  match /databases/{database}/documents {\n' +
      '    match /{document=**} {\n' +
      '      allow read, write: if request.auth != null;\n' +
      '    }\n' +
      '  }\n' +
      '}',
      [{ text: 'OK', style: 'default' }]
    );
  };

  if (!error || !error.includes('operation-not-allowed')) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.helpButton} onPress={showFirebaseHelp}>
        <Text style={styles.helpEmoji}>🔧</Text>
        <Text style={styles.helpText}>Configuration Firebase requise</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: 'center',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  helpEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  helpText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FirebaseErrorHelper;