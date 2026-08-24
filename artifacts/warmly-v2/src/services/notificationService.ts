import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { NotificationSettings } from "../types";
import { EntryRepository } from "./repositories";
import { storageClient } from "./storage/AsyncStorageClient";
import { toDateKey } from "../utils";

/**
 * Тихие напоминания: максимум два в сутки, без звука и бейджа.
 * Вечернее не ставится, если за сегодня уже есть запись.
 */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const CHANNEL_ID = "warmly-reminders";
const HORIZON_DAYS = 7;
const MIN_GAP_MINUTES = 4 * 60;

const MORNING_BODY = "Доброе утро. Мысль дня на главной — без спешки.";
const EVENING_BODY = "Вечер. Можно записать день, а можно просто отдохнуть.";

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Напоминания Warmly",
    description: "Не больше двух тихих напоминаний в день",
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: null,
    showBadge: false,
    enableVibrate: false,
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const existing = await Notifications.getPermissionsAsync();
    if (existing.granted) return true;
    if (existing.status === "denied" && existing.canAskAgain === false) return false;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  } catch {
    return false;
  }
}

function parseTime(time: string): { hour: number; minute: number } {
  const [hourRaw, minuteRaw] = time.split(":");
  const hour = Math.min(23, Math.max(0, Number.parseInt(hourRaw ?? "9", 10) || 9));
  const minute = Math.min(59, Math.max(0, Number.parseInt(minuteRaw ?? "0", 10) || 0));
  return { hour, minute };
}

function minutesOfDay(time: string): number {
  const { hour, minute } = parseTime(time);
  return hour * 60 + minute;
}

function atTimeOnDay(day: Date, time: string): Date {
  const { hour, minute } = parseTime(time);
  const next = new Date(day);
  next.setHours(hour, minute, 0, 0);
  return next;
}

async function scheduleOnce(id: string, when: Date, body: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    identifier: id,
    content: {
      title: "Warmly",
      body,
      ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: when,
    },
  });
}

export async function syncNotifications(settings: NotificationSettings): Promise<void> {
  await ensureAndroidChannel();
  await Notifications.cancelAllScheduledNotificationsAsync().catch(() => undefined);

  if (!settings.enabled) return;

  const morningOn = settings.morningEnabled !== false;
  const eveningOn = settings.eveningEnabled !== false;
  if (!morningOn && !eveningOn) return;

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  const entries = await new EntryRepository(storageClient).getAll();
  const todayKey = toDateKey();
  const wroteToday = entries.some((entry) => entry.date === todayKey);

  let scheduleMorning = morningOn;
  let scheduleEvening = eveningOn;
  if (scheduleMorning && scheduleEvening) {
    const gap =
      (minutesOfDay(settings.eveningTime) - minutesOfDay(settings.morningTime) + 24 * 60) %
      (24 * 60);
    if (gap < MIN_GAP_MINUTES) {
      scheduleEvening = false;
    }
  }

  const now = new Date();
  for (let offset = 0; offset < HORIZON_DAYS; offset += 1) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const key = toDateKey(day);

    if (scheduleMorning) {
      const when = atTimeOnDay(day, settings.morningTime);
      if (when > now) {
        await scheduleOnce(`warmly-m-${key}`, when, MORNING_BODY);
      }
    }

    if (scheduleEvening) {
      if (offset === 0 && wroteToday) continue;
      const when = atTimeOnDay(day, settings.eveningTime);
      if (when > now) {
        await scheduleOnce(`warmly-e-${key}`, when, EVENING_BODY);
      }
    }
  }
}
