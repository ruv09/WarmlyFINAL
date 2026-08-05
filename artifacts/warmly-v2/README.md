# Warmly 2.0 (merged)

Рабочее приложение на базе архитектуры [Warmly2.0](https://github.com/ruv09/Warmly2.0)
с сильными сторонами продукта из Warmly v1 (этот монорепозиторий).

Пакет **намеренно вне root pnpm workspace**: Expo 54 / React 19.1
ставится через `pnpm install --ignore-workspace`, чтобы не смешивать
lockfile с `artifacts/mobile` и root catalog.

## Что здесь

- **Архитектура v2:** repositories → zustand stores → hooks → screens,
  единая тема, адаптивная раскладка, исследуемый лес с жестами.
- **Из v1:** онбординг с именем, мысль дня с дедупликацией, избранные
  фразы, тёплые фразы после сохранения, хаптика, ErrorBoundary,
  Android notification channel, подтверждение удаления,
  KeyboardAvoidingView.

## Запуск

```bash
cd artifacts/warmly-v2
pnpm install --ignore-workspace
pnpm typecheck
pnpm start
```

## Исправления относительно исходного Warmly2.0

1. Убран deprecated `expo-router/babel` — Metro снова собирает бандл.
2. Лес обновляется сразу после создания/удаления записи.
3. Настройки, тема и уведомления гидратируются при старте приложения.
4. Android-канал уведомлений создаётся явно.
5. Даты форматируются в локальной таймзоне; русская плюрализация.
