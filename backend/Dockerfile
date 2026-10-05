FROM php:8.3-cli
RUN apt-get update && apt-get install -y git unzip libpq-dev libzip-dev \
    && docker-php-ext-install pdo_pgsql zip bcmath
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /app
COPY . .
RUN composer install --no-dev --optimize-autoloader --no-scripts
CMD php artisan package:discover --ansi && php artisan migrate --force && php artisan db:seed --class=AdminSeeder --force && php artisan config:cache
