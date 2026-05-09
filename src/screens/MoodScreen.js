import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, MOOD_ITEMS } from '../constants/app';

export default function MoodScreen({ mood, setMood }) {
  return (
    <View style={styles.p}>
codex/review-warmlyfinal-github-repository-kth12e
      <Text style={styles.title}>Как ты себя чувствуешь?</Text>
      <Text style={styles.sub}>Твой настрой помогает персонализировать поддержку</Text>
      <View style={styles.grid}>
        {MOOD_ITEMS.map((item) => (
          <TouchableOpacity key={item.key} style={[styles.mood, { backgroundColor: item.color }, mood === item.key && styles.active]} onPress={() => setMood(item.key)}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.noteCard}>
        <Text style={styles.note}>Регулярная оценка настроения помогает лучше понимать себя 🌿</Text>
      </View>

      <Text style={styles.title}>Настроение</Text>
      <Text style={styles.h2}>Как прошёл твой день?</Text>
      <View style={styles.moodRow}>
        {MOOD_ITEMS.map((item) => (
          <TouchableOpacity key={item.key} style={[styles.mood, mood === item.key && { borderColor: COLORS.peach, backgroundColor: '#fff' }]} onPress={() => setMood(item.key)}>
            <Text>{item.emoji}</Text><Text>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.card}><Text style={styles.note}>💡 Регулярная оценка настроения помогает лучше понимать себя и свои эмоции</Text></View>
 main
    </View>
  );
}

const styles = StyleSheet.create({
  p: { padding: 20, gap: 12 },
 codex/review-warmlyfinal-github-repository-kth12e
  title: { fontSize: 36, color: COLORS.text, fontWeight: '700' },
  sub: { color: COLORS.muted, fontSize: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  mood: { width: '31%', borderRadius: 18, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  active: { borderColor: COLORS.peach },
  emoji: { fontSize: 24 },
  label: { marginTop: 8, color: COLORS.text, fontWeight: '600', fontSize: 13 },
  noteCard: { marginTop: 10, backgroundColor: COLORS.surface, borderRadius: 20, padding: 16 },
  note: { textAlign: 'center', color: COLORS.muted, fontSize: 16, lineHeight: 22 },

  title: { fontSize: 42, color: COLORS.peach, fontWeight: '700' },
  h2: { fontSize: 34, fontWeight: '800', color: COLORS.text },
  moodRow: { flexDirection: 'row', gap: 8 },
  mood: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 16, alignItems: 'center', padding: 18, gap: 8 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 18 },
  note: { textAlign: 'center', fontStyle: 'italic', fontSize: 21, lineHeight: 30 },
 main
});
