import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import { buildUniqueAiPhrase, type MoodKey } from "@/utils/phrases";

const LEGACY_NOTIFICATION_JOB_KEY = "warmly_daily_ai_notification_id";
const NOTIFICATION_JOB_IDS_KEY = "warmly_scheduled_notification_ids";
const SCHEDULE_DAYS = 7;
const TEST_NOTIFICATION_DELAYS_SECONDS = [10, 30, 50, 70];

const eveningPrompts = [
  "Как прошёл день? Отметь настроение и одну маленькую победу.",
  "Пора мягко выдохнуть. Запиши, что сегодня было важным для тебя.",
  "Вечерний чек-ин: что хочется отпустить, а что сохранить?",
  "Загляни к себе на минуту: какое чувство осталось после дня?",
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function clampHour(hour: number): number {
  return Math.min(22, Math.max(8, hour));
}

function parseTime(time: string): { hour: number; minute: number } {
  const [hours, minutes] = time.split(":");
  const parsedHour = Number.parseInt(hours ?? "8", 10);
  const parsedMinute = Number.parseInt(minutes ?? "0", 10);

  return {
    hour: clampHour(Number.isNaN(parsedHour) ? 8 : parsedHour),
    minute: Math.min(
      59,
      Math.max(0, Number.isNaN(parsedMinute) ? 0 : parsedMinute),
    ),
  };
}

function getNextDateForTime(time: string, dayOffset: number): Date {
  const { hour, minute } = parseTime(time);
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);

  if (dayOffset === 0 && date.getTime() <= Date.now()) {
    date.setDate(date.getDate() + 1);
  }

  return date;
}

function getEveningPrompt(dayOffset: number): string {
  return eveningPrompts[dayOffset % eveningPrompts.length];
}

async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;

  const permission = await Notifications.requestPermissionsAsync();
  return permission.status === "granted";
}

async function getStoredNotificationIds(): Promise<string[]> {
  const [storedIds, legacyId] = await Promise.all([
    AsyncStorage.getItem(NOTIFICATION_JOB_IDS_KEY),
    AsyncStorage.getItem(LEGACY_NOTIFICATION_JOB_KEY),
  ]);

  const ids = new Set<string>();
  if (storedIds) {
    try {
      const parsed = JSON.parse(storedIds);
      if (Array.isArray(parsed)) {
        parsed
          .filter((id): id is string => typeof id === "string")
          .forEach((id) => ids.add(id));
      }
    } catch {
      // Ignore malformed storage and let the next sync replace it.
    }
  }
  if (legacyId) ids.add(legacyId);

  return [...ids];
}

async function cancelStoredNotifications() {
  const ids = await getStoredNotificationIds();
  await Promise.all(
    ids.map((id) =>
      Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined),
    ),
  );
  await Promise.all([
    AsyncStorage.removeItem(NOTIFICATION_JOB_IDS_KEY),
    AsyncStorage.removeItem(LEGACY_NOTIFICATION_JOB_KEY),
  ]);
}

export async function ensureDailyAiNotification(params: {
  enabled: boolean;
  aiEnabled: boolean;
  mood: MoodKey | null;
  preferredHour: string;
  preferredEvening: string;
  recentPhrases: string[];
}) {
  const {
    enabled,
    aiEnabled,
    mood,
    preferredHour,
    preferredEvening,
    recentPhrases,
  } = params;

  if (!enabled || !aiEnabled) {
    await cancelStoredNotifications();
    return;
  }

  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) return;

  await cancelStoredNotifications();

  const identifiers: string[] = [];
  const plannedPhrases = [...recentPhrases];

  for (let dayOffset = 0; dayOffset < SCHEDULE_DAYS; dayOffset += 1) {
    const morningPhrase = buildUniqueAiPhrase(mood, plannedPhrases);
    plannedPhrases.push(morningPhrase);

    const morningId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Warmly утром 💛",
        body: morningPhrase,
        sound: false,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: getNextDateForTime(preferredHour, dayOffset),
      },
    });
    identifiers.push(morningId);

    const eveningId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Вечерний чек-ин 🌙",
        body: getEveningPrompt(dayOffset),
        sound: false,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: getNextDateForTime(preferredEvening, dayOffset),
      },
    });
    identifiers.push(eveningId);
  }

  await AsyncStorage.setItem(
    NOTIFICATION_JOB_IDS_KEY,
    JSON.stringify(identifiers),
  );
}

export async function scheduleNotificationTestScenario(params: {
  mood: MoodKey | null;
  recentPhrases: string[];
}): Promise<{ count: number; firstDelaySeconds: number }> {
  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) {
    throw new Error("notifications-permission-denied");
  }

  const plannedPhrases = [...params.recentPhrases];

  await Promise.all(
    TEST_NOTIFICATION_DELAYS_SECONDS.map(async (seconds, index) => {
      const isEveningStep = index % 2 === 1;
      const body = isEveningStep
        ? getEveningPrompt(index)
        : buildUniqueAiPhrase(params.mood, plannedPhrases);
      if (!isEveningStep) plannedPhrases.push(body);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: isEveningStep
            ? "Тест: вечерний чек-ин 🌙"
            : "Тест: AI-фраза 💛",
          body,
          sound: false,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds,
          repeats: false,
        },
      });
    }),
  );

  return {
    count: TEST_NOTIFICATION_DELAYS_SECONDS.length,
    firstDelaySeconds: TEST_NOTIFICATION_DELAYS_SECONDS[0],
  };
}
