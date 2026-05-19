<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\BottleSizeController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\OrderHistoryController;
use App\Models\BottleSize;
use App\Models\Product;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use GuzzleHttp\Client;

Route::get('/', function () {
    $featuredProducts = Product::where('is_bestseller', true)->limit(8)->get();
    if ($featuredProducts->count() < 4) {
        $featuredProducts = Product::limit(8)->get();
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'dbFeaturedProducts' => $featuredProducts,
    ]);
});

Route::get('/dashboard', function () {
    if (auth()->user() && auth()->user()->isAdmin()) {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('katalog');
})->middleware(['auth', 'verified'])->name('dashboard');

// Endpoint API Chatbot dengan Rasa REST Integration & Fail-Safe Fallback
Route::post('/api/chat', function (Request $request) {
    $message = $request->input('message', '');
    if (empty($message)) {
        return response()->json(['reply' => 'Mohon tulis pesan atau pertanyaan Anda.']);
    }

    $activeSizes = BottleSize::where('is_active', true)->orderBy('default_price')->get();
    $sizeTextList = $activeSizes->map(function($b) {
        return "{$b->size} (Rp " . number_format($b->default_price, 0, ',', '.') . ")";
    })->implode(' | ');

    try {
        $client = new Client(['timeout' => 5.0]);
        $response = $client->post('http://127.0.0.1:5005/webhooks/rest/webhook', [
            'json' => [
                'sender' => session()->getId() ?? 'user_skripsi_dyn',
                'message' => $message
            ]
        ]);

        $body = json_decode($response->getBody(), true);
        if (!empty($body) && isset($body[0]['text'])) {
            $fullReply = collect($body)->pluck('text')->implode("\n\n");
            \App\Models\ChatbotLog::create([
                'session_id' => session()->getId(),
                'user_name' => auth()->check() ? auth()->user()->name : 'Tamu (Guest)',
                'message' => $message,
                'reply' => $fullReply,
                'source' => 'rasa',
            ]);
            return response()->json(['reply' => $fullReply, 'source' => 'rasa']);
        }
    } catch (\Exception $e) {
        // Fallback
    }

    $q = mb_strtolower($message);
    $productsQuery = Product::query();

    $isFemale = str_contains($q, 'wanita') || str_contains($q, 'cewek') || str_contains($q, 'perempuan');
    $isMale = str_contains($q, 'pria') || str_contains($q, 'cowok') || str_contains($q, 'laki');
    $isBestseller = str_contains($q, 'best seller') || str_contains($q, 'terlaris') || str_contains($q, 'favorit') || str_contains($q, 'laris') || str_contains($q, 'scandal') || str_contains($q, 'dunhill');
    $isCoffee = str_contains($q, 'kopi') || str_contains($q, 'opium') || str_contains($q, 'cappuccino');
    $isVanilla = str_contains($q, 'vanilla') || str_contains($q, 'cake') || str_contains($q, 'kue') || str_contains($q, 'manis');
    $isWoody = str_contains($q, 'woody') || str_contains($q, 'kayu') || str_contains($q, 'scandal') || str_contains($q, 'channel');
    $isLonglasting = str_contains($q, 'tahan lama') || str_contains($q, '8') || str_contains($q, '10') || str_contains($q, '12') || str_contains($q, 'awet') || str_contains($q, 'sauvage');

    if ($isFemale) $productsQuery->where('gender', 'Perempuan');
    if ($isMale) $productsQuery->where('gender', 'Laki-laki');
    if ($isBestseller) $productsQuery->where('is_bestseller', true);
    if ($isCoffee) $productsQuery->where(function($query) {
        $query->where('category', 'like', '%Kopi%')->orWhere('name', 'like', '%Cappuccino%');
    });
    if ($isVanilla) $productsQuery->where(function($query) {
        $query->where('category', 'like', '%Vanilla%')->orWhere('category', 'like', '%Manis%');
    });
    if ($isWoody) $productsQuery->where('category', 'like', '%Woody%');

    $results = $productsQuery->limit(5)->get();

    if ($results->isEmpty()) {
        $results = Product::where('is_bestseller', true)->limit(5)->get();
    }

    if ($isFemale && $isBestseller) {
        $reply = "✨ [Sistem Fallback DB] Berikut adalah koleksi **Parfum Wanita Terlaris (Best Seller)**:\n\n";
    } elseif ($isMale && $isLonglasting) {
        $reply = "👑 [Sistem Fallback DB] Untuk pria yang mencari **Ketahanan Ekstrem (8-12 Jam)** (seperti Sauvage Louis & Baccarat):\n\n";
    } elseif ($isCoffee) {
        $reply = "☕ [Sistem Fallback DB] Untuk pencinta aroma adiktif **Kopi & Vanilla** (Black Opium, Cappuccino):\n\n";
    } elseif ($isWoody) {
        $reply = "🌲 [Sistem Fallback DB] Koleksi keharuman **Woody Elegan & Musky** (Scandalouis, DunhillBlue, Black Channel):\n\n";
    } elseif ($isVanilla) {
        $reply = "🍰 [Sistem Fallback DB] Koleksi wewangian **Manis & Vanilla (Gourmand)**:\n\n";
    } elseif ($isFemale) {
        $reply = "🌸 [Sistem Fallback DB] Rekomendasi khusus **Parfum Wanita** terkurasi:\n\n";
    } elseif ($isMale) {
        $reply = "🎩 [Sistem Fallback DB] Pilihan wewangian **Pria Karismatik**:\n\n";
    } else {
        $reply = "🌟 [Sistem Fallback DB] Hasil pencarian dari katalog 36 varian parfum:\n\n";
    }

    foreach ($results as $idx => $item) {
        $no = $idx + 1;
        $star = $item->is_bestseller ? "⭐ Best Seller!" : "✦ Regular";
        $reply .= "{$no}. **{$item->name}** ({$item->gender})\n";
        $reply .= "   • Kategori Aroma: {$item->category} ({$star})\n";
        $reply .= "   • Ketahanan: {$item->longevity}\n\n";
    }

    $reply .= "🏷️ **Daftar Ukuran & Harga Dinamis Tersedia Saat Ini**:\n" . $sizeTextList . "\n\n";
    $reply .= "💡 **Info Sommelier**: Kunjungi menu **Katalog** di bilah atas untuk melihat ketersediaan ukuran secara real-time dan melakukan pemesanan instan!";

    \App\Models\ChatbotLog::create([
        'session_id' => session()->getId(),
        'user_name' => auth()->check() ? auth()->user()->name : 'Tamu (Guest)',
        'message' => $message,
        'reply' => $reply,
        'source' => 'db_fallback',
    ]);

    return response()->json(['reply' => $reply, 'source' => 'db_fallback']);
});

// E-Commerce Public Routes
Route::get('/katalog', function () {
    $products = Product::all();
    return Inertia::render('Shop/Katalog', ['dbProducts' => $products]);
})->name('katalog');

Route::get('/katalog/{id}', function ($id) {
    $product = Product::find($id);
    $bottleSizes = BottleSize::where('is_active', true)->orderBy('default_price')->get();
    return Inertia::render('Shop/ProdukDetail', [
        'dbProduct' => $product,
        'bottleSizes' => $bottleSizes
    ]);
})->name('katalog.detail');

Route::get('/tentang-kami', function () {
    return Inertia::render('Shop/TentangKami');
})->name('tentang');

// Rute Keranjang, Checkout, dan Riwayat / Tiket Pengambilan (Dilindungi Middleware Auth agar privat per pengguna)
Route::middleware('auth')->group(function () {
    Route::get('/keranjang', [CartController::class, 'index'])->name('keranjang');
    Route::post('/keranjang', [CartController::class, 'store'])->name('keranjang.store');
    Route::put('/keranjang/{cartItem}', [CartController::class, 'update'])->name('keranjang.update');
    Route::delete('/keranjang/{cartItem}', [CartController::class, 'destroy'])->name('keranjang.destroy');

    Route::get('/checkout', [CartController::class, 'checkoutPage'])->name('checkout');
    Route::post('/checkout', [CartController::class, 'processCheckout'])->name('checkout.process');

    Route::get('/riwayat-transaksi', [OrderHistoryController::class, 'index'])->name('riwayat');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        $totalSales = \App\Models\Order::where('payment_status', 'Terverifikasi')->sum('total_amount');
        $totalOrders = \App\Models\Order::count();
        $totalCustomers = \App\Models\User::where('role', 'user')->count();
        $conversionRate = $totalCustomers > 0 ? min(100, round(($totalOrders / ($totalCustomers * 3)) * 100, 2)) : 0;
        
        $recentOrdersRaw = \App\Models\Order::with('items')->latest()->limit(5)->get();
        $recentOrders = $recentOrdersRaw->map(function($o) {
            $prodNames = $o->items->map(function($i) {
                return $i->product_name . " (" . $i->bottle_size . ")";
            })->implode(', ');

            return [
                'id' => '#' . $o->invoice_number,
                'cust' => $o->customer_name,
                'prod' => !empty($prodNames) ? $prodNames : 'Parfum Formulasi AI',
                'total' => 'Rp ' . number_format($o->total_amount, 0, ',', '.'),
                'status' => $o->order_status,
            ];
        });

        // Grafik Penjualan 7 Hari Terakhir
        $salesChartData = [];
        $salesChartLabels = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $salesChartLabels[] = $date->translatedFormat('d M');
            $dailySum = \App\Models\Order::whereDate('created_at', $date->toDateString())
                ->where('payment_status', 'Terverifikasi')
                ->sum('total_amount');
            $salesChartData[] = round($dailySum / 1000); // dalam ribuan (rb)
        }

        // Aktivitas Chatbot Terkini dari Database
        $chatbotLogs = \App\Models\ChatbotLog::latest()->limit(5)->get()->map(function($l) {
            return [
                'name' => $l->user_name,
                'msg' => $l->message,
                'reply' => $l->reply,
                'source' => $l->source,
                'time' => $l->created_at->format('H:i'),
                'date' => $l->created_at->format('d M'),
            ];
        });

        return Inertia::render('Admin/Dashboard', [
            'kpi' => [
                'totalSales' => 'Rp ' . number_format($totalSales, 0, ',', '.'),
                'totalOrders' => $totalOrders,
                'totalCustomers' => $totalCustomers,
                'conversionRate' => $conversionRate . '%',
            ],
            'recentOrders' => $recentOrders,
            'totalOrderCount' => \App\Models\Order::count(),
            'salesChart' => [
                'data' => $salesChartData,
                'labels' => $salesChartLabels,
            ],
            'chatbotLogs' => $chatbotLogs,
        ]);
    })->name('dashboard');

    Route::get('/produk', [ProductController::class, 'index'])->name('produk');
    Route::post('/produk', [ProductController::class, 'store'])->name('produk.store');
    Route::put('/produk/{product}', [ProductController::class, 'update'])->name('produk.update');
    Route::delete('/produk/{product}', [ProductController::class, 'destroy'])->name('produk.destroy');

    Route::get('/ukuran-botol', [BottleSizeController::class, 'index'])->name('ukuran-botol');
    Route::post('/ukuran-botol', [BottleSizeController::class, 'store'])->name('ukuran-botol.store');
    Route::put('/ukuran-botol/{bottleSize}', [BottleSizeController::class, 'update'])->name('ukuran-botol.update');
    Route::delete('/ukuran-botol/{bottleSize}', [BottleSizeController::class, 'destroy'])->name('ukuran-botol.destroy');

    Route::get('/pembelian', [OrderController::class, 'index'])->name('pembelian');
    Route::put('/pembelian/{order}/status', [OrderController::class, 'updateStatus'])->name('pembelian.status');
    Route::delete('/pembelian/{order}', [OrderController::class, 'destroy'])->name('pembelian.destroy');

    Route::get('/chatbot', function (Request $request) {
        $query = \App\Models\ChatbotLog::query();
        if ($request->has('search') && !empty($request->search)) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('user_name', 'like', "%{$s}%")
                  ->orWhere('message', 'like', "%{$s}%")
                  ->orWhere('reply', 'like', "%{$s}%");
            });
        }
        if ($request->has('source') && !empty($request->source)) {
            $query->where('source', $request->source);
        }

        $logs = $query->latest()->get()->map(function($l) {
            return [
                'id' => $l->id,
                'name' => $l->user_name,
                'message' => $l->message,
                'reply' => $l->reply,
                'source' => $l->source,
                'time' => $l->created_at->format('H:i'),
                'date' => $l->created_at->format('d M Y'),
                'created_at' => $l->created_at->toIso8601String(),
            ];
        });

        $totalLogs = \App\Models\ChatbotLog::count();
        $rasaLogsCount = \App\Models\ChatbotLog::where('source', 'rasa')->count();
        $fallbackCount = \App\Models\ChatbotLog::where('source', 'db_fallback')->count();
        $resolutionRate = $totalLogs > 0 ? round(($rasaLogsCount / $totalLogs) * 100, 1) : 100;

        // Topik Terbanyak / Kata Kunci Populer
        $keywords = ['tahan lama', 'kopi', 'manis', 'vanilla', 'pria', 'wanita', 'baccarat', 'segar', 'formal', 'kencan', 'lembut', 'buah'];
        $topKeywords = [];
        foreach ($keywords as $kw) {
            $cnt = \App\Models\ChatbotLog::where('message', 'like', '%' . $kw . '%')->count();
            if ($cnt > 0) {
                $topKeywords[$kw] = $cnt;
            }
        }
        arsort($topKeywords);
        $topKeywords = array_slice($topKeywords, 0, 6, true);

        return Inertia::render('Admin/Chatbot/Index', [
            'logs' => $logs,
            'stats' => [
                'totalLogs' => $totalLogs,
                'rasaCount' => $rasaLogsCount,
                'fallbackCount' => $fallbackCount,
                'resolutionRate' => $resolutionRate,
            ],
            'topKeywords' => $topKeywords,
            'filters' => [
                'search' => $request->search ?? '',
                'source' => $request->source ?? '',
            ]
        ]);
    })->name('chatbot');

    Route::delete('/chatbot/clear', function () {
        \App\Models\ChatbotLog::truncate();
        return redirect()->back()->with('success', 'Semua riwayat konsultasi chatbot berhasil dibersihkan.');
    })->name('chatbot.clear');

    Route::get('/chatbot/export-nlu', function () {
        $logs = \App\Models\ChatbotLog::select('message')->distinct()->get();
        
        $yamlContent = "# ==========================================\n";
        $yamlContent .= "# PARFUMERIE AI - AUTO-GENERATED NLU DATASET\n";
        $yamlContent .= "# Diekspor pada: " . now()->format('Y-m-d H:i:s') . "\n";
        $yamlContent .= "# ==========================================\n\n";
        $yamlContent .= "version: \"3.1\"\n\nnlu:\n  - intent: konsultasi_parfum_user_history\n    examples: |\n";
        
        foreach ($logs as $log) {
            $cleanMsg = trim(str_replace(["\r", "\n", '"', '#'], ' ', $log->message));
            if (!empty($cleanMsg)) {
                $yamlContent .= "      - " . $cleanMsg . "\n";
            }
        }

        return response($yamlContent, 200, [
            'Content-Type' => 'text/yaml',
            'Content-Disposition' => 'attachment; filename="nlu_user_history_' . date('Ymd_His') . '.yml"',
        ]);
    })->name('chatbot.export');

    Route::delete('/chatbot/{id}', function ($id) {
        \App\Models\ChatbotLog::destroy($id);
        return redirect()->back()->with('success', 'Log konsultasi berhasil dihapus.');
    })->name('chatbot.destroy');

    Route::get('/pengaturan', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('pengaturan');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
