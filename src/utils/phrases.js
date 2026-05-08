import { FALLBACK_QUOTES } from '../constants/app';

export const buildAiLikePhrase = (mood) => {
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

export const getFallbackQuoteByDate = (date = new Date()) => {
  const index = date.getDate() % FALLBACK_QUOTES.length;
  return FALLBACK_QUOTES[index];
};
