<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Все туры
        DB::statement("
            CREATE OR REPLACE VIEW view_1 AS
            SELECT
                t.id,
                t.title,
                t.start_date,
                t.end_date,
                t.price,
                t.seats_total,
                t.seats_available,
                t.status,
                c.name AS city_name,
                tt.title AS type_title
            FROM tours t
            LEFT JOIN cities c ON t.city_id = c.id
            LEFT JOIN tour_types tt ON t.type_id = tt.id;
        ");

        // 2. Клиенты с турами — через таблицу users
        DB::statement("
            CREATE OR REPLACE VIEW view_2 AS
            SELECT
                u.id AS user_id,
                u.name AS full_name,
                u.email,
                t.id AS tour_id,
                t.title AS tour_title,
                t.status AS booking_status,
                p.amount AS payment_amount
            FROM users u
            JOIN bookings b ON u.id = b.user_id
            JOIN tours t ON b.tour_id = t.id
            LEFT JOIN payments p ON b.id = p.booking_id;

        ");

        // 3. Города с турами и ценами
        DB::statement("
            CREATE OR REPLACE VIEW view_3 AS
            SELECT
                c.name AS city_name,
                t.title AS tour_title,
                t.price
            FROM tours t
            JOIN cities c ON t.city_id = c.id;
        ");

        // 4. Все туры с типами
        DB::statement("
            CREATE OR REPLACE VIEW view_4 AS
            SELECT
                t.*,
                tt.title AS type_title
            FROM tours t
            LEFT JOIN tour_types tt ON t.type_id = tt.id;
        ");

        // 5. Клиенты с турами в определенный период
        DB::statement("
            CREATE OR REPLACE VIEW view_5 AS
            SELECT 
                u.id AS user_id,
                u.name AS full_name,
                u.email,
                b.created_at AS booking_date,
                t.id AS tour_id,
                t.title AS tour_title
            FROM users u
            JOIN bookings b ON u.id = b.user_id
            JOIN tours t ON b.tour_id = t.id;

        ");

        // 6. Клиенты, потратившие больше заданной суммы
        DB::statement("
            CREATE OR REPLACE VIEW view_6 AS
            SELECT 
                u.id AS user_id,
                u.name AS full_name,
                u.email,
                SUM(p.amount) AS total_spent
            FROM users u
            JOIN bookings b ON u.id = b.user_id
            JOIN payments p ON b.id = p.booking_id
            GROUP BY u.id, u.name, u.email;

        ");

        // 7. Доступные туры в определенный период
        DB::statement("
            CREATE OR REPLACE VIEW view_7 AS
            SELECT *
            FROM tours
            WHERE seats_available > 0;
        ");

        // 8. Клиенты по типу тура
        DB::statement("
            CREATE OR REPLACE VIEW view_8 AS
            SELECT 
                u.id AS user_id,
                u.name AS full_name,
                u.email,
                t.id AS tour_id,
                t.title AS tour_title,
                tt.title AS tour_type
            FROM users u
            JOIN bookings b ON u.id = b.user_id
            JOIN tours t ON b.tour_id = t.id
            JOIN tour_types tt ON t.type_id = tt.id
            WHERE tt.title = 'Музыкальный фестиваль';
        ");

        // 9. Туры с доступными местами
        DB::statement("
            CREATE OR REPLACE VIEW view_9 AS
            SELECT *
            FROM tours
            WHERE seats_available > 0;
        ");

        // 10. Клиенты, у которых сумма трат превышает среднюю
        DB::statement("
            CREATE OR REPLACE VIEW view_10 AS
            SELECT 
                u.id AS user_id,
                u.name AS full_name,
                u.email,
                SUM(p.amount) AS total_spent
            FROM users u
            JOIN bookings b ON u.id = b.user_id
            JOIN payments p ON b.id = p.booking_id
            GROUP BY u.id, u.name, u.email
            HAVING SUM(p.amount) > (
                SELECT AVG(total)
                FROM (
                    SELECT SUM(amount) AS total
                    FROM payments
                    JOIN bookings b2 ON payments.booking_id = b2.id
                    WHERE b2.user_id IS NOT NULL
                    GROUP BY b2.user_id
                ) AS subquery
            );

        ");
    }

    public function down(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            DB::statement("DROP VIEW IF EXISTS view_$i;");
        }
    }
};
