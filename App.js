import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = { bg: '#F5F2F2', peach: '#FF8E72', text: '#222D37', card: '#F7F4F0', muted: '#95A3AD' };
const FALLBACK_QUOTES = [
  'Каждый новый день — это новая глава в книге твоей жизни. Напиши её красиво.',
  'Ты справляешься лучше, чем тебе кажется.',
  'Иногда отдых — это тоже прогресс.',
];

const buildAiLikePhrase = (mood) => {
  const openings = {
    bad: ['Сегодня можно быть мягче к себе.', 'Ты не обязан быть сильным каждую минуту.'],
    normal: ['Спокойный день — тоже хороший день.', 'Ты в балансе, и это ценно.'],
    good: ['Сохрани это тепло и поделись им.', 'Твоя энергия вдохновляет!'],
    defaultMood: ['Ты важен. Твои чувства имеют значение.', 'Ты не один, и с тобой всё в порядке.'],
  };
  const mids = ['Сделай глубокий вдох и один маленький шаг вперёд.', 'Поблагодари себя за то, что продолжаешь идти.', 'Сегодня достаточно сделать чуть-чуть.'];
  const endings = ['Warmly рядом 💛', 'Ты справишься 🌿', 'Береги себя ✨'];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  return `${pick(openings[mood] || openings.defaultMood)} ${pick(mids)} ${pick(endings)}`;
};

export default function App() {
  const [tab, setTab] = useState('home');
  const [state, setState] = useState({
    mood: null,
    favorites: [],
    notifications: true,
    morning: '08:00',
    evening: '22:00',
    aiEnabled: false,
  });

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('warmly_state');
      if (raw) setState((prev) => ({ ...prev, ...JSON.parse(raw) }));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('warmly_state', JSON.stringify(state));
  }, [state]);

  const quoteOfDay = useMemo(() => {
    if (state.aiEnabled) return buildAiLikePhrase(state.mood);
    const index = new Date().getDate() % FALLBACK_QUOTES.length;
    return FALLBACK_QUOTES[index];
  }, [state.aiEnabled, state.mood]);

  const addFav = () =>
    setState((s) => ({
      ...s,
      favorites: s.favorites.includes(quoteOfDay) ? s.favorites : [...s.favorites, quoteOfDay],
    }));

  const removeFav = (q) => setState((s) => ({ ...s, favorites: s.favorites.filter((x) => x !== q) }));

  const screen = useMemo(
    () => ({
      home: (
        <ScrollView contentContainerStyle={styles.p}>
          <Text style={styles.logo}>Warmly</Text>
          <Text style={styles.h1}>Добрый вечер</Text>
          <Text style={styles.sub}>Как ты себя чувствуешь сегодня?</Text>
          <View style={styles.card}>
            <Text style={styles.quote}>{quoteOfDay}</Text>
            <TouchableOpacity onPress={addFav}>
              <Text style={styles.btn}>🧡 В избранное</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.cta} onPress={() => setTab('mood')}>
            <Text style={styles.ctaText}>☺️ Как прошёл твой день?</Text>
          </TouchableOpacity>
        </ScrollView>
      ),
      mood: (
        <View style={styles.p}>
          <Text style={styles.title}>Настроение</Text>
          <Text style={styles.h2}>Как прошёл твой день?</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              ['bad', '😔', 'Плохо'],
              ['normal', '😐', 'Нормально'],
              ['good', '😊', 'Хорошо'],
            ].map(([k, e, l]) => (
              <TouchableOpacity
                key={k}
                style={[styles.mood, state.mood === k && { borderColor: COLORS.peach, backgroundColor: '#fff' }]}
                onPress={() => setState((s) => ({ ...s, mood: k }))}
              >
                <Text>{e}</Text>
                <Text>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.card}>
            <Text style={styles.note}>💡 Регулярная оценка настроения помогает лучше понимать себя и свои эмоции</Text>
          </View>
        </View>
      ),
      fav: (
        <ScrollView contentContainerStyle={styles.p}>
          <Text style={styles.title}>💝 Избранное</Text>
          {state.favorites.map((q, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.quote}>"{q}"</Text>
              <TouchableOpacity onPress={() => removeFav(q)}>
                <Text style={styles.btn}>Удалить</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ),
      settings: (
        <View style={styles.p}>
          <Text style={styles.title}>⚙️ Настройки</Text>
          <View style={styles.row}>
            <Text>Уведомления</Text>
            <Switch
              value={state.notifications}
              onValueChange={(v) => setState((s) => ({ ...s, notifications: v }))}
            />
          </View>
          <Text style={styles.sub}>Утреннее: {state.morning} / Вечернее: {state.evening}</Text>

          <View style={styles.row}>
            <View>
              <Text style={{ color: COLORS.text, fontWeight: '700' }}>ИИ-фразы дня</Text>
              <Text style={{ color: COLORS.muted, marginTop: 2 }}>Генерировать поддерживающие фразы по настроению</Text>
            </View>
            <Switch
              value={state.aiEnabled}
              onValueChange={(v) => setState((s) => ({ ...s, aiEnabled: v }))}
            />
          </View>
        </View>
      ),
    })[tab],
    [tab, state, quoteOfDay],
  );

  return (
    <SafeAreaView style={styles.bg}>
      {screen}
      <View style={styles.nav}>
        {['home', 'mood', 'fav', 'settings'].map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)}>
            <Text style={[styles.navItem, tab === t && { color: COLORS.peach }]}>
              {{ home: 'Главная', mood: 'Настроение', fav: 'Избранное', settings: 'Настройки' }[t]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: COLORS.bg },
  p: { padding: 20, gap: 12 },
  logo: { fontSize: 44, color: COLORS.peach, fontWeight: '700' },
  h1: { fontSize: 40, fontWeight: '800', color: COLORS.text },
  h2: { fontSize: 34, fontWeight: '800', color: COLORS.text },
  sub: { color: '#4b545d', fontSize: 18 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 18 },
  quote: { fontSize: 26, fontStyle: 'italic', color: COLORS.text, lineHeight: 36 },
  btn: { color: COLORS.peach, marginTop: 10, fontWeight: '700' },
  cta: { marginTop: 18, backgroundColor: COLORS.peach, borderRadius: 999, padding: 18, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  title: { fontSize: 42, color: COLORS.peach, fontWeight: '700' },
  note: { textAlign: 'center', fontStyle: 'italic', fontSize: 21, lineHeight: 30 },
  mood: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 16, alignItems: 'center', padding: 18, gap: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginTop: 8,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  navItem: { color: '#9aa7b1', fontSize: 15 },
});
