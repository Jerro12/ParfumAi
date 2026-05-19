<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Menampilkan daftar semua transaksi / pembelian.
     */
    public function index()
    {
        $orders = Order::with('items')->latest()->get();
        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Memperbarui status pesanan dan status pembayaran.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'order_status' => 'required|string|in:Menunggu Verifikasi,Diproses,Siap Diambil,Dikirim,Selesai,Dibatalkan',
            'payment_status' => 'required|string|in:Menunggu Pembayaran,Terverifikasi,Gagal',
        ]);

        $order->update($validated);

        return redirect()->route('admin.pembelian')->with('success', 'Status transaksi #'.$order->invoice_number.' berhasil diperbarui.');
    }

    /**
     * Menghapus pesanan.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()->route('admin.pembelian')->with('success', 'Transaksi berhasil dihapus.');
    }
}
