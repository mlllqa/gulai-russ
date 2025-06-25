<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CitySeeder extends Seeder
{
    public function run()
    {
        DB::table('cities')->insert([
            ['id' => 1, 'name' => 'Москва'],
            ['id' => 2, 'name' => 'Санкт-Петербург'],
            ['id' => 3, 'name' => 'Тамбов'],
            ['id' => 4, 'name' => 'Ленинградская область'],
        ]);
    }
}
