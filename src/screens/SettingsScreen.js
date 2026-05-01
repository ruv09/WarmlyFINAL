import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { COLORS } from '../constants/app';

export default function SettingsScreen({ state, setState }) {
  return (
    <View style={styles.p}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  p: { padding: 20, gap: 12 },
  title: { fontSize: 42, color: COLORS.peach, fontWeight: '700' },
  sub: { color: '#4b545d', fontSize: 18 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, padding: 14, marginTop: 8 },
  aiCopyWrap: { flex: 1, paddingRight: 10 },
  aiTitle: { color: COLORS.text, fontWeight: '700' },
  aiSub: { color: COLORS.muted, marginTop: 2 },
});
