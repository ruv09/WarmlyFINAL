import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/app';

export default function FavoritesScreen({ favorites, removeFav }) {
  return (
    <ScrollView contentContainerStyle={styles.p}>
codex/review-warmlyfinal-github-repository-kth12e
      <Text style={styles.title}>Избранные фразы</Text>
      {favorites.length === 0 ? <Text style={styles.empty}>Пока ничего не сохранено</Text> : null}

      <Text style={styles.title}>💝 Избранное</Text>
 main
      {favorites.map((q, i) => (
        <View key={`${q}-${i}`} style={styles.card}>
          <Text style={styles.quote}>"{q}"</Text>
          <TouchableOpacity onPress={() => removeFav(q)}><Text style={styles.btn}>Удалить</Text></TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  p: { padding: 20, gap: 12 },
 codex/review-warmlyfinal-github-repository-kth12e
  title: { fontSize: 32, color: COLORS.text, fontWeight: '700' },
  empty: { color: COLORS.muted },
  card: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 18 },
  quote: { fontSize: 20, fontStyle: 'italic', color: COLORS.text, lineHeight: 30 },

  title: { fontSize: 42, color: COLORS.peach, fontWeight: '700' },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 18 },
  quote: { fontSize: 26, fontStyle: 'italic', color: COLORS.text, lineHeight: 36 },
main
  btn: { color: COLORS.peach, marginTop: 10, fontWeight: '700' },
});
