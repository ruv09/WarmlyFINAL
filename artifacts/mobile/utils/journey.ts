import { type MoodKey } from "@/utils/phrases";

 codex/continue-the-discussion-k4xcgp
export interface MoodEntry {

export interface MoodHistoryEntry {
 main
  id: string;
  mood: MoodKey;
  note: string;
  victory?: string;
  createdAt: string;
}

export const VICTORY_MAX_LENGTH = 120;

export const treeByMood: Record<
  MoodKey,
  { emoji: string; title: string; tint: string; softTint: string }
> = {
  good: {
    emoji: "🌳",
    title: "Большое зелёное дерево",
    tint: "#5DAA7A",
    softTint: "#D8F0E8",
  },
  calm: {
    emoji: "🌱",
    title: "Молодое дерево",
    tint: "#6EA98F",
    softTint: "#DDF3EC",
  },
  neutral: {
    emoji: "🌲",
    title: "Классическое дерево",
    tint: "#7C9B6F",
    softTint: "#F2EDE7",
  },
  sad: {
    emoji: "🍂",
    title: "Осеннее дерево",
    tint: "#C4855A",
    softTint: "#FBF0E4",
  },
  anxious: {
    emoji: "🍁",
    title: "Дерево с жёлтыми листьями",
    tint: "#D4A847",
    softTint: "#FCE8C5",
  },
  tired: {
    emoji: "🌲",
    title: "Хвойное дерево",
    tint: "#5D8F73",
    softTint: "#E8F1E8",
  },
};

export function getTreeForMood(mood: MoodKey) {
  return treeByMood[mood];
}

 codex/continue-the-discussion-k4xcgp
export function isBestDay(entry: MoodEntry): boolean {

export function isBestDay(entry: MoodHistoryEntry): boolean {
 main
  return (
    Boolean(entry.victory?.trim()) &&
    (entry.mood === "good" || entry.mood === "calm")
  );
}

export function formatEntryDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

 codex/continue-the-discussion-k4xcgp
export function getJourneyInsights(entries: MoodEntry[]): string[] {

export function getJourneyInsights(entries: MoodHistoryEntry[]): string[] {
 main
  const insights: string[] = [];
  const victories = entries.filter((entry) => entry.victory?.trim()).length;
  const bestDays = entries.filter(isBestDay).length;
  const calmDays = entries.filter((entry) => entry.mood === "calm").length;
  const goodDays = entries.filter((entry) => entry.mood === "good").length;

  if (entries.length >= 3) {
    insights.push(`Ты уже уделил(а) себе внимание ${entries.length} раза.`);
  }

  if (victories >= 2) {
    insights.push(`Ты записал(а) уже ${victories} маленькие победы.`);
  }

  if (bestDays >= 1) {
    insights.push(`У тебя уже ${bestDays} тёплый день с хорошим моментом.`);
  }

  if (calmDays >= 2) {
    insights.push("В последнее время спокойствие появляется всё чаще.");
  } else if (goodDays >= 2) {
    insights.push("Хорошие моменты уже складываются в заметный путь.");
  }

  return insights.slice(0, 3);
}
