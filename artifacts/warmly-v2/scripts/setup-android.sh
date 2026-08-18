#!/usr/bin/env bash
# Prepare local Android build: SDK path + NDK 27.1.12297006 (Expo SDK 54).
set -euo pipefail

NDK_VERSION="27.1.12297006"
SDK_DEFAULT="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID_DIR="$ROOT/android"

if [[ ! -d "$ANDROID_DIR" ]]; then
  echo "Сначала сгенерируй android/:  pnpm exec expo prebuild --platform android"
  exit 1
fi

if [[ ! -d "$SDK_DEFAULT" ]]; then
  echo "Android SDK не найден: $SDK_DEFAULT"
  echo "Открой Android Studio → Settings → Android SDK и скопируй путь."
  exit 1
fi

printf 'sdk.dir=%s\n' "$SDK_DEFAULT" > "$ANDROID_DIR/local.properties"
echo "Записан $ANDROID_DIR/local.properties"
echo "  sdk.dir=$SDK_DEFAULT"

NDK_DIR="$SDK_DEFAULT/ndk/$NDK_VERSION"
PROPS="$NDK_DIR/source.properties"

if [[ -f "$PROPS" ]]; then
  echo "NDK $NDK_VERSION в порядке."
  cat "$PROPS"
  exit 0
fi

echo
echo "Проблема: NDK $NDK_VERSION битый (нет source.properties)."
echo "Это ошибка CXX1101."
echo

if [[ -d "$NDK_DIR" ]]; then
  echo "Удаляю битую папку:"
  echo "  $NDK_DIR"
  rm -rf "$NDK_DIR"
fi

SDKMANAGER=""
for candidate in \
  "$SDK_DEFAULT/cmdline-tools/latest/bin/sdkmanager" \
  "$SDK_DEFAULT/cmdline-tools/bin/sdkmanager"
do
  if [[ -x "$candidate" ]]; then
    SDKMANAGER="$candidate"
    break
  fi
done

if [[ -z "$SDKMANAGER" ]]; then
  echo "sdkmanager не найден. Поставь NDK через Android Studio:"
  echo "  Settings → Android SDK → SDK Tools → Show Package Details"
  echo "  NDK (Side by side) → $NDK_VERSION → Apply"
  exit 2
fi

echo "Ставлю NDK $NDK_VERSION через sdkmanager…"
yes | "$SDKMANAGER" --sdk_root="$SDK_DEFAULT" "ndk;$NDK_VERSION" || true

if [[ -f "$PROPS" ]]; then
  echo "NDK установлен:"
  cat "$PROPS"
  exit 0
fi

echo "Не получилось поставить NDK автоматически."
echo "Поставь $NDK_VERSION вручную в Android Studio (SDK Tools → NDK Side by side)."
exit 2
