import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, TAB_LABELS } from '../constants/app';

export default function BottomNav({ tab, setTab }) {
  return (
    <View style={styles.nav}>
      {Object.keys(TAB_LABELS).map((t) => (
        <TouchableOpacity key={t} onPress={() => setTab(t)} style={styles.item}>
          <Text style={[styles.navItem, tab === t && styles.active]}>{TAB_LABELS[t]}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: '#EFE6DC',
  },
  item: { paddingHorizontal: 6, paddingVertical: 4 },
  navItem: { color: '#A99E94', fontSize: 13, fontWeight: '500' },
  active: { color: COLORS.peach, fontWeight: '700' },
});
