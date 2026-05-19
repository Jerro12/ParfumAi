<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'user_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'delivery_type',
        'shipping_address',
        'total_amount',
        'payment_method',
        'payment_status',
        'order_status',
        'payment_proof',
        'notes',
    ];

    protected $casts = [
        'total_amount' => 'float',
    ];

    protected $appends = ['total_formatted', 'created_date'];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getTotalFormattedAttribute(): string
    {
        return 'Rp ' . number_format($this->total_amount, 0, ',', '.');
    }

    public function getCreatedDateAttribute(): string
    {
        return $this->created_at ? $this->created_at->format('d M Y, H:i') : '';
    }
}
