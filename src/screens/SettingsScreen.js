import React from 'react';
 codex/review-warmlyfinal-github-repository-kth12e
import { View, Text, Switch, StyleSheet, TextInput } from 'react-native';

import { View, Text, Switch, StyleSheet } from 'react-native';
main
import { COLORS } from '../constants/app';

export default function SettingsScreen({ state, setState }) {
  return (
    <View style={styles.p}>
 codex/review-warmlyfinal-github-repository-kth12e
      <Text style={styles.title}>Профиль и настройки</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Имя</Text>
        <TextInput value={state.name} onChangeText={(v) => setState((prev) => ({ ...prev, name: v }))} style={styles.input} placeholder='Ваше имя' />
      </View>
      <View style={styles.row}><Text>Уведомления</Text><Switch value={state.notifications} onValueChange={(v) => setState((prev) => ({ ...prev, notifications: v }))} /></View>
      <Text style={styles.sub}>Утреннее: {state.morning} / Вечернее: {state.evening}</Text>
      <View style={styles.row}><Text>ИИ-фразы дня</Text><Switch value={state.aiEnabled} onValueChange={(v) => setState((prev) => ({ ...prev, aiEnabled: v }))} /></View>

      <Text style={styles.title}>⚙️ Настройки</Text>
      <View style={styles.row}>
        <Text>Уведомления</Text>
        <Switch value={state.notifications} onValueChange={(v) => setState((prev) => ({ ...prev, notifications: v }))} />
      </View>
      <Text style={styles.sub}>Утреннее: {state.morning} / Вечернее: {state.evening}</Text>
      <View style={styles.row}>
        <View style={styles.aiCopyWrap}>
          <Text style={styles.aiTitle}>ИИ-фразы дня</Text>
          <Text style={styles.aiSub}>Генерировать поддерживающие фразы по настроению</Text>
        </View>
        <Switch value={state.aiEnabled} onValueChange={(v) => setState((prev) => ({ ...prev, aiEnabled: v }))} />
      </View>
 main
    </View>
  );
}

const styles = StyleSheet.create({
  p: { padding: 20, gap: 12 },
codex/review-warmlyfinal-github-repository-kth12e
  title: { fontSize: 30, color: COLORS.text, fontWeight: '700' },
  card: { backgroundColor: COLORS.surface, borderRadius: 18, padding: 14 },
  label: { color: COLORS.muted, fontSize: 13, marginBottom: 6 },
  input: { backgroundColor: '#FAF7F3', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  sub: { color: COLORS.muted, fontSize: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 18, padding: 14 },

  title: { fontSize: 42, color: COLORS.peach, fontWeight: '700' },
  sub: { color: '#4b545d', fontSize: 18 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, padding: 14, marginTop: 8 },
  aiCopyWrap: { flex: 1, paddingRight: 10 },
  aiTitle: { color: COLORS.text, fontWeight: '700' },
  aiSub: { color: COLORS.muted, marginTop: 2 },
 main
});
