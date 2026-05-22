export const FALLBACK_QUOTES = [
  "Сегодня можно быть мягче к себе.",
  "Ты справляешься лучше, чем тебе кажется.",
  "Иногда отдых — это тоже прогресс.",
  "Даже маленький шаг сегодня имеет значение.",
  "Ты важен. Твои чувства имеют значение.",
  "Ты не один, и с тобой всё в порядке.",
  "Каждый новый день — это новая страница твоей истории.",
  "Береги себя — это тоже сила.",
  "Позволь себе просто быть сегодня.",
  "Твоё присутствие уже имеет ценность.",
  "Маленькие победы тоже считаются.",
  "Ты заслуживаешь доброты — особенно от себя.",
];

export const MOOD_ITEMS = [
  { key: "good", emoji: "🙂", label: "Хорошо", color: "#FCE8C5" },
  { key: "calm", emoji: "😌", label: "Спокойно", color: "#DDF3EC" },
  { key: "neutral", emoji: "😐", label: "Нейтрально", color: "#F2EDE7" },
  { key: "tired", emoji: "🥱", label: "Устал(а)", color: "#E8F1E8" },
  { key: "anxious", emoji: "😟", label: "Тревожно", color: "#F8E4E4" },
  { key: "sad", emoji: "😔", label: "Грустно", color: "#EAE4F8" },
] as const;

export type MoodKey = (typeof MOOD_ITEMS)[number]["key"];

const RECENT_PHRASE_WINDOW = 7;

const openings: Record<string, string[]> = {
  good: [
    "Сохрани это тепло — и поделись им.",
    "Твоя радость заразительна.",
    "Хороший день заслуживает хорошего вечера.",
  ],
  calm: [
    "Спокойствие — это тоже сила.",
    "Тишина внутри — редкий дар.",
    "Ты в балансе, и это ценно.",
  ],
  neutral: [
    "Нейтральный день — это тоже день.",
    "Спокойный день — тоже хороший день.",
    "Не каждый день должен быть особенным.",
  ],
  tired: [
    "Ты много сделал(а). Теперь можно отдохнуть.",
    "Усталость — знак того, что ты старался(ась).",
    "Позволь себе замедлиться сегодня.",
  ],
  anxious: [
    "Сегодня можно быть мягче к себе.",
    "Тревога пройдёт — ты справишься.",
    "Ты не обязан быть сильным каждую минуту.",
  ],
  sad: [
    "Грусть — это тоже часть тебя. Это нормально.",
    "Ты не один в своей грусти.",
    "Даже в тёмный день есть маленький свет.",
  ],
  default: [
    "Ты важен. Твои чувства имеют значение.",
    "Ты не один, и с тобой всё в порядке.",
    "Сегодня достаточно просто быть собой.",
  ],
};

const middles = [
  "Сделай глубокий вдох и один маленький шаг вперёд.",
  "Поблагодари себя за то, что продолжаешь идти.",
  "Сегодня достаточно сделать чуть-чуть.",
  "Ты заслуживаешь доброты — особенно от себя.",
];

const endings = ["Warmly рядом 💛", "Ты справишься 🌿", "Береги себя ✨", "С любовью, Warmly 🍊"];

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const buildAiPhrase = (mood: MoodKey | null): string => {
  const moodOpenings = mood ? openings[mood] ?? openings.default : openings.default;
  return `${pick(moodOpenings)} ${pick(middles)} ${pick(endings)}`;
};

export const buildUniqueAiPhrase = (mood: MoodKey | null, recentPhrases: string[]): string => {
  const blocked = new Set(recentPhrases.slice(-RECENT_PHRASE_WINDOW));
  const attempts = 30;
  for (let i = 0; i < attempts; i += 1) {
    const candidate = buildAiPhrase(mood);
    if (!blocked.has(candidate)) return candidate;
  }
  return buildAiPhrase(mood);
};

export const getFallbackQuote = (date: Date = new Date()): string => {
  const index = date.getDate() % FALLBACK_QUOTES.length;
  return FALLBACK_QUOTES[index];
};

export const getGreeting = (name: string): string => {
  const hour = new Date().getHours();
  let greeting = "Привет";
  if (hour >= 5 && hour < 12) greeting = "Доброе утро";
  else if (hour >= 12 && hour < 17) greeting = "Добрый день";
  else if (hour >= 17 && hour < 22) greeting = "Добрый вечер";
  else greeting = "Доброй ночи";
  return name ? `${greeting}, ${name}` : greeting;
};
