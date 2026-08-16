import { Mood } from "../types";

/**
 * 5 настроений для выбора в дневнике (как на макете).
 * Старые id оставлены ниже для уже сохранённых записей.
 */
export const MOOD_PICKER_CATALOG: Mood[] = [
  { id: "excellent", label: "Отлично", emoji: "😄", color: "#7FA06F" },
  { id: "good", label: "Хорошо", emoji: "🙂", color: "#A8C89A" },
  { id: "okay", label: "Нормально", emoji: "😐", color: "#E8B75C" },
  { id: "bad", label: "Плохо", emoji: "😕", color: "#D98B6F" },
  { id: "horrible", label: "Ужасно", emoji: "😢", color: "#C45C5C" },
];

/** Полный справочник: пикер + legacy для старых записей. */
export const MOOD_CATALOG: Mood[] = [
  ...MOOD_PICKER_CATALOG,
  { id: "calm", label: "Спокойствие", emoji: "🌿", color: "#8FB996" },
  { id: "joy", label: "Радость", emoji: "🌞", color: "#F4C15C" },
  { id: "gratitude", label: "Благодарность", emoji: "🌸", color: "#E8A0BF" },
  { id: "sadness", label: "Грусть", emoji: "🌧️", color: "#7C93C3" },
  { id: "anxiety", label: "Тревога", emoji: "🌪️", color: "#B98EA7" },
  { id: "tiredness", label: "Усталость", emoji: "🌙", color: "#8492A6" },
  { id: "anger", label: "Раздражение", emoji: "🔥", color: "#D08770" },
];

export const ENTRY_TEXT_MAX = 300;

const moodById = new Map(MOOD_CATALOG.map((mood) => [mood.id, mood]));

export function getMoodById(id: string): Mood | undefined {
  return moodById.get(id);
}

export function requireMoodById(id: string): Mood {
  const mood = getMoodById(id);
  if (!mood) throw new Error(`Unknown mood id: ${id}`);
  return mood;
}
