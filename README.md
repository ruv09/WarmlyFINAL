# Warmly

Warmly — спокойное приложение поддержки настроения: чек-ины, личный лес,
поддерживающие фразы и мягкие напоминания.

## Запуск (Expo Go)

Приложение: `artifacts/warmly-v2` (Expo SDK 54).

```bash
cd artifacts/warmly-v2
pnpm install --ignore-workspace
pnpm typecheck
pnpm start
```

Пакет специально вне root pnpm workspace: ставь через `--ignore-workspace`.

Из корня репозитория:

```bash
pnpm install
pnpm run install:warmly
pnpm run typecheck
pnpm start
```

## Иконка

Бренд-ассеты лежат в `artifacts/warmly-v2/assets/brand/`:
`icon.png`, `adaptive-icon.png`, `splash.png`, `favicon.png`.

## Сборка APK (Android)

### Вариант A — EAS Build (проще в облаке)

1. Установи EAS CLI и войди: `npm i -g eas-cli && eas login`
2. В папке приложения:
   ```bash
   cd artifacts/warmly-v2
   pnpm install --ignore-workspace
   eas build -p android --profile preview
   ```
3. Скачай готовый `.apk` по ссылке из терминала.
   На EAS установка сама отвязывается от корневого pnpm workspace
   (`eas-build-pre-install`), иначе облако не находит `expo-router`.

Профиль `preview` в `eas.json` собирает именно **APK** (удобно ставить на телефон без Play Store).

### Вариант B — локально через Android Studio

1. JDK 17 + Android Studio (SDK / platform-tools).
2. ```bash
   cd artifacts/warmly-v2
   pnpm install --ignore-workspace
   pnpm exec expo prebuild --platform android --clean
   ```
3. Открой папку `android/` в Android Studio → Build → Build APK(s)
   или в терминале:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
4. APK будет примерно здесь:
   `android/app/build/outputs/apk/release/app-release.apk`

Для установки на телефон нужен подписанный release (keystore) или debug-сборка:
`./gradlew assembleDebug`.

Если Gradle пишет **CXX1101 / NDK … did not have a source.properties file**,
папка NDK скачалась битой. Из корня приложения:

```bash
cd artifacts/warmly-v2
chmod +x scripts/setup-android.sh
./scripts/setup-android.sh
cd android
./gradlew assembleDebug
```

Либо вручную: удали `$ANDROID_HOME/ndk/27.1.12297006`, в Android Studio
поставь **NDK (Side by side) 27.1.12297006** заново, проверь файл
`source.properties`, затем снова `./gradlew assembleDebug`.

## Структура

```text
artifacts/warmly-v2/   приложение Warmly 2.0 (Expo 54)
```

Архитектурные заметки — в `artifacts/warmly-v2/*.md`
(FOREST, DATA_LAYER, THEME, …).
