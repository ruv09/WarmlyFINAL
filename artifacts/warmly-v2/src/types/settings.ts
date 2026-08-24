export type ThemeMode = "light" | "dark" | "auto";

export interface NotificationSettings {
  enabled: boolean;
  morningEnabled: boolean;
  eveningEnabled: boolean;
  morningTime: string; // HH:mm
  eveningTime: string; // HH:mm
}

export interface Settings {
  theme: ThemeMode;
  notifications: NotificationSettings;
  /** Имя пользователя из онбординга — используется в приветствиях. */
  name: string;
  /** Прошёл ли пользователь экран онбординга. */
  isOnboarded: boolean;
  /** Дата первой настройки / присоединения (YYYY-MM-DD). */
  joinedAt: string;
  /**
   * Id готового аватара-компаньона (fox, owl…).
   */
  avatarId: string;
  /**
   * Включены ли поддерживающие фразы (мысль дня на главной).
   * Перенесено из Warmly v1 как сильная сторона продукта.
   */
  supportivePhrasesEnabled: boolean;
  /** Фраза дня и дата, на которую она была сгенерирована (YYYY-MM-DD). */
  dailyPhrase: string;
  dailyPhraseDate: string;
  /** Недавние фразы — для дедупликации при генерации. */
  recentPhrases: string[];
}
