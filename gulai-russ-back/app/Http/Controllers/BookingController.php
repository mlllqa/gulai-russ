<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tour_id' => 'required|exists:tours,id',
        ]);

        $booking = Booking::create([
            'client_id' => Auth::id(),
            'tour_id' => $validated['tour_id'],
        ]);

        return response()->json([
            'message' => 'Бронирование успешно!',
            'booking' => $booking,
        ]);
    }

    public function myBookings()
    {
        $bookings = Auth::user()->bookings()->with('tour')->get();

        return response()->json($bookings);
    }
}
