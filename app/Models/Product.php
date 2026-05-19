<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'price',
        'image',
        'description',
        'gender',
        'longevity',
        'is_bestseller',
        'ai_verdict',
        'rating',
        'reviews_count',
    ];

    protected $casts = [
        'is_bestseller' => 'boolean',
    ];

    protected $appends = ['price_formatted'];

    public function getPriceFormattedAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }
}
