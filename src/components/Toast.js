import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

export const Toast = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <View style={styles.toastContainer} pointerEvents="none">
      <View style={styles.toastCard}>
        <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
        <Text style={styles.toastText}>{toastMessage}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
  },
});
