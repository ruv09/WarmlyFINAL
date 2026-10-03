import { SceneMode } from "../types/tree";

export type { SceneMode };

/** День примерно с 7:00 до 20:00. Можно сменить, не трогая экраны. */
export const DAY_HOUR_START = 7;
export const DAY_HOUR_END = 20;

export function sceneModeFromHour(hour: number): SceneMode {
  if (!Number.isFinite(hour)) return "day";
  const wrapped = ((Math.floor(hour) % 24) + 24) % 24;
  return wrapped >= DAY_HOUR_START && wrapped < DAY_HOUR_END ? "day" : "night";
}

export function sceneModeFromTime(time: string): SceneMode | null {
  const hour = Number.parseInt(time.slice(0, 2), 10);
  if (!Number.isFinite(hour)) return null;
  return sceneModeFromHour(hour);
}

export function sceneModeFromTheme(themeMode: "light" | "dark"): SceneMode {
  return themeMode === "dark" ? "night" : "day";
}

/**
 * Состояние сцены можно задать вручную, независимо от системного времени.
 * Без override — текущий час. В лесу обычно передаём тему: dark → night.
 */
export function resolveSceneMode(override?: SceneMode | null, now: Date = new Date()): SceneMode {
  if (override === "day" || override === "night") return override;
  return sceneModeFromHour(now.getHours());
}
