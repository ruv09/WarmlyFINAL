/**
 * Поддерживающие фразы — перенесены из Warmly v1.
 * Генерация локальная, без сервера. Дедупликация по недавнему окну,
 * чтобы ежедневные фразы не ощущались повторяющимися.
 */

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

export const SUPPORT_AFTER_SAVE = [
  "Спасибо, что заглянул(а) к себе 💛 Это важно.",
  "Запись сохранена. Ты молодец, что следишь за собой 🌿",
  "Ты не один(а). Warmly рядом ✨",
  "Отлично! Каждая запись — шаг к лучшему пониманию себя 🌸",
  "Сохранено. Береги себя сегодня 🍊",
];

const RECENT_PHRASE_WINDOW = 7;

const openings = [
  "Ты важен. Твои чувства имеют значение.",
  "Ты не один, и с тобой всё в порядке.",
  "Сегодня достаточно просто быть собой.",
  "Ты справляешься лучше, чем тебе кажется.",
  "Каждый шаг вперёд — это победа.",
  "Береги себя — это тоже сила.",
  "Позволь себе просто быть сегодня.",
  "Маленькие победы тоже считаются.",
  "Твоё присутствие уже имеет ценность.",
  "Ты заслуживаешь доброты — особенно от себя.",
  "Иногда отдых — это тоже прогресс.",
  "Каждый новый день — это новая страница.",
];

const middles = [
  "Сделай глубокий вдох и один маленький шаг вперёд.",
  "Поблагодари себя за то, что продолжаешь идти.",
  "Сегодня достаточно сделать чуть-чуть.",
  "Ты заслуживаешь доброты — особенно от себя.",
  "Замедлись и прислушайся к себе.",
  "Дай себе то тепло, которое отдаёшь другим.",
];

const endings = [
  "Warmly рядом 💛",
  "Ты справишься 🌿",
  "Береги себя ✨",
  "С любовью, Warmly 🍊",
  "Мы рядом 🌸",
  "Всё будет хорошо 🌤",
];

const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

export const buildAiPhrase = (): string =>
  `${pick(openings)} ${pick(middles)} ${pick(endings)}`;

export const buildUniqueAiPhrase = (recentPhrases: string[]): string => {
  const blocked = new Set(recentPhrases.slice(-RECENT_PHRASE_WINDOW));
  for (let i = 0; i < 30; i += 1) {
    const candidate = buildAiPhrase();
    if (!blocked.has(candidate)) return candidate;
  }
  return buildAiPhrase();
};

export const getFallbackQuote = (date: Date = new Date()): string => {
  const index = date.getDate() % FALLBACK_QUOTES.length;
  return FALLBACK_QUOTES[index]!;
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

export const pickSupportPhrase = (): string => pick(SUPPORT_AFTER_SAVE);
