declare module "expo-notifications" {
  export type PermissionStatus = "granted" | "denied" | "undetermined";
  export const SchedulableTriggerInputTypes: {
    DAILY: "daily";
    DATE: "date";
    TIME_INTERVAL: "timeInterval";
  };
  export enum AndroidImportance {
    NONE = 0,
    MIN = 1,
    LOW = 2,
    DEFAULT = 3,
    HIGH = 4,
    MAX = 5,
  }
  export function setNotificationHandler(_: {
    handleNotification: () => Promise<{
      shouldShowBanner: boolean;
      shouldShowList: boolean;
      shouldPlaySound: boolean;
      shouldSetBadge: boolean;
      shouldShowAlert?: boolean;
    }>;
  }): void;
  export function getPermissionsAsync(): Promise<{ status: PermissionStatus }>;
  export function requestPermissionsAsync(): Promise<{
    status: PermissionStatus;
  }>;
  export function scheduleNotificationAsync(_: {
    content: {
      title: string;
      body: string;
      sound?: boolean | null | undefined;
      channelId?: string;
    };
    trigger:
      | { type: "daily"; hour: number; minute: number }
      | { type: "date"; date: Date | number }
      | { type: "timeInterval"; seconds: number; repeats?: boolean };
  }): Promise<string>;
  export function cancelScheduledNotificationAsync(
    identifier: string,
  ): Promise<void>;
  export function getAllScheduledNotificationsAsync(): Promise<
    { identifier: string }[]
  >;
  export function cancelAllScheduledNotificationsAsync(): Promise<void>;
  export function setNotificationChannelAsync(
    channelId: string,
    channel: {
      name: string;
      description?: string;
      importance?: AndroidImportance;
      vibrationPattern?: number[];
      lightColor?: string;
      sound?: string | null;
      showBadge?: boolean;
    },
  ): Promise<void>;
}
