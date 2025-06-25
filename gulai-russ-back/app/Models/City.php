<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    protected $table = 'cities';

    protected $fillable = ['name'];

    public function tours(): HasMany
    {
        return $this->hasMany(Tour::class);
    }
}
