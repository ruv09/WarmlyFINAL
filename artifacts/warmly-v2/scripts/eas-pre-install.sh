#!/usr/bin/env bash
# EAS clones the full repo and runs `pnpm install` from artifacts/warmly-v2.
# The parent pnpm-workspace.yaml has `packages: []`, so that install never
# puts expo-router (or anything else) into this folder — Expo then fails with
# "Failed to resolve plugin for module expo-router". Detach from the parent
# workspace on CI/EAS only.
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "$APP_DIR/../.." && pwd)"

if [ "${EAS_BUILD:-}" != "true" ] && [ "${CI:-}" != "true" ]; then
  exit 0
fi

echo "EAS/CI: isolating ${APP_DIR} from ${REPO_ROOT}/pnpm-workspace.yaml"
for name in pnpm-workspace.yaml pnpm-lock.yaml; do
  if [ -f "$REPO_ROOT/$name" ]; then
    mv "$REPO_ROOT/$name" "$REPO_ROOT/$name.eas-bak"
  fi
done
