# Warmly

Warmly is a gentle mood-support app. Its core idea is to help a person check in with themselves, save mood notes, receive warm daily reminders, and see supportive phrases that feel personal instead of repetitive.

## Product idea

- **Soft onboarding:** the user enters a name and starts with a calm, friendly first screen.
- **Mood check-ins:** the user can select a mood, add a note, and build a history of emotional states.
- **Mood calendar:** previous mood entries are grouped by date so another developer can understand how the app stores and displays emotional history.
- **Warm phrases:** the app keeps fallback phrases and mood-aware generated phrases in Russian.
- **Phrase uniqueness:** generated daily phrases avoid repeating recently shown phrases where possible.
- **Daily notifications:** notification scheduling follows the user's notification and AI settings and keeps a single scheduled notification in sync.
- **Design direction:** the UI is intentionally warm, rounded, soft, and low-pressure, with calm colors and supportive microcopy.

## Repository layout

```text
artifacts/mobile/          Expo / React Native app (Warmly v1, Expo 54)
artifacts/warmly-v2/       Merged Warmly 2.0 app (Expo 51; standalone install)
artifacts/mockup-sandbox/  Vite UI sandbox and reusable UI components
artifacts/api-server/      Express API server artifact
lib/api-spec/              OpenAPI contract
lib/api-client-react/      generated React API client
lib/api-zod/               generated Zod API helpers
lib/db/                    database schema package
scripts/                   workspace utility scripts
```

### Warmly v2 (merged)

`artifacts/warmly-v2` is the architecture of Warmly2.0 plus product strengths
from v1 (onboarding, daily phrases, favorites, haptics, notification channel).
It is **not** part of the root pnpm workspace — install it separately:

```bash
cd artifacts/warmly-v2
pnpm install --ignore-workspace
pnpm typecheck
pnpm start
```

## Important mobile files

- `artifacts/mobile/context/AppContext.tsx` stores the app state, persists it in `AsyncStorage`, tracks favorites, mood history, daily AI phrase state, and keeps notifications synced.
- `artifacts/mobile/utils/phrases.ts` contains fallback quotes, mood definitions, phrase generation, and recent-phrase de-duplication logic.
- `artifacts/mobile/utils/notifications.ts` owns Expo notification permission checks, cancellation, and daily notification scheduling.
- `artifacts/mobile/app/welcome.tsx` contains onboarding.
- `artifacts/mobile/app/(tabs)/mood.tsx` contains mood selection, note submission, support phrases, and mood-history writes.
- `artifacts/mobile/app/(tabs)/calendar.tsx` renders saved mood history grouped by day.
- `artifacts/mobile/app/(tabs)/profile.tsx` contains user-facing settings such as notification and AI toggles.

## Development setup

This workspace is managed with **pnpm**. The root `preinstall` script intentionally rejects npm/yarn lockfiles, so use pnpm for all dependency and script commands.

```bash
pnpm install
pnpm run typecheck
```

Useful package scripts:

```bash
pnpm --filter @workspace/mobile typecheck
pnpm --filter @workspace/mockup-sandbox typecheck
pnpm --filter @workspace/api-server typecheck
```

## Running locally

### Mobile app

```bash
cd artifacts/mobile
pnpm run dev
```

The mobile dev script expects Replit/Expo-related environment variables in the hosted environment. Outside Replit, developers may need to provide equivalent Expo configuration manually.

### Mockup sandbox

```bash
cd artifacts/mockup-sandbox
PORT=5173 BASE_PATH=/ pnpm run dev
```

### API server

```bash
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/api-server run start
```

## Quality checks

Before handing work to another developer, run:

```bash
pnpm run typecheck
```

At the moment, there is no dedicated unit-test script in the root package. TypeScript typechecking is the main automated correctness gate in this repository.

## Notes for future developers

- Preserve the supportive tone: the app should feel caring, not clinical or demanding.
- Preserve the warm visual language: rounded cards, soft colors, readable typography, and calm spacing.
- Preserve notification intent: reminders should be opt-in, respectful, and synced with user settings.
- Preserve phrase uniqueness: when adding new phrase logic, keep recent-repeat avoidance so daily phrases do not feel stale.
- Avoid claiming tests were run unless the exact command exists and was actually executed.
