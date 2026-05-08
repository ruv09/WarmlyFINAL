import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_STATE, STORAGE_KEY } from '../constants/app';

export default function usePersistedState() {
  const [state, setState] = useState(DEFAULT_STATE);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw || !mounted) return;
        setState((prev) => ({ ...prev, ...JSON.parse(raw) }));
      } catch (_) {}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  return [state, setState];
}
