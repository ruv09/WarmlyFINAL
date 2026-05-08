import React from 'react';
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/app';

export default function FavoritesScreen({ favorites, removeFav }) {
  return (
    <ScrollView contentContainerStyle={styles.p}>
      <Text style={styles.title}>💝 Избранное</Text>
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
  title: { fontSize: 42, color: COLORS.peach, fontWeight: '700' },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 18 },
  quote: { fontSize: 26, fontStyle: 'italic', color: COLORS.text, lineHeight: 36 },
  btn: { color: COLORS.peach, marginTop: 10, fontWeight: '700' },
});
