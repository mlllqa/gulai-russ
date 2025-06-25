<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentSeeder extends Seeder
{
    public function run()
    {
        DB::table('payments')->insert([
            [
                'amount' => 14900,
                'payment_date' => '2025-05-01',
                'method' => 'карта',
                'booking_id' => 1,
            ],
            [
                'amount' => 9900,
                'payment_date' => '2025-05-02',
                'method' => 'перевод',
                'booking_id' => 2,
            ],
        ]);
    }
}
