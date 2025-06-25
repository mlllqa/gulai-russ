<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TourType extends Model
{
    protected $table = 'tour_types';

    protected $fillable = ['title'];

    public function tours(): HasMany
    {
        return $this->hasMany(Tour::class, 'type_id');
    }
}
