FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    libpq-dev \
    zip unzip git curl \
    && docker-php-ext-install pdo pdo_pgsql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY ./gulai-russ-back /var/www

RUN composer install

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000
