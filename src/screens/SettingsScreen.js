import React from 'react';
import { View, Text, Switch, StyleSheet, TextInput } from 'react-native';
import { COLORS } from '../constants/app';

export default function SettingsScreen({ state, setState }) {
  return (
    <View style={styles.p}>
      <Text style={styles.title}>Профиль и настройки</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Имя</Text>
        <TextInput value={state.name} onChangeText={(v) => setState((prev) => ({ ...prev, name: v }))} style={styles.input} placeholder='Ваше имя' />
      </View>
      <View style={styles.row}><Text>Уведомления</Text><Switch value={state.notifications} onValueChange={(v) => setState((prev) => ({ ...prev, notifications: v }))} /></View>
      <Text style={styles.sub}>Утреннее: {state.morning} / Вечернее: {state.evening}</Text>
      <View style={styles.row}><Text>ИИ-фразы дня</Text><Switch value={state.aiEnabled} onValueChange={(v) => setState((prev) => ({ ...prev, aiEnabled: v }))} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  p: { padding: 20, gap: 12 },
  title: { fontSize: 30, color: COLORS.text, fontWeight: '700' },
  card: { backgroundColor: COLORS.surface, borderRadius: 18, padding: 14 },
  label: { color: COLORS.muted, fontSize: 13, marginBottom: 6 },
  input: { backgroundColor: '#FAF7F3', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  sub: { color: COLORS.muted, fontSize: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 18, padding: 14 },
});
