import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/app';

export default function HomeScreen({ quoteOfDay, onAddFav, goMood, name }) {
  return (
    <ScrollView contentContainerStyle={styles.p}>
      <Text style={styles.title}>Доброе утро, {name} ☀️</Text>
      <Text style={styles.sub}>Позаботься о себе сегодня</Text>

      <View style={styles.progressCard}>
        <View>
          <Text style={styles.small}>Прогресс дня</Text>
          <Text style={styles.big}>3 / 5</Text>
          <Text style={styles.small}>практик выполнено</Text>
        </View>
        <View style={styles.progressBadge}><Text style={styles.progressText}>60%</Text></View>
      </View>

      <Text style={styles.blockTitle}>Мысль дня</Text>
      <View style={styles.card}>
        <Text style={styles.quote}>{quoteOfDay}</Text>
        <TouchableOpacity onPress={onAddFav}><Text style={styles.btn}>🤍 Сохранить</Text></TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.cta} onPress={goMood}><Text style={styles.ctaText}>Как ты себя чувствуешь?</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  p: { padding: 20, gap: 14 },
  title: { fontSize: 34, color: COLORS.text, fontWeight: '700' },
  sub: { color: COLORS.muted, fontSize: 16 },
  progressCard: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  small: { color: COLORS.muted, fontSize: 14 },
  big: { color: COLORS.text, fontWeight: '800', fontSize: 30 },
  progressBadge: { width: 68, height: 68, borderRadius: 34, borderWidth: 4, borderColor: COLORS.peachSoft, alignItems: 'center', justifyContent: 'center' },
  progressText: { color: COLORS.peach, fontWeight: '700' },
  blockTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 18 },
  quote: { fontSize: 22, fontStyle: 'italic', color: COLORS.text, lineHeight: 32 },
  btn: { color: COLORS.peach, marginTop: 10, fontWeight: '700' },
  cta: { marginTop: 10, backgroundColor: COLORS.peach, borderRadius: 999, padding: 16, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
