<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderHistoryController extends Controller
{
    /**
     * Menampilkan daftar riwayat transaksi & tiket pengambilan milik pengguna.
     */
    public function index()
    {
        $user = Auth::user();
        $orders = Order::with('items')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return Inertia::render('Shop/RiwayatTransaksi', [
            'orders' => $orders,
        ]);
    }
}
