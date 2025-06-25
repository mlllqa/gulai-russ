<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BookingSeeder extends Seeder
{
    public function run()
    {
        DB::table('bookings')->insert([
            [
                'booking_date' => '2025-05-01',
                'payment_amount' => 14900,
                'status' => 'подтверждён',
                'client_id' => 1,
                'tour_id' => 1,
            ],
            [
                'booking_date' => '2025-05-02',
                'payment_amount' => 9900,
                'status' => 'подтверждён',
                'client_id' => 2,
                'tour_id' => 2,
            ],
            [
                'booking_date' => '2025-05-03',
                'payment_amount' => 8900,
                'status' => 'в обработке',
                'client_id' => 3,
                'tour_id' => 7,
            ],
        ]);
    }
}
