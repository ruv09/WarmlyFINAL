# Warmly

Приложение поддержки настроения: чек-ины, лес настроения, поддерживающие фразы.

## Run & Operate

- Основное приложение: `cd artifacts/warmly-v2 && pnpm install --ignore-workspace && pnpm start`
- `pnpm run typecheck` — typecheck пакетов workspace
- `pnpm run typecheck:warmly-v2` — typecheck основного приложения
- API (scaffolding): `pnpm --filter @workspace/api-server run start` (нужен `PORT`)

## Stack

- pnpm workspaces + standalone Expo-пакет `artifacts/warmly-v2`
- Mobile: Expo / React Native / Expo Router / Zustand / AsyncStorage
- API scaffolding: Express, Zod, Orval, Drizzle (пока почти не используется приложением)

## Where things live

- `artifacts/warmly-v2` — основное приложение
- `artifacts/mobile` — наследие v1
- `lib/` — OpenAPI / клиенты / db schema
- Архитектурные заметки v2: `artifacts/warmly-v2/*.md` (FOREST, DATA_LAYER, THEME, …)

## Gotchas

- `artifacts/warmly-v2` не входит в root workspace — всегда `pnpm install --ignore-workspace`
- `pnpm run build` падает без `PORT`/`BASE_PATH` у mockup-sandbox — это ожидаемо вне Replit
- Корневой `pnpm-lock.yaml` должен оставаться валидным YAML (без остатков merge-конфликтов)
