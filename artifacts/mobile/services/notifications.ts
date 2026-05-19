/**
 * Notification service — schedules daily supportive push notifications.
 *
 * Design:
 *  - Schedules 14 notifications in advance (7 days × morning + evening).
 *  - On each app open, checks remaining count and tops up if < 4 left.
 *  - Content: AI-generated supportive phrases from the local pool.
 *  - Window: 09:00 and 20:00 local time only (never at night).
 *  - Fully local — no server required.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { pickNotificationPhrase } from "@/utils/phrases";

const CHANNEL_ID = "warmly-daily";
const SCHEDULED_KEY = "warmly_notif_scheduled_ids";

// How the notification behaves when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** Create Android notification channel (must be called before scheduling). */
async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Ежедневная поддержка",
    description: "Поддерживающие сообщения от Warmly",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 200, 100, 200],
    lightColor: "#C4855A",
    sound: null,
    showBadge: false,
  });
}

/** Request notification permissions. Returns true if granted. */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === "granted") return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch {
    return false;
  }
}

/** Get the current permission status without prompting. */
export async function getNotificationPermissionStatus(): Promise<"granted" | "denied" | "undetermined"> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status as "granted" | "denied" | "undetermined";
  } catch {
    return "undetermined";
  }
}

/**
 * Schedule a batch of daily notifications (morning 09:00 + evening 20:00).
 * Schedules up to 7 days ahead, skipping times already in the past.
 * Call this on every app start — it's safe to call repeatedly (checks first).
 */
export async function scheduleDailyNotifications(enabled: boolean): Promise<void> {
  try {
    await ensureAndroidChannel();

    if (!enabled) {
      await cancelAllNotifications();
      return;
    }

    const granted = await requestNotificationPermission();
    if (!granted) return;

    // Check how many are already scheduled
    const pending = await Notifications.getAllScheduledNotificationsAsync();
    if (pending.length >= 8) return; // Enough scheduled, skip

    // Cancel old ones and reschedule fresh
    await Notifications.cancelAllScheduledNotificationsAsync();

    const scheduledIds: string[] = [];
    const now = new Date();

    for (let day = 0; day < 7; day++) {
      // Morning: 09:00
      const morning = new Date(now);
      morning.setDate(now.getDate() + day);
      morning.setHours(9, 0, 0, 0);

      if (morning > now) {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: "Warmly 💛",
            body: pickNotificationPhrase(),
            sound: undefined,
            ...(Platform.OS === "android" && { channelId: CHANNEL_ID }),
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: morning,
          },
        });
        scheduledIds.push(id);
      }

      // Evening: 20:00
      const evening = new Date(now);
      evening.setDate(now.getDate() + day);
      evening.setHours(20, 0, 0, 0);

      if (evening > now) {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: "Warmly 💛",
            body: pickNotificationPhrase(),
            sound: undefined,
            ...(Platform.OS === "android" && { channelId: CHANNEL_ID }),
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: evening,
          },
        });
        scheduledIds.push(id);
      }
    }

    await AsyncStorage.setItem(SCHEDULED_KEY, JSON.stringify(scheduledIds));
  } catch (err) {
    // Fail silently — notifications are non-critical
    console.warn("[Warmly] Notifications scheduling failed:", err);
  }
}

/** Cancel all scheduled notifications. */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(SCHEDULED_KEY);
  } catch {
    // Ignore
  }
}
