import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { COLORS } from './src/constants/app';
import usePersistedState from './src/hooks/usePersistedState';
import { buildAiLikePhrase, getFallbackQuoteByDate } from './src/utils/phrases';
import HomeScreen from './src/screens/HomeScreen';
import MoodScreen from './src/screens/MoodScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import BottomNav from './src/components/BottomNav';

export default function App() {
  const [tab, setTab] = useState('home');
  const [state, setState] = usePersistedState();

  const quoteOfDay = useMemo(
    () => (state.aiEnabled ? buildAiLikePhrase(state.mood) : getFallbackQuoteByDate()),
    [state.aiEnabled, state.mood],
  );

  const addFav = () => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.includes(quoteOfDay)
        ? prev.favorites
        : [...prev.favorites, quoteOfDay],
    }));
  };

  const removeFav = (q) => {
    setState((prev) => ({
      ...prev,
      favorites: prev.favorites.filter((x) => x !== q),
    }));
  };

  return (
    <SafeAreaView style={styles.bg}>
      {tab === 'home' && (
        <HomeScreen quoteOfDay={quoteOfDay} onAddFav={addFav} goMood={() => setTab('mood')} name={state.name} />
      )}
      {tab === 'mood' && (
        <MoodScreen mood={state.mood} setMood={(m) => setState((prev) => ({ ...prev, mood: m }))} />
      )}
      {tab === 'fav' && <FavoritesScreen favorites={state.favorites} removeFav={removeFav} />}
      {tab === 'settings' && <SettingsScreen state={state} setState={setState} />}
      <BottomNav tab={tab} setTab={setTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: COLORS.bg },
});