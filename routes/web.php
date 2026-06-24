<?php

use App\Http\Controllers\Admin\BottleSizeController;
use App\Http\Controllers\Admin\ChatbotLogController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\OrderHistoryController;
use App\Models\BottleSize;
use App\Models\Product;
use App\Models\SiteSetting;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ════════════════════════════════════════════════════════════
//  Public Routes
// ════════════════════════════════════════════════════════════

Route::get('/', function () {
    $featured = Product::where('is_bestseller', true)->limit(8)->get();
    if ($featured->count() < 4) {
        $featured = Product::limit(8)->get();
    }

    return Inertia::render('Welcome', [
        'canLogin'           => Route::has('login'),
        'canRegister'        => Route::has('register'),
        'laravelVersion'     => Application::VERSION,
        'phpVersion'         => PHP_VERSION,
        'dbFeaturedProducts' => $featured,
        'heroImage'          => SiteSetting::get('hero_image'),
        'heroOverlay'        => [
            'label' => SiteSetting::get('hero_label', 'AI Signature Blend'),
            'title' => SiteSetting::get('hero_title', "Velour d'Or #99"),
            'badge' => SiteSetting::get('hero_badge', 'Top 1% Pick'),
        ],
    ]);
});

Route::get('/dashboard', function () {
    return auth()->user()?->isAdmin()
        ? redirect()->route('admin.dashboard')
        : redirect()->route('katalog');
})->middleware(['auth', 'verified'])->name('dashboard');

// ────────────────────────────────────────────────────────────
//  Chatbot API
// ────────────────────────────────────────────────────────────
Route::post('/api/chat', [ChatbotController::class, 'chat']);

// ────────────────────────────────────────────────────────────
//  Shop / E-Commerce
// ────────────────────────────────────────────────────────────
Route::get('/katalog', function () {
    return Inertia::render('Shop/Katalog', ['dbProducts' => Product::all()]);
})->name('katalog');

Route::get('/katalog/{id}', function ($id) {
    return Inertia::render('Shop/ProdukDetail', [
        'dbProduct'   => Product::find($id),
        'bottleSizes' => BottleSize::where('is_active', true)->orderBy('default_price')->get(),
    ]);
})->name('katalog.detail');

Route::get('/tentang-kami', function () {
    return Inertia::render('Shop/TentangKami', [
        'tentangKisahImage' => SiteSetting::get('tentang_kisah_image'),
        'tentangKisahLabel' => SiteSetting::get('tentang_kisah_label', 'Koleksi 36 Varian Pilihan'),
        'tentangKisahDesc'  => SiteSetting::get('tentang_kisah_desc', 'Diformulasikan secara ketat berdasarkan dataset olfaktori teruji untuk menjamin ketahanan dan proyeksi aroma terbaik.'),
    ]);
})->name('tentang');

// ────────────────────────────────────────────────────────────
//  Cart, Checkout & Order History (Auth Required)
// ────────────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/keranjang', [CartController::class, 'index'])->name('keranjang');
    Route::post('/keranjang', [CartController::class, 'store'])->name('keranjang.store');
    Route::put('/keranjang/{cartItem}', [CartController::class, 'update'])->name('keranjang.update');
    Route::delete('/keranjang/{cartItem}', [CartController::class, 'destroy'])->name('keranjang.destroy');

    Route::get('/checkout', [CartController::class, 'checkoutPage'])->name('checkout');
    Route::post('/checkout', [CartController::class, 'processCheckout'])->name('checkout.process');

    Route::get('/riwayat-transaksi', [OrderHistoryController::class, 'index'])->name('riwayat');
});

// ════════════════════════════════════════════════════════════
//  Admin Routes (Auth + Role:admin)
// ════════════════════════════════════════════════════════════
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Produk
    Route::get('/produk', [ProductController::class, 'index'])->name('produk');
    Route::post('/produk', [ProductController::class, 'store'])->name('produk.store');
    Route::put('/produk/{product}', [ProductController::class, 'update'])->name('produk.update');
    Route::delete('/produk/{product}', [ProductController::class, 'destroy'])->name('produk.destroy');

    // Ukuran Botol
    Route::get('/ukuran-botol', [BottleSizeController::class, 'index'])->name('ukuran-botol');
    Route::post('/ukuran-botol', [BottleSizeController::class, 'store'])->name('ukuran-botol.store');
    Route::put('/ukuran-botol/{bottleSize}', [BottleSizeController::class, 'update'])->name('ukuran-botol.update');
    Route::delete('/ukuran-botol/{bottleSize}', [BottleSizeController::class, 'destroy'])->name('ukuran-botol.destroy');

    // Pembelian / Order
    Route::get('/pembelian', [OrderController::class, 'index'])->name('pembelian');
    Route::put('/pembelian/{order}/status', [OrderController::class, 'updateStatus'])->name('pembelian.status');
    Route::delete('/pembelian/{order}', [OrderController::class, 'destroy'])->name('pembelian.destroy');

    // Chatbot Logs
    Route::get('/chatbot', [ChatbotLogController::class, 'index'])->name('chatbot');
    Route::delete('/chatbot/clear', [ChatbotLogController::class, 'clear'])->name('chatbot.clear');
    Route::get('/chatbot/export-nlu', [ChatbotLogController::class, 'exportNlu'])->name('chatbot.export');
    Route::delete('/chatbot/{id}', [ChatbotLogController::class, 'destroy'])->name('chatbot.destroy');

    // Pengaturan
    Route::get('/pengaturan', [SettingController::class, 'index'])->name('pengaturan');
    Route::post('/pengaturan', [SettingController::class, 'update'])->name('pengaturan.update');
    Route::post('/pengaturan/reset-hero', [SettingController::class, 'resetHeroImage'])->name('pengaturan.reset-hero');
    Route::post('/pengaturan/reset-kisah', [SettingController::class, 'resetTentangKisah'])->name('pengaturan.reset-kisah');
});

// ════════════════════════════════════════════════════════════
//  Profile (Auth Required)
// ════════════════════════════════════════════════════════════
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
