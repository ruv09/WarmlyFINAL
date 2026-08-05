# Warmly

Warmly — спокойное приложение поддержки настроения: чек-ины, личный лес,
поддерживающие фразы и мягкие напоминания.

## Запуск

Основное (и единственное) приложение: `artifacts/warmly-v2` (Expo SDK 54).

```bash
cd artifacts/warmly-v2
pnpm install --ignore-workspace
pnpm typecheck
pnpm start
```

Пакет специально вне root pnpm workspace: ставится через
`--ignore-workspace`, чтобы Expo-зависимости не смешивались с корневым
lockfile.

Из корня репозитория:

```bash
pnpm install
pnpm run typecheck   # typecheck warmly-v2
pnpm start           # expo start в warmly-v2
```

## Структура

```text
artifacts/warmly-v2/   приложение Warmly 2.0 (Expo 54)
scripts/post-merge.sh  post-merge hook для Replit
```

Архитектурные заметки — в `artifacts/warmly-v2/*.md`
(FOREST, DATA_LAYER, THEME, …).
