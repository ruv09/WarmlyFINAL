import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, TAB_LABELS } from '../constants/app';

export default function BottomNav({ tab, setTab }) {
  return (
    <View style={styles.nav}>
      {Object.keys(TAB_LABELS).map((t) => (
        <TouchableOpacity key={t} onPress={() => setTab(t)}>
          <Text style={[styles.navItem, tab === t && { color: COLORS.peach }]}>{TAB_LABELS[t]}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  navItem: { color: '#9aa7b1', fontSize: 15 },
});
