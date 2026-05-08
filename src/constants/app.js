export const STORAGE_KEY = 'warmly_state';

export const COLORS = {
  bg: '#F5F2F2',
  peach: '#FF8E72',
  text: '#222D37',
  card: '#F7F4F0',
  muted: '#95A3AD',
};

export const FALLBACK_QUOTES = [
  'Каждый новый день — это новая глава в книге твоей жизни. Напиши её красиво.',
  'Ты справляешься лучше, чем тебе кажется.',
  'Иногда отдых — это тоже прогресс.',
];

export const MOOD_ITEMS = [
  { key: 'bad', emoji: '😔', label: 'Плохо' },
  { key: 'normal', emoji: '😐', label: 'Нормально' },
  { key: 'good', emoji: '😊', label: 'Хорошо' },
];

export const TAB_LABELS = {
  home: 'Главная',
  mood: 'Настроение',
  fav: 'Избранное',
  settings: 'Настройки',
};

export const DEFAULT_STATE = {
  mood: null,
  favorites: [],
  notifications: true,
  morning: '08:00',
  evening: '22:00',
  aiEnabled: false,
};
