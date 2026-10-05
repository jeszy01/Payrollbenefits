#!/bin/sh
set -e

# Render provides $PORT; Apache must listen on it
PORT="${PORT:-80}"
sed -i "s/Listen [0-9]*/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:[0-9]*>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

if [ -z "$APP_KEY" ]; then echo "APP_KEY is not set" >&2; exit 1; fi

php artisan config:cache
php artisan route:cache
php artisan migrate --force

# First admin account from env vars (skipped if it already exists)
if [ -n "$ADMIN_EMPLOYEE_ID" ] && [ -n "$ADMIN_PASSWORD" ]; then
  php artisan employee:create "$ADMIN_EMPLOYEE_ID" "${ADMIN_NAME:-Administrator}" --skip-existing --no-interaction
fi

chown -R www-data:www-data storage bootstrap/cache
exec apache2-foreground
