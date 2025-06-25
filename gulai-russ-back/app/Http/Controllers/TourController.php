<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use App\Models\City;
use Illuminate\Http\Request;

class TourController extends Controller
{
    public function index(Request $request)
    {
        $query = Tour::with(['city', 'type']);

        // 🔍 Если передан город по названию — ищем city_id
        if ($request->has('city')) {
            $cityName = $request->input('city');
            $cityId = City::where('name', $cityName)->value('id');
            if ($cityId) {
                $query->where('city_id', $cityId);
            }
        }

        // 🔧 Можно сюда же добавить и другие фильтры (типа season, format, и т.д.)

        $tours = $query->get()->map(function ($tour) {
            return [
                'id' => $tour->id,
                'title' => $tour->title,
                'start_date' => $tour->start_date,
                'end_date' => $tour->end_date,
                'price' => $tour->price,
                'seats_total' => $tour->seats_total,
                'seats_available' => $tour->seats_available,
                'description' => $tour->description,
                'status' => $tour->status,

                'city_id' => $tour->city_id,
                'city' => $tour->city->name ?? 'Город не указан',

                'type' => $tour->type->title ?? 'Формат не указан',
                'program' => $tour->program,
                'included' => json_decode($tour->included, true) ?? [],
                'what_to_take' => json_decode($tour->what_to_take, true) ?? [],
                'tags' => json_decode($tour->tags, true) ?? [],
                'image_path' => '/images/cards/' . basename($tour->image_path),
            ];
        });

        return response()->json($tours);
    }

    public function show($id)
    {
        $tour = Tour::with(['city', 'type'])->findOrFail($id);

        return response()->json([
            'id' => $tour->id,
            'title' => $tour->title,
            'start_date' => $tour->start_date,
            'end_date' => $tour->end_date,
            'price' => $tour->price,
            'seats_total' => $tour->seats_total,
            'seats_available' => $tour->seats_available,
            'description' => $tour->description,
            'status' => $tour->status,

            'city_id' => $tour->city_id,
            'city' => $tour->city->name ?? 'Город не указан',

            'type' => $tour->type->title ?? 'Формат не указан',
            'program' => $tour->program,
            'included' => json_decode($tour->included, true) ?? [],
            'what_to_take' => json_decode($tour->what_to_take, true) ?? [],
            'tags' => json_decode($tour->tags, true) ?? [],
            'image_path' => '/images/cards/' . basename($tour->image_path),
        ]);
    }
}
