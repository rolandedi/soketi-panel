#!/bin/sh
set -e

echo "⏳ Running database migrations..."
pnpm migrate

echo "🌱 Running database seeds..."
pnpm seed --specific=create_admin_user.ts

echo "✅ Migrations and seeds completed. Starting application..."
exec node /app/server/index.mjs
