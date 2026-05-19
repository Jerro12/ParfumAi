<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BottleSize extends Model
{
    use HasFactory;

    protected $fillable = [
        'size',
        'default_price',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'default_price' => 'float',
    ];

    protected $appends = ['price_formatted'];

    public function getPriceFormattedAttribute(): string
    {
        return 'Rp ' . number_format($this->default_price, 0, ',', '.');
    }
}
