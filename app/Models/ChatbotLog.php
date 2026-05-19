<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatbotLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'user_name',
        'message',
        'reply',
        'source',
    ];
}
