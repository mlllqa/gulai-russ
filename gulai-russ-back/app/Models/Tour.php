<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Booking;

class Tour extends Model
{
    protected $table = 'tours';

    protected $fillable = [
        'title',
        'start_date',
        'end_date',
        'price',
        'seats_total',
        'seats_available',
        'description',
        'status',
        'city_id',
        'type_id',
        'program',
        'included',
        'what_to_take',
        'tags',
        'image_path',
    ];

    /**
     * Город, к которому относится тур
     */
    public function city()
    {
        return $this->belongsTo(City::class);
    }

    /**
     * Тип тура
     */
    public function type()
    {
        return $this->belongsTo(TourType::class, 'type_id');
    }

    /**
     * Бронирования, связанные с туром
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
