#!/usr/bin/env bash
# Runs as eas-build-pre-install (only on EAS). Do not gate on EAS_BUILD:
# that env is not always present yet, and skipping left the parent workspace
# in place — pnpm then installed the empty root workspace, and prebuild
# could not resolve expo-router.
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "$APP_DIR/../.." && pwd)"

echo "EAS pre-install: app=${APP_DIR}"
echo "EAS pre-install: repo=${REPO_ROOT}"

# Parent workspace has packages: [] and a different lockfile/.npmrc.
# EAS otherwise runs `pnpm install` at the repo root (prettier only).
for name in pnpm-workspace.yaml pnpm-lock.yaml .npmrc; do
  if [ -f "$REPO_ROOT/$name" ]; then
    echo "EAS pre-install: detaching $REPO_ROOT/$name"
    mv "$REPO_ROOT/$name" "$REPO_ROOT/$name.eas-bak"
  fi
done

cd "$APP_DIR"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "EAS pre-install: enabling pnpm via corepack"
  corepack enable
  corepack prepare pnpm@10.33.3 --activate
fi

echo "EAS pre-install: pnpm $(pnpm --version)"
if pnpm install --help 2>/dev/null | grep -q -- "--ignore-workspace"; then
  pnpm install --ignore-workspace --frozen-lockfile
else
  pnpm install --frozen-lockfile
fi

if [ ! -f node_modules/expo-router/app.plugin.js ]; then
  echo "EAS pre-install: expo-router plugin still missing" >&2
  ls -la node_modules | head >&2 || true
  exit 1
fi

echo "EAS pre-install: expo-router plugin ready"
