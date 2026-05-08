export const STORAGE_KEY = 'warmly_state';

export const COLORS = {
  bg: '#F8F4EF',
  surface: '#FFFFFF',
  peach: '#D29A6A',
  peachSoft: '#F4E7D8',
  text: '#2F2B28',
  muted: '#8B8178',
  card: '#FFFCF8',
  mint: '#DDF3EC',
  rose: '#F8E4E4',
  lavender: '#EAE4F8',
};

export const FALLBACK_QUOTES = [
  'Сегодня можно быть мягче к себе.',
  'Ты справляешься лучше, чем тебе кажется.',
  'Иногда отдых — это тоже прогресс.',
  'Даже маленький шаг сегодня имеет значение.',
];

export const MOOD_ITEMS = [
  { key: 'good', emoji: '🙂', label: 'Хорошо', color: '#FCE8C5' },
  { key: 'calm', emoji: '😌', label: 'Спокойно', color: '#DDF3EC' },
  { key: 'neutral', emoji: '😐', label: 'Нейтрально', color: '#F2EDE7' },
  { key: 'tired', emoji: '🥱', label: 'Устал(а)', color: '#E8F1E8' },
  { key: 'anxious', emoji: '😟', label: 'Тревожно', color: '#F8E4E4' },
  { key: 'sad', emoji: '😔', label: 'Грустно', color: '#EAE4F8' },
];

export const TAB_LABELS = {
  home: 'Главная',
  mood: 'Настроение',
  fav: 'Избранное',
  settings: 'Профиль',
};

export const DEFAULT_STATE = {
  mood: null,
  favorites: [],
  notifications: true,
  morning: '08:00',
  evening: '22:00',
  aiEnabled: false,
  note: '',
  name: 'Анастасия',
};