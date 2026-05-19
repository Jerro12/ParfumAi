<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\BottleSize;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\ChatbotLog;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Akun Admin & Akun User Utama (Kosong dari pesanan demo agar terlihat privat saat diuji)
        $admin = User::firstOrCreate(
            ['email' => 'admin@parfum.ai'],
            [
                'name' => 'Administrator AI',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        $user = User::firstOrCreate(
            ['email' => 'user@parfum.ai'],
            [
                'name' => 'Scent Enthusiast',
                'password' => Hash::make('password'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        // Akun Pelanggan Demo Terpisah untuk masing-masing pesanan simulasi
        $budi = User::firstOrCreate(
            ['email' => 'budi.santoso@gmail.com'],
            ['name' => 'Budi Santoso', 'password' => Hash::make('password'), 'role' => 'user', 'email_verified_at' => now()]
        );

        $siti = User::firstOrCreate(
            ['email' => 'siti.aminah@yahoo.com'],
            ['name' => 'Siti Aminah', 'password' => Hash::make('password'), 'role' => 'user', 'email_verified_at' => now()]
        );

        $reza = User::firstOrCreate(
            ['email' => 'reza.ahmad@outlook.com'],
            ['name' => 'Ahmad Reza', 'password' => Hash::make('password'), 'role' => 'user', 'email_verified_at' => now()]
        );

        // 2. Seeder Ukuran Botol & Harga Standar Dinamis
        $bottleSizes = [
            ['size' => '10 ml', 'default_price' => 8000, 'is_active' => true],
            ['size' => '20 ml', 'default_price' => 13000, 'is_active' => true],
            ['size' => '35 ml', 'default_price' => 25000, 'is_active' => true],
            ['size' => '100 ml', 'default_price' => 50000, 'is_active' => true],
        ];

        foreach ($bottleSizes as $bs) {
            BottleSize::firstOrCreate(['size' => $bs['size']], $bs);
        }

        // 3. Dataset Lengkap 36 Parfum Sesuai Berkas Excel Pengguna
        $perfumes = [
            [
                'name' => "Victoria Secret", 'category' => "Manis Floral", 'gender' => "Perempuan", 'longevity' => "3-5 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop",
                'description' => "Wewangian manis floral yang ceria dan feminim. Tersedia ukuran 10ml (Rp 8.000), 20ml (Rp 13.000), 35ml (Rp 25.000), 100ml (Rp 50.000).",
                'ai_verdict' => "Sangat direkomendasikan untuk aktivitas harian santai."
            ],
            [
                'name' => "Lovely Sarah", 'category' => "Floral Sweet", 'gender' => "Perempuan", 'longevity' => "4-6 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop",
                'description' => "Keharuman bunga yang lembut dan menenangkan. Tersedia 10ml - 100ml mulai Rp 8.000.",
                'ai_verdict' => "Cocok untuk suasana kerja di dalam ruangan ber-AC."
            ],
            [
                'name' => "Nagita Slavina", 'category' => "Manis Soft", 'gender' => "Perempuan", 'longevity' => "4-6 Jam", 'is_bestseller' => true,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop",
                'description' => "Aroma khas selebriti yang mewah, bersih, dan menenangkan. Pilihan terfavorit pelanggan setia kami.",
                'ai_verdict' => "Pilihan sempurna untuk menciptakan kesan bersih, elegan, dan ramah."
            ],
            [
                'name' => "Ariana Grande", 'category' => "Manis Creamy", 'gender' => "Perempuan", 'longevity' => "5-8 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
                'description' => "Sensasi manis marshmallow krim yang lezat dan menggoda.",
                'ai_verdict' => "Sangat disukai oleh usia muda untuk hangout dan pesta malam."
            ],
            [
                'name' => "Selena Gomez", 'category' => "Fruity Manis", 'gender' => "Perempuan", 'longevity' => "4-6 Jam", 'is_bestseller' => true,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
                'description' => "Ledakan buah-buahan tropis manis yang energik dan menawan. Best seller untuk aktivitas aktif.",
                'ai_verdict' => "Membangkitkan semangat dan rasa percaya diri instan saat disemprot."
            ],
            [
                'name' => "Zara Wonder Rose", 'category' => "Fruity Fresh", 'gender' => "Perempuan", 'longevity' => "5-7 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=800&auto=format&fit=crop",
                'description' => "Kesegaran buah beri merah yang dibalut keanggunan bunga mawar kontemporer.",
                'ai_verdict' => "Sangat cocok untuk kuliah atau pertemuan bisnis pagi hari."
            ],
            [
                'name' => "Bubble Gum", 'category' => "Manis", 'gender' => "Perempuan", 'longevity' => "3-5 Jam", 'is_bestseller' => false,
                'price' => 25000, 'image' => "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?q=80&w=800&auto=format&fit=crop",
                'description' => "Aroma permen karet manis yang mengingatkan pada keceriaan masa kecil yang manis.",
                'ai_verdict' => "Wangi santai untuk akhir pekan."
            ],
            [
                'name' => "Secret Wish", 'category' => "Fruity Manis", 'gender' => "Perempuan", 'longevity' => "4-6 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
                'description' => "Impian magis di dalam botol dengan kesegaran melon dan lemon yang memikat.",
                'ai_verdict' => "Membawa nuansa fantasi dan ketenangan pikiran."
            ],
            [
                'name' => "White Rose", 'category' => "Flower", 'gender' => "Perempuan", 'longevity' => "4-6 Jam", 'is_bestseller' => true,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop",
                'description' => "Kemurnian mawar putih suci yang memberikan ketenangan dan keanggunan tertinggi.",
                'ai_verdict' => "Pilihan tepat untuk acara sakral seperti pernikahan atau pertemuan resmi."
            ],
            [
                'name' => "Bvlgari Aqva", 'category' => "Fresh Cold", 'gender' => "Perempuan", 'longevity' => "5-8 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
                'description' => "Sensasi dingin air laut dalam yang menyegarkan jiwa di tengah hari yang panas.",
                'ai_verdict' => "Kesegaran premium yang membangkitkan vitalitas."
            ],
            [
                'name' => "Princess Syahrini", 'category' => "Glamor", 'gender' => "Perempuan", 'longevity' => "5-7 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
                'description' => "Keharuman ekstra glamor yang memancarkan aura kemewahan tak terbantahkan di setiap langkah.",
                'ai_verdict' => "Wangi karpet merah untuk menjadi pusat perhatian."
            ],
            [
                'name' => "Aqua Kiss", 'category' => "Fresh Aquatic", 'gender' => "Perempuan", 'longevity' => "3-5 Jam", 'is_bestseller' => false,
                'price' => 25000, 'image' => "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop",
                'description' => "Kecupan air hujan segar pada kelopak freesia di pagi hari yang sejuk.",
                'ai_verdict' => "Ringan dan menyegarkan sehabis berolahraga."
            ],
            [
                'name' => "Incanto Shine", 'category' => "Fruity Manis", 'gender' => "Perempuan", 'longevity' => "4-6 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop",
                'description' => "Kilau cahaya matahari musim panas yang dibalut aroma nanas dan markisa segar.",
                'ai_verdict' => "Penuh pesona keceriaan untuk kencan siang hari."
            ],
            [
                'name' => "Chanel 05", 'category' => "Floral Powdery", 'gender' => "Perempuan", 'longevity' => "6-10 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=800&auto=format&fit=crop",
                'description' => "Legenda klasik dunia parfum dengan karakteristik powdery mewah yang ikonik.",
                'ai_verdict' => "Mewakili status sosial tinggi dan selera klasik yang berkelas."
            ],
            [
                'name' => "Dearly Layfory", 'category' => "Soft Floral", 'gender' => "Perempuan", 'longevity' => "4-6 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?q=80&w=800&auto=format&fit=crop",
                'description' => "Kelembutan kelopak bunga sutra yang menyapa dengan ramah dan penuh cinta.",
                'ai_verdict' => "Wewangian intim yang menenangkan."
            ],
            [
                'name' => "Soft", 'category' => "Soft Powdery", 'gender' => "Perempuan", 'longevity' => "3-5 Jam", 'is_bestseller' => false,
                'price' => 25000, 'image' => "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
                'description' => "Keharuman bedak bayi yang bersih, lembut, dan menenangkan jiwa.",
                'ai_verdict' => "Wangi relaksasi di rumah saat istirahat."
            ],
            [
                'name' => "Agnes Monica", 'category' => "Fresh Sweet", 'gender' => "Perempuan", 'longevity' => "4-6 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop",
                'description' => "Aroma energik dan segar penuh gairah yang terinspirasi dari semangat juang tanpa henti.",
                'ai_verdict' => "Mendorong energi positif dan produktivitas."
            ],
            [
                'name' => "Vanilla Ice", 'category' => "Vanilla Creamy", 'gender' => "Perempuan", 'longevity' => "5-7 Jam", 'is_bestseller' => true,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
                'description' => "Kelezatan es krim vanila lembut yang dingin dan manis. Salah satu best seller utama.",
                'ai_verdict' => "Sangat disukai oleh pencinta wangi manis (*gourmand lover*)."
            ],
            [
                'name' => "Candy Bliss", 'category' => "Manis", 'gender' => "Perempuan", 'longevity' => "4-6 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
                'description' => "Sensasi manis permen kapas karamel yang membangkitkan kebahagiaan di setiap semprotan.",
                'ai_verdict' => "Wangi penuh senyuman untuk mencerahkan hari."
            ],
            [
                'name' => "Avril Rose", 'category' => "Soft", 'gender' => "Perempuan", 'longevity' => "4-6 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop",
                'description' => "Sentuhan lembut bunga mawar di pagi hari musim semi yang tenang.",
                'ai_verdict' => "Elegan, tidak menyengat, dan sangat bersahabat."
            ],
            [
                'name' => "Strawberry", 'category' => "Fruity", 'gender' => "Perempuan", 'longevity' => "3-5 Jam", 'is_bestseller' => false,
                'price' => 25000, 'image' => "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop",
                'description' => "Kesegaran manis buah stroberi matang yang langsung memikat sejak awal.",
                'ai_verdict' => "Ceria dan membangkitkan selera."
            ],
            [
                'name' => "Blue Channel", 'category' => "Fresh", 'gender' => "Perempuan", 'longevity' => "6-8 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=800&auto=format&fit=crop",
                'description' => "Kesegaran aromatik yang elegan dan tahan lama, memberikan kesan mandiri dan profesional.",
                'ai_verdict' => "Wangi segar berwibawa untuk pertemuan eksekutif."
            ],
            [
                'name' => "Secret Love", 'category' => "Sweet Romantic", 'gender' => "Perempuan", 'longevity' => "4-6 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?q=80&w=800&auto=format&fit=crop",
                'description' => "Bunga melati romantis yang dipadukan dengan kehangatan musk untuk memikat hati pasangan.",
                'ai_verdict' => "Sangat direkomendasikan untuk kencan romantis di malam hari."
            ],
            [
                'name' => "Vanilla Cake", 'category' => "Sweet Vanilla", 'gender' => "Perempuan", 'longevity' => "6-8 Jam", 'is_bestseller' => true,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
                'description' => "Aroma kue vanila hangat yang baru keluar dari oven. Sangat lezat dan menjadi salah satu best seller teratas.",
                'ai_verdict' => "Memberikan rasa nyaman, hangat, dan sangat disukai lingkungan sekitar."
            ],
            [
                'name' => "Baccarat Dubai", 'category' => "Luxury Manis", 'gender' => "Laki-laki", 'longevity' => "8-12 Jam", 'is_bestseller' => true,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
                'description' => "Mahakarya wangi mewah dengan daya tahan ekstrem 8-12 jam. Jejak aroma karamel kayu yang luar biasa memikat.",
                'ai_verdict' => "Simbol kesuksesan, prestise, dan kemewahan sejati."
            ],
            [
                'name' => "Axe", 'category' => "Maskulin", 'gender' => "Laki-laki", 'longevity' => "3-5 Jam", 'is_bestseller' => false,
                'price' => 25000, 'image' => "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop",
                'description' => "Keharuman maskulin klasik yang segar dan tajam untuk menemani aktivitas fisik sehari-hari.",
                'ai_verdict' => "Sporty dan enerjik."
            ],
            [
                'name' => "212 Men", 'category' => "Fresh Spicy", 'gender' => "Laki-laki", 'longevity' => "5-8 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
                'description' => "Gaya urban modern kota New York dengan aroma rempah segar yang sangat maskulin.",
                'ai_verdict' => "Mencerminkan pria metropolis yang karismatik dan aktif."
            ],
            [
                'name' => "Black Opium", 'category' => "Kopi Manis", 'gender' => "Laki-laki", 'longevity' => "7-10 Jam", 'is_bestseller' => true,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop",
                'description' => "Kombinasi adiktif antara kopi hitam pekat dan manisnya vanila. Salah satu best seller pria paling dicari.",
                'ai_verdict' => "Sangat sensual, adiktif, dan meninggalkan jejak misterius di malam hari."
            ],
            [
                'name' => "Vanilla Sports", 'category' => "Sporty Fresh", 'gender' => "Laki-laki", 'longevity' => "5-7 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop",
                'description' => "Inovasi wangi olahraga yang menyandingkan kesegaran es mint dengan kelembutan kayu vanila.",
                'ai_verdict' => "Cocok untuk pria aktif yang ingin tetap wangi segar sehabis nge-gym."
            ],
            [
                'name' => "Kenzo", 'category' => "Fresh Calming", 'gender' => "Laki-laki", 'longevity' => "4-7 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=800&auto=format&fit=crop",
                'description' => "Ketenangan alami bambu Jepang dan desiran angin laut yang menyejukkan hati.",
                'ai_verdict' => "Mencerminkan kedamaian, ketenangan, dan kebijaksanaan."
            ],
            [
                'name' => "Raffi Ahmad", 'category' => "Fresh Woody", 'gender' => "Laki-laki", 'longevity' => "5-7 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
                'description' => "Aroma pria sukses yang dinamis, supel, dan penuh semangat juang tinggi sepanjang waktu.",
                'ai_verdict' => "Meningkatkan karisma sosial dan kemampuan bergaul (*networking*)."
            ],
            [
                'name' => "Sauvage Louis", 'category' => "Fresh Spicy", 'gender' => "Laki-laki", 'longevity' => "8-12 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
                'description' => "Ketajaman maskulin berkelas kerajaan dengan daya tahan ekstrem 8-12 Jam.",
                'ai_verdict' => "Menciptakan daya tarik yang sangat maskulin dan berwibawa."
            ],
            [
                'name' => "Cappuccino", 'category' => "Kopi Manis", 'gender' => "Laki-laki", 'longevity' => "5-7 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop",
                'description' => "Keharuman secangkir kapucino hangat yang baru diseduh di kafe premium.",
                'ai_verdict' => "Wangi santai untuk berkumpul di kedai kopi."
            ],
            [
                'name' => "Black Channel", 'category' => "Woody Elegan", 'gender' => "Laki-laki", 'longevity' => "6-9 Jam", 'is_bestseller' => false,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=800&auto=format&fit=crop",
                'description' => "Kombinasi kayu cendana dan cemara yang memancarkan pesona misterius dan elegan.",
                'ai_verdict' => "Pilihan utama eksekutif muda untuk acara makan malam resmi."
            ],
            [
                'name' => "Scandalouis", 'category' => "Woody Elegan", 'gender' => "Laki-laki", 'longevity' => "4-7 Jam", 'is_bestseller' => true,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
                'description' => "Skandal keharuman yang menggoda dengan paduan kayu karamel dan tonka bean. Salah satu Best Seller pria teratas.",
                'ai_verdict' => "Wangi penakluk hati yang membuat orang di sekitar selalu penasaran."
            ],
            [
                'name' => "DunhillBlue", 'category' => "Woody Musky", 'gender' => "Laki-laki", 'longevity' => "4-7 Jam", 'is_bestseller' => true,
                'price' => 50000, 'image' => "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
                'description' => "Kesegaran laut biru eksotis yang disempurnakan oleh kelembutan lotus dan kehangatan musk. Best seller maskulin yang menyegarkan.",
                'ai_verdict' => "Sangat disukai untuk kegiatan luar ruangan dan liburan musim panas."
            ]
        ];

        $createdProducts = [];
        foreach ($perfumes as $item) {
            $createdProducts[] = Product::firstOrCreate(['name' => $item['name']], $item);
        }

        // 4. Seeder Pesanan / Pembelian (Masing-masing pesanan ditugaskan ke akun terpisah)
        if (Order::count() === 0 && count($createdProducts) >= 3) {
            // Pesanan 1: Menunggu Pembayaran (Kirim via Kurir) -> Pemilik: budi.santoso@gmail.com
            $order1 = Order::create([
                'invoice_number' => 'INV-' . date('Ymd') . '-0001',
                'user_id' => $budi->id,
                'customer_name' => 'Budi Santoso',
                'customer_email' => 'budi.santoso@gmail.com',
                'customer_phone' => '081234567890',
                'delivery_type' => 'Kirim ke Alamat (Kurir / Ekspedisi)',
                'shipping_address' => 'Jl. Merdeka No. 45, Kebayoran Baru, Jakarta Selatan, 12110',
                'total_amount' => 100000,
                'payment_method' => 'Transfer Bank (BCA/Mandiri)',
                'payment_status' => 'Menunggu Pembayaran',
                'order_status' => 'Menunggu Verifikasi',
                'notes' => 'Tolong dibungkus kado yang rapi ya, untuk hadiah ulang tahun istri.',
                'created_at' => now()->subHours(5)
            ]);

            OrderItem::create([
                'order_id' => $order1->id,
                'product_id' => $createdProducts[0]->id, // Victoria Secret
                'product_name' => 'Victoria Secret',
                'bottle_size' => '100 ml',
                'unit_price' => 50000,
                'quantity' => 2,
                'subtotal' => 100000
            ]);

            // Pesanan 2: Ambil Langsung di Toko (In-Store Pickup / Cashier) -> Pemilik: siti.aminah@yahoo.com
            $order2 = Order::create([
                'invoice_number' => 'INV-' . date('Ymd') . '-0002',
                'user_id' => $siti->id,
                'customer_name' => 'Siti Aminah',
                'customer_email' => 'siti.aminah@yahoo.com',
                'customer_phone' => '085712345678',
                'delivery_type' => 'Ambil Langsung di Toko (In-Store Pickup / Cashier)',
                'shipping_address' => '🏪 Pengambilan Langsung di Butik Fisik Parfumerie (Customer akan datang ke toko)',
                'total_amount' => 75000,
                'payment_method' => 'Bayar Langsung di Kasir (Tunai / QRIS Store)',
                'payment_status' => 'Terverifikasi',
                'order_status' => 'Siap Diambil',
                'notes' => 'Saya akan ambil jam 4 sore nanti sepulang kantor.',
                'created_at' => now()->subDays(1)
            ]);

            OrderItem::create([
                'order_id' => $order2->id,
                'product_id' => $createdProducts[2]->id, // Nagita Slavina
                'product_name' => 'Nagita Slavina',
                'bottle_size' => '100 ml',
                'unit_price' => 50000,
                'quantity' => 1,
                'subtotal' => 50000
            ]);

            OrderItem::create([
                'order_id' => $order2->id,
                'product_id' => $createdProducts[6]->id, // Bubble Gum
                'product_name' => 'Bubble Gum',
                'bottle_size' => '35 ml',
                'unit_price' => 25000,
                'quantity' => 1,
                'subtotal' => 25000
            ]);

            // Pesanan 3: Selesai (Kirim via Kurir) -> Pemilik: reza.ahmad@outlook.com
            $order3 = Order::create([
                'invoice_number' => 'INV-' . date('Ymd') . '-0003',
                'user_id' => $reza->id,
                'customer_name' => 'Ahmad Reza',
                'customer_email' => 'reza.ahmad@outlook.com',
                'customer_phone' => '081398765432',
                'delivery_type' => 'Kirim ke Alamat (Kurir / Ekspedisi)',
                'shipping_address' => 'Apartemen Sudirman Tower A Lt. 14 Unit 4, Setiabudi, Jakarta Selatan',
                'total_amount' => 150000,
                'payment_method' => 'Transfer Bank (BCA/Mandiri)',
                'payment_status' => 'Terverifikasi',
                'order_status' => 'Selesai',
                'notes' => 'Wangi Baccarat Dubai & Black Opium sangat tahan lama, puas sekali!',
                'created_at' => now()->subDays(3)
            ]);

            OrderItem::create([
                'order_id' => $order3->id,
                'product_id' => $createdProducts[24]->id, // Baccarat Dubai
                'product_name' => 'Baccarat Dubai',
                'bottle_size' => '100 ml',
                'unit_price' => 50000,
                'quantity' => 2,
                'subtotal' => 100000
            ]);

            OrderItem::create([
                'order_id' => $order3->id,
                'product_id' => $createdProducts[27]->id, // Black Opium
                'product_name' => 'Black Opium',
                'bottle_size' => '100 ml',
                'unit_price' => 50000,
                'quantity' => 1,
                'subtotal' => 50000
            ]);
        }

        // 5. Seeder Log Aktivitas Chatbot
        if (ChatbotLog::count() === 0) {
            $logs = [
                ['user_name' => 'Siti Rahma', 'message' => 'Saya cari parfum yang aromanya tahan lama', 'reply' => 'Untuk ketahanan ekstrem (8-12 Jam), kami merekomendasikan Baccarat Dubai atau Sauvage Louis.', 'created_at' => now()->subMinutes(15)],
                ['user_name' => 'Andi Wijaya', 'message' => 'Parfum untuk acara formal yang elegan', 'reply' => 'Koleksi keharuman Woody Elegan seperti Black Channel dan Scandalouis adalah pilihan sempurna untuk acara formal.', 'created_at' => now()->subMinutes(35)],
                ['user_name' => 'Dewi Lestari', 'message' => 'Rekomendasi parfum bunga lembut dong', 'reply' => 'Kami memiliki Lovely Sarah dan White Rose dengan nuansa floral lembut yang menenangkan.', 'created_at' => now()->subMinutes(50)],
                ['user_name' => 'Ricky Pratama', 'message' => 'Parfum pria yang segar dan maskulin', 'reply' => 'Pilihan wewangian pria segar dan maskulin teratas kami adalah 212 Men dan DunhillBlue.', 'created_at' => now()->subHours(1)],
            ];

            foreach ($logs as $log) {
                ChatbotLog::create([
                    'session_id' => 'demo_sess_' . rand(1000, 9999),
                    'user_name' => $log['user_name'],
                    'message' => $log['message'],
                    'reply' => $log['reply'],
                    'source' => 'rasa',
                    'created_at' => $log['created_at'],
                    'updated_at' => $log['created_at'],
                ]);
            }
        }
    }
}

