# Warmly Android / RuStore release guide

This mobile package is an Expo / React Native app. Use this guide when you need a test APK, a release APK, or an AAB for RuStore.

## Stable Android identifiers

The Android package name is fixed in `app.json`:

```text
com.ruv09.warmly
```

Do not change it after the first store upload. Android and RuStore treat a different package name as a different application.

The first Android `versionCode` is `1`. Increase it before every new RuStore upload.

## Prerequisites

Install these locally:

- Node.js 20+
- pnpm
- Expo account access
- EAS CLI 19.0.6+ (the scripts below use `npx eas-cli@latest` so a stale global EAS install is okay)

Then install dependencies from the repository root:

```bash
pnpm install
```

## Quick Expo QA with QR code

From this package directory:

```bash
cd artifacts/mobile
pnpm run start:lan
```

If the phone cannot reach the LAN URL, use:

```bash
pnpm run start:tunnel
```

Open the QR code in Expo Go. For notification QA, go to **Profile → Test notifications** and run the short test scenario.

## Build a test APK

Use this for internal testing on real Android devices:

```bash
cd artifacts/mobile
pnpm run build:android:apk
```

This uses the EAS `preview` profile and produces an APK suitable for manual installation/testing.

## Build a RuStore release artifact

RuStore can accept APK or AAB artifacts. Prefer AAB for the production store upload unless you specifically need an APK.

### Production AAB

```bash
cd artifacts/mobile
pnpm run build:android:aab
```

### Production APK

```bash
cd artifacts/mobile
pnpm run build:android:apk:release
```

## Signing notes

Use one stable release signing key for all future updates. If EAS asks whether it should manage Android credentials, choose the option that matches your release process and keep access to the generated/uploaded keystore. Losing the release key can prevent normal updates under the same package name.

Before publishing a new version:

1. Increase `expo.android.versionCode` in `app.json`.
2. Keep `expo.android.package` unchanged.
3. Run type-checks.
4. Build AAB/APK with the production profile.
5. Smoke-test the release artifact on a real Android device.
6. Upload the release artifact in RuStore Console.

## Local validation commands

```bash
pnpm --filter @workspace/mobile run typecheck
pnpm run typecheck
cd artifacts/mobile && pnpm exec expo config --type public
```

## RuStore submission checklist

Prepare these before upload:

- App name and full description.
- App icon and screenshots.
- Category and age rating.
- Privacy policy URL.
- Developer contact information.
- Release notes.
- Explanation for notification permission usage (`POST_NOTIFICATIONS`).
