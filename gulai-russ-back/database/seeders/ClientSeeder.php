<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClientSeeder extends Seeder
{
    public function run()
    {
        DB::table('clients')->insert([
            [
                'id' => 1,
                'full_name' => 'Иванов Иван',
                'email' => 'ivan@example.com',
                'phone' => '+79990001111',
                'registration_date' => '2024-06-01',
            ],
            [
                'id' => 2,
                'full_name' => 'Петрова Анна',
                'email' => 'anna@example.com',
                'phone' => '+79990002222',
                'registration_date' => '2024-06-02',
            ],
            [
                'id' => 3,
                'full_name' => 'Сидоров Алексей',
                'email' => 'alex@example.com',
                'phone' => '+79990003333',
                'registration_date' => '2024-06-03',
            ],
        ]);
    }
}
