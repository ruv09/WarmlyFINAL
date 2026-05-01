import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, MOOD_ITEMS } from '../constants/app';

export default function MoodScreen({ mood, setMood }) {
  return (
    <View style={styles.p}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  p: { padding: 20, gap: 12 },
  title: { fontSize: 42, color: COLORS.peach, fontWeight: '700' },
  h2: { fontSize: 34, fontWeight: '800', color: COLORS.text },
  moodRow: { flexDirection: 'row', gap: 8 },
  mood: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 16, alignItems: 'center', padding: 18, gap: 8 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 18 },
  note: { textAlign: 'center', fontStyle: 'italic', fontSize: 21, lineHeight: 30 },
});
