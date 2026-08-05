# Warmly

Приложение поддержки настроения: чек-ины, лес настроения, поддерживающие фразы.

## Run & Operate

- Основное приложение: `cd artifacts/warmly-v2 && pnpm install --ignore-workspace && pnpm start`
- Из корня: `pnpm start` или `pnpm run typecheck`

## Stack

- Standalone Expo-пакет `artifacts/warmly-v2` (SDK 54)
- Expo Router / Zustand / AsyncStorage / Reanimated / Gesture Handler

## Where things live

- `artifacts/warmly-v2` — приложение
- Архитектурные заметки: `artifacts/warmly-v2/*.md` (FOREST, DATA_LAYER, THEME, …)

## Gotchas

- `artifacts/warmly-v2` не входит в root workspace — всегда `pnpm install --ignore-workspace`
- Корневой `pnpm-lock.yaml` должен оставаться валидным YAML (без остатков merge-конфликтов)
