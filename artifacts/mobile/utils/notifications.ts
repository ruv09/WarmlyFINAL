import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import { buildUniqueAiPhrase } from "@/utils/phrases";

const LEGACY_NOTIFICATION_JOB_KEY = "warmly_daily_ai_notification_id";
const NOTIFICATION_JOB_IDS_KEY = "warmly_scheduled_notification_ids";
const RANDOM_SEED_KEY = "warmly_notification_random_seeds";
const SCHEDULE_DAYS = 7;
const TEST_NOTIFICATION_DELAYS_SECONDS = [10, 30, 50, 70];

const supportPrompts = [
  "Warmly думает о тебе. Как ты сегодня?",
  "Небольшой привет посреди дня 💛 Береги себя.",
  "Ты справляешься лучше, чем думаешь. Продолжай.",
  "Маленькая пауза для тебя: как ты себя чувствуешь?",
  "Один момент для себя — уже много. Как дела?",
  "Ты важен. Не забывай об этом сегодня 🌿",
  "Warmly рядом. Один глубокий вдох — и вперёд ✨",
];

const eveningPrompts = [
  "Как прошёл день? Отметь настроение и одну маленькую победу.",
  "Пора мягко выдохнуть. Запиши, что сегодня было важным для тебя.",
  "Вечерний чек-ин: что хочется отпустить, а что сохранить?",
  "Загляни к себе на минуту: какое чувство осталось после дня?",
];

const moodReminderPrompts = [
  "Привет 🌙 Ещё не отметил(а) настроение сегодня. Как прошёл день?",
  "Вечер — хорошее время заглянуть к себе. Как ты себя чувствуешь?",
  "Один момент для себя: отметь настроение и запиши мысли дня 💛",
  "Не забудь про себя сегодня. Warmly ждёт твою запись 🌿",
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function getRandomTimeInRange(
  minHour: number,
  maxHour: number,
): { hour: number; minute: number } {
  const totalMinutes = (maxHour - minHour) * 60;
  const randomMinutes = Math.floor(Math.random() * totalMinutes);
  return {
    hour: minHour + Math.floor(randomMinutes / 60),
    minute: randomMinutes % 60,
  };
}

async function getDailyRandomTime(
  dayOffset: number,
): Promise<{ hour: number; minute: number }> {
  const dateKey = new Date();
  dateKey.setDate(dateKey.getDate() + dayOffset);
  const key = dateKey.toISOString().slice(0, 10);

  try {
    const raw = await AsyncStorage.getItem(RANDOM_SEED_KEY);
    const seeds: Record<string, { hour: number; minute: number }> = raw
      ? JSON.parse(raw)
      : {};

    if (seeds[key]) return seeds[key]!;

    const time = getRandomTimeInRange(8, 22);
    const pruned = Object.fromEntries(
      Object.entries(seeds)
        .filter(([k]) => k >= new Date().toISOString().slice(0, 10))
        .slice(-14),
    );
    pruned[key] = time;
    await AsyncStorage.setItem(RANDOM_SEED_KEY, JSON.stringify(pruned));
    return time;
  } catch {
    return getRandomTimeInRange(8, 22);
  }
}

function getNextDateForHourMinute(
  hour: number,
  minute: number,
  dayOffset: number,
): Date {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  if (dayOffset === 0 && date.getTime() <= Date.now()) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

function getNextDateForFixed(
  hourStr: string,
  minuteStr: string,
  dayOffset: number,
): Date {
  const hour = Math.min(22, Math.max(0, Number.parseInt(hourStr, 10) || 20));
  const minute = Math.min(59, Math.max(0, Number.parseInt(minuteStr, 10) || 0));
  return getNextDateForHourMinute(hour, minute, dayOffset);
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
  preferredHour: string;
  preferredEvening: string;
  recentPhrases: string[];
  hasTodayMoodEntry: boolean;
}) {
  const {
    enabled,
    aiEnabled,
    preferredEvening,
    recentPhrases,
    hasTodayMoodEntry,
  } = params;

  if (!enabled) {
    await cancelStoredNotifications();
    return;
  }

  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) return;

  await cancelStoredNotifications();

  const identifiers: string[] = [];
  const plannedPhrases = [...recentPhrases];

  for (let dayOffset = 0; dayOffset < SCHEDULE_DAYS; dayOffset += 1) {
    if (aiEnabled) {
      const phrase = buildUniqueAiPhrase(plannedPhrases);
      plannedPhrases.push(phrase);
      const { hour, minute } = await getDailyRandomTime(dayOffset);
      const supportId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Warmly 💛",
          body: phrase,
          sound: false,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: getNextDateForHourMinute(hour, minute, dayOffset),
        },
      });
      identifiers.push(supportId);
    } else {
      const { hour, minute } = await getDailyRandomTime(dayOffset);
      const supportId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Warmly 💛",
          body: pickRandom(supportPrompts),
          sound: false,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: getNextDateForHourMinute(hour, minute, dayOffset),
        },
      });
      identifiers.push(supportId);
    }

    const eveningParts = preferredEvening.split(":");
    const eveningHourStr = eveningParts[0] ?? "20";
    const eveningMinStr = eveningParts[1] ?? "0";
    const shouldSendMoodReminder = dayOffset === 0 && !hasTodayMoodEntry;
    const eveningHour = Number.parseInt(eveningHourStr, 10) || 20;
    const reminderHour = Math.max(20, eveningHour);

    if (shouldSendMoodReminder) {
      const reminderId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Warmly 🌙",
          body: pickRandom(moodReminderPrompts),
          sound: false,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: getNextDateForHourMinute(reminderHour, 0, 0),
        },
      });
      identifiers.push(reminderId);
    } else if (dayOffset > 0) {
      const eveningId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Вечерний чек-ин 🌙",
          body: pickRandom(eveningPrompts),
          sound: false,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: getNextDateForFixed(eveningHourStr, eveningMinStr, dayOffset),
        },
      });
      identifiers.push(eveningId);
    }
  }

  await AsyncStorage.setItem(
    NOTIFICATION_JOB_IDS_KEY,
    JSON.stringify(identifiers),
  );
}

export async function scheduleNotificationTestScenario(params: {
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
        ? pickRandom(eveningPrompts)
        : buildUniqueAiPhrase(plannedPhrases);
      if (!isEveningStep) plannedPhrases.push(body);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: isEveningStep ? "Тест: вечерний чек-ин 🌙" : "Тест: Warmly 💛",
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
    firstDelaySeconds: TEST_NOTIFICATION_DELAYS_SECONDS[0]!,
  };
}
