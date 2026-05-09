import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, TAB_LABELS } from '../constants/app';

export default function BottomNav({ tab, setTab }) {
  return (
    <View style={styles.nav}>
      {Object.keys(TAB_LABELS).map((t) => (
 codex/review-warmlyfinal-github-repository-kth12e
        <TouchableOpacity key={t} onPress={() => setTab(t)} style={styles.item}>
          <Text style={[styles.navItem, tab === t && styles.active]}>{TAB_LABELS[t]}</Tex
        <TouchableOpacity key={t} onPress={() => setTab(t)}>
          <Text style={[styles.navItem, tab === t && { color: COLORS.peach }]}>{TAB_LABELS[t]}</Text>
 main
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
codex/review-warmlyfinal-github-repository-kth12e
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

    backgroundColor: '#fff',
    paddingVertical: 18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  navItem: { color: '#9aa7b1', fontSize: 15 },
 main
});
