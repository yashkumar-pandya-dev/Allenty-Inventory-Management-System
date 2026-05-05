import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function StatusBadge({ stock, minStock }) {
  const isLow = stock <= minStock;

  return (
    <View style={[styles.badge, isLow ? styles.lowBadge : styles.goodBadge]}>
      <Feather
        name={isLow ? "alert-triangle" : "check-circle"}
        size={14}
        color={isLow ? "#EF4444" : "#10B981"}
      />
      <Text style={[styles.text, isLow ? styles.lowText : styles.goodText]}>
        {isLow ? 'Low Stock' : 'Healthy'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  lowBadge: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
    borderWidth: 1
  },
  goodBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#D1FAE5',
    borderWidth: 1
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6
  },
  lowText: { color: '#EF4444' },
  goodText: { color: '#10B981' }
});