const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

const quotes = [
  'Каждый новый день — это новая глава в книге твоей жизни. Напиши её красиво.',
  'Ты справляешься лучше, чем тебе кажется.',
  'Иногда отдых — это тоже прогресс.',
  'Маленькие шаги сегодня дают большие результаты завтра.'
];

const moodSupport = {
  bad: 'Мне жаль, что сегодня тяжело. Ты не один, и это состояние пройдёт.',
  normal: 'Нормальный день — это тоже хорошо. Дай себе поддержку и время.',
  good: 'Отличное состояние! Сохрани это тепло и поделись им с близкими.'
};

let favorites = [];
let settings = {
  notifications: true,
  morning: '08:00',
  evening: '22:00',
  language: 'ru'
};

app.get('/health', (_, res) => res.json({ ok: true, service: 'warmly-backend' }));

app.get('/api/quote/today', (_, res) => {
  const index = new Date().getDate() % quotes.length;
  res.json({ quote: quotes[index] });
});

app.post('/api/mood', (req, res) => {
  const { mood } = req.body;
  if (!['bad', 'normal', 'good'].includes(mood)) {
    return res.status(400).json({ error: 'Mood must be bad|normal|good' });
  }
  return res.json({ mood, support: moodSupport[mood] });
});

app.get('/api/favorites', (_, res) => res.json({ favorites }));

app.post('/api/favorites', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required' });
  }
  if (!favorites.includes(text)) favorites.push(text);
  return res.status(201).json({ favorites });
});

app.delete('/api/favorites', (req, res) => {
  const { text } = req.body;
  favorites = favorites.filter((q) => q !== text);
  return res.json({ favorites });
});

app.get('/api/settings', (_, res) => res.json(settings));

app.put('/api/settings', (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

app.listen(PORT, () => {
  console.log(`Warmly backend running on http://localhost:${PORT}`);
});
