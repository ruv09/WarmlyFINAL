import { Mood } from "../types";

/**
 * Единственное место, где перечислены настроения.
 * Добавление нового настроения = один объект в этом массиве,
 * без изменений в hooks, store, services или (позже) в UI.
 */
export const MOOD_CATALOG: Mood[] = [
  { id: "calm", label: "Спокойствие", emoji: "🌿", color: "#8FB996" },
  { id: "joy", label: "Радость", emoji: "🌞", color: "#F4C15C" },
  { id: "gratitude", label: "Благодарность", emoji: "🌸", color: "#E8A0BF" },
  { id: "sadness", label: "Грусть", emoji: "🌧️", color: "#7C93C3" },
  { id: "anxiety", label: "Тревога", emoji: "🌪️", color: "#B98EA7" },
  { id: "tiredness", label: "Усталость", emoji: "🌙", color: "#8492A6" },
  { id: "anger", label: "Раздражение", emoji: "🔥", color: "#D08770" },
];

const moodById = new Map(MOOD_CATALOG.map((mood) => [mood.id, mood]));

export function getMoodById(id: string): Mood | undefined {
  return moodById.get(id);
}

export function requireMoodById(id: string): Mood {
  const mood = getMoodById(id);
  if (!mood) throw new Error(`Unknown mood id: ${id}`);
  return mood;
}
