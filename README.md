# Warmly

Warmly — спокойное приложение поддержки настроения: чек-ины, личный лес,
поддерживающие фразы и мягкие напоминания.

## Какое приложение запускать

**Основное (рекомендуется):** `artifacts/warmly-v2` — архитектура Warmly 2.0
плюс продуктовые сильные стороны v1 (онбординг, мысль дня, избранное, хаптика).

```bash
cd artifacts/warmly-v2
pnpm install --ignore-workspace
pnpm typecheck
pnpm start
```

Пакет специально вне root pnpm workspace: Expo 54 / React 19.1
ставится через `--ignore-workspace`, чтобы не смешивать lockfile
с `artifacts/mobile` и root catalog.

**Наследие:** `artifacts/mobile` — предыдущая Expo-версия. Оставлена для
сравнения; новый функционал добавляйте в `warmly-v2`.

## Структура репозитория

```text
artifacts/warmly-v2/       основное приложение (Expo 54, standalone)
artifacts/mobile/          наследие Warmly v1
artifacts/mockup-sandbox/  Vite UI sandbox
artifacts/api-server/      Express API (healthcheck / scaffolding)
lib/                       OpenAPI, клиенты, схема БД
scripts/                   утилиты воркспейса
```

## Корневой workspace

```bash
pnpm install
pnpm run typecheck              # api-server, mobile, mockup-sandbox, libs
pnpm run typecheck:warmly-v2    # основное приложение
```

Mockup sandbox требует `PORT` и `BASE_PATH`:

```bash
cd artifacts/mockup-sandbox
PORT=5173 BASE_PATH=/ pnpm run dev
```

## Проверки

Главный автоматический контроль — TypeScript. Юнит-тестов в корне нет.

```bash
pnpm run typecheck
pnpm run typecheck:warmly-v2
```
