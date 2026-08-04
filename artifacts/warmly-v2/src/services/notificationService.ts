import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { NotificationSettings } from "../types";

/**
 * Единственное место в приложении, которое напрямую импортирует
 * expo-notifications. store вызывает syncNotifications, ничего
 * не зная о деталях планирования.
 *
 * Улучшения из Warmly v1:
 *  - Android notification channel создаётся явно
 *  - корректный handler для баннеров
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const CHANNEL_ID = "warmly-reminders";
const MORNING_ID = "warmly-morning";
const EVENING_ID = "warmly-evening";

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Напоминания Warmly",
    description: "Утренние и вечерние напоминания отметить настроение",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 200, 100, 200],
    lightColor: "#7FA06F",
    sound: null,
    showBadge: false,
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status === "granted") return true;
    const { status: requested } = await Notifications.requestPermissionsAsync();
    return requested === "granted";
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

async function scheduleDaily(id: string, time: string, title: string, body: string) {
  const { hour, minute } = parseTime(time);
  await Notifications.scheduleNotificationAsync({
    identifier: id,
    content: {
      title,
      body,
      ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : {}),
    },
    trigger: {
      hour,
      minute,
      repeats: true,
      ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : {}),
    },
  });
}

export async function syncNotifications(settings: NotificationSettings): Promise<void> {
  await ensureAndroidChannel();

  await Notifications.cancelScheduledNotificationAsync(MORNING_ID).catch(() => undefined);
  await Notifications.cancelScheduledNotificationAsync(EVENING_ID).catch(() => undefined);

  if (!settings.enabled) return;

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await scheduleDaily(
    MORNING_ID,
    settings.morningTime,
    "Warmly 💛",
    "Доброе утро. Отметьте, как вы себя чувствуете сегодня.",
  );
  await scheduleDaily(
    EVENING_ID,
    settings.eveningTime,
    "Warmly 🌙",
    "Как прошёл день? Пара минут — и день будет сохранён в вашем лесу.",
  );
}
