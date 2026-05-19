<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\BottleSize;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Menampilkan halaman keranjang belanja untuk user yang sedang login.
     */
    public function index()
    {
        $user = Auth::user();
        $cartItems = $user ? $user->cartItems()->with('product')->latest()->get() : [];

        $totalAmount = collect($cartItems)->reduce(function ($sum, $item) {
            return $sum + ($item->unit_price * $item->quantity);
        }, 0);

        return Inertia::render('Shop/Keranjang', [
            'cartItems' => $cartItems,
            'totalAmount' => $totalAmount,
            'totalFormatted' => 'Rp ' . number_format($totalAmount, 0, ',', '.')
        ]);
    }

    /**
     * Menambahkan produk dengan ukuran tertentu ke dalam keranjang.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'bottle_size' => 'required|string',
            'unit_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();

        $existingItem = CartItem::where('user_id', $user->id)
            ->where('product_id', $validated['product_id'])
            ->where('bottle_size', $validated['bottle_size'])
            ->first();

        if ($existingItem) {
            $existingItem->increment('quantity', $validated['quantity']);
        } else {
            CartItem::create([
                'user_id' => $user->id,
                'product_id' => $validated['product_id'],
                'bottle_size' => $validated['bottle_size'],
                'unit_price' => $validated['unit_price'],
                'quantity' => $validated['quantity'],
            ]);
        }

        return redirect()->route('keranjang')->with('success', 'Parfum berhasil ditambahkan ke tas belanja Anda.');
    }

    /**
     * Memperbarui kuantitas item dalam keranjang.
     */
    public function update(Request $request, CartItem $cartItem)
    {
        if (Auth::id() !== $cartItem->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        $cartItem->update(['quantity' => $validated['quantity']]);

        return redirect()->back()->with('success', 'Kuantitas berhasil diperbarui.');
    }

    /**
     * Menghapus satu item dari keranjang.
     */
    public function destroy(CartItem $cartItem)
    {
        if (Auth::id() !== $cartItem->user_id) {
            abort(403);
        }

        $cartItem->delete();

        return redirect()->back()->with('success', 'Item berhasil dihapus dari keranjang.');
    }

    /**
     * Halaman Checkout: Rangkuman pembelian sebelum konfirmasi.
     */
    public function checkoutPage()
    {
        $user = Auth::user();
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('katalog')->with('error', 'Keranjang belanja Anda kosong. Silakan pilih parfum terlebih dahulu.');
        }

        $totalAmount = collect($cartItems)->reduce(function ($sum, $item) {
            return $sum + ($item->unit_price * $item->quantity);
        }, 0);

        return Inertia::render('Shop/Checkout', [
            'cartItems' => $cartItems,
            'totalAmount' => $totalAmount,
            'totalFormatted' => 'Rp ' . number_format($totalAmount, 0, ',', '.'),
            'defaultName' => $user->name,
            'defaultEmail' => $user->email,
        ]);
    }

    /**
     * Proses Pemesanan (Checkout): Memindahkan cart_items menjadi Order & OrderItem.
     */
    public function processCheckout(Request $request)
    {
        $user = Auth::user();
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('katalog')->with('error', 'Keranjang belanja kosong.');
        }

        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:30',
            'delivery_type' => 'required|string|in:Kirim ke Alamat (Kurir / Ekspedisi),Ambil Langsung di Toko (In-Store Pickup / Cashier)',
            'shipping_address' => 'nullable|string|max:1000',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string|max:1000',
        ]);

        $totalAmount = collect($cartItems)->reduce(function ($sum, $item) {
            return $sum + ($item->unit_price * $item->quantity);
        }, 0);

        $invoiceNumber = 'INV-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

        $order = Order::create([
            'invoice_number' => $invoiceNumber,
            'user_id' => $user->id,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'delivery_type' => $validated['delivery_type'],
            'shipping_address' => $validated['delivery_type'] === 'Ambil Langsung di Toko (In-Store Pickup / Cashier)' 
                ? '🏪 Pengambilan di Butik Fisik Parfumerie (Customer akan datang ke toko)' 
                : $validated['shipping_address'],
            'total_amount' => $totalAmount,
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'Menunggu Pembayaran',
            'order_status' => $validated['delivery_type'] === 'Ambil Langsung di Toko (In-Store Pickup / Cashier)' ? 'Siap Diambil' : 'Menunggu Verifikasi',
            'notes' => $validated['notes'],
        ]);

        foreach ($cartItems as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product ? $item->product->name : 'Parfum Eksklusif',
                'bottle_size' => $item->bottle_size,
                'unit_price' => $item->unit_price,
                'quantity' => $item->quantity,
                'subtotal' => $item->unit_price * $item->quantity,
            ]);
        }

        CartItem::where('user_id', $user->id)->delete();

        return redirect()->route('riwayat')->with('success', 'Transaksi berhasil! Faktur #'.$invoiceNumber.' telah dicatat. Silakan tunjukkan tiket digital ini kepada kasir saat mengambil di butik.');
    }
}
