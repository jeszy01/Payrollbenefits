#!/usr/bin/env bash
# Scaffolds Laravel into ./backend using Docker, then applies our files on top.
set -e
export MSYS_NO_PATHCONV=1
cd "$(dirname "$0")"
[ -d backend ] && { echo "backend/ already exists - delete it first."; exit 1; }

docker run --rm -v "$PWD":/app -w /app composer:2 create-project laravel/laravel backend --prefer-dist --no-interaction
docker run --rm -v "$PWD/backend":/app -w /app --entrypoint php composer:2 artisan install:api --no-interaction
cp -R backend-overlay/. backend/
rm -f backend/database/database.sqlite
echo "Done. Next: cp .env.example .env, set APP_KEY, then docker compose up --build"
