import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/app';

export default function FavoritesScreen({ favorites, removeFav }) {
  return (
    <ScrollView contentContainerStyle={styles.p}>
      <Text style={styles.title}>Избранные фразы</Text>
      {favorites.length === 0 ? <Text style={styles.empty}>Пока ничего не сохранено</Text> : null}
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
  title: { fontSize: 32, color: COLORS.text, fontWeight: '700' },
  empty: { color: COLORS.muted },
  card: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 18 },
  quote: { fontSize: 20, fontStyle: 'italic', color: COLORS.text, lineHeight: 30 },
  btn: { color: COLORS.peach, marginTop: 10, fontWeight: '700' },
});