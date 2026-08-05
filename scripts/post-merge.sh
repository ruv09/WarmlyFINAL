#!/bin/bash
set -e
pnpm install --frozen-lockfile
pnpm --dir artifacts/warmly-v2 install --ignore-workspace --frozen-lockfile
