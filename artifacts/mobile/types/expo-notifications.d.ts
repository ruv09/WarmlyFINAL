declare module "expo-notifications" {
  export type PermissionStatus = "granted" | "denied" | "undetermined";
  export const SchedulableTriggerInputTypes: { DAILY: "daily" };
  export function setNotificationHandler(_: {
    handleNotification: () => Promise<{
      shouldShowBanner: boolean;
      shouldShowList: boolean;
      shouldPlaySound: boolean;
      shouldSetBadge: boolean;
    }>;
  }): void;
  export function getPermissionsAsync(): Promise<{ status: PermissionStatus }>;
  export function requestPermissionsAsync(): Promise<{ status: PermissionStatus }>;
  export function scheduleNotificationAsync(_: {
    content: { title: string; body: string; sound?: boolean };
    trigger: { type: "daily"; hour: number; minute: number };
  }): Promise<string>;
  export function cancelScheduledNotificationAsync(identifier: string): Promise<void>;
}
