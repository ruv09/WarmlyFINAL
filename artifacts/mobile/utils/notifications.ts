import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import { buildAiPhrase, type MoodKey } from "@/utils/phrases";

const NOTIFICATION_JOB_KEY = "warmly_daily_ai_notification_id";

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

function parseHour(time: string): number {
  const [hours] = time.split(":");
  const parsed = Number.parseInt(hours ?? "8", 10);
  return clampHour(Number.isNaN(parsed) ? 8 : parsed);
}

export async function ensureDailyAiNotification(params: {
  enabled: boolean;
  aiEnabled: boolean;
  mood: MoodKey | null;
  preferredHour: string;
}) {
  const { enabled, aiEnabled, mood, preferredHour } = params;
  const existingId = await AsyncStorage.getItem(NOTIFICATION_JOB_KEY);

  if (!enabled || !aiEnabled) {
    if (existingId) {
      await Notifications.cancelScheduledNotificationAsync(existingId).catch(() => undefined);
      await AsyncStorage.removeItem(NOTIFICATION_JOB_KEY);
    }
    return;
  }

  const { status } = await Notifications.getPermissionsAsync();
  let finalStatus = status;
  if (status !== "granted") {
    const permission = await Notifications.requestPermissionsAsync();
    finalStatus = permission.status;
  }

  if (finalStatus !== "granted") {
    return;
  }

  if (existingId) {
    await Notifications.cancelScheduledNotificationAsync(existingId).catch(() => undefined);
  }

  const body = buildAiPhrase(mood);
  const hour = parseHour(preferredHour);

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Warmly рядом 💛",
      body,
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute: 0,
    },
  });

  await AsyncStorage.setItem(NOTIFICATION_JOB_KEY, identifier);
}
