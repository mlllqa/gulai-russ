<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 💥 Создаём тестового админа, если ещё нет
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test Admin',
                'password' => Hash::make('password'),
            ]
        );

        // 🔁 Генерим 5 случайных юзеров
        User::factory()->count(5)->create();
    }
}
