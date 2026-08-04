import React from "react";
import { Stack } from "expo-router";

/**
 * Вложенный Stack внутри вкладки "Профиль".
 *
 * Отличие от entry/[id] в корневом Stack: здесь переход
 * (например, в настройки уведомлений) остаётся "внутри" вкладки —
 * таб-бар не скрывается, что уместно для настроек (человек может
 * переключиться на другую вкладку и вернуться в то же место
 * профиля). Для entry/[id] выбрано обратное поведение — см.
 * комментарий в app/_layout.tsx.
 *
 * Новый экран настроек в будущем (например, "Экспорт данных" как
 * отдельный шаг, а не кнопка) — это файл в этой папке + одна строка
 * Stack.Screen здесь. Остальная навигация приложения не меняется.
 */
export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Профиль", headerShown: false }} />
      <Stack.Screen name="notifications" options={{ title: "Уведомления" }} />
    </Stack>
  );
}
