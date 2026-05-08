import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/app';

export default function HomeScreen({ quoteOfDay, onAddFav, goMood }) {
  return (
    <ScrollView contentContainerStyle={styles.p}>
      <Text style={styles.logo}>Warmly</Text>
      <Text style={styles.h1}>Добрый вечер</Text>
      <Text style={styles.sub}>Как ты себя чувствуешь сегодня?</Text>
      <View style={styles.card}>
        <Text style={styles.quote}>{quoteOfDay}</Text>
        <TouchableOpacity onPress={onAddFav}><Text style={styles.btn}>🧡 В избранное</Text></TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.cta} onPress={goMood}><Text style={styles.ctaText}>☺️ Как прошёл твой день?</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  p: { padding: 20, gap: 12 },
  logo: { fontSize: 44, color: COLORS.peach, fontWeight: '700' },
  h1: { fontSize: 40, fontWeight: '800', color: COLORS.text },
  sub: { color: '#4b545d', fontSize: 18 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 18 },
  quote: { fontSize: 26, fontStyle: 'italic', color: COLORS.text, lineHeight: 36 },
  btn: { color: COLORS.peach, marginTop: 10, fontWeight: '700' },
  cta: { marginTop: 18, backgroundColor: COLORS.peach, borderRadius: 999, padding: 18, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 24, fontWeight: '700' },
});
