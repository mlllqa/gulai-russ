<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TourTypeSeeder extends Seeder
{
    public function run()
    {
        DB::table('tour_types')->insert([
            ['id' => 1, 'title' => 'Музыкальный фестиваль'],
            ['id' => 2, 'title' => 'Культурно-гастрономический фестиваль'],
        ]);
    }
}
