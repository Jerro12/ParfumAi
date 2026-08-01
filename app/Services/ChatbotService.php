<?php

namespace App\Services;

use GuzzleHttp\Client;

class ChatbotService
{
    /**
     * Kata kunci POSITIF — jika ditemukan, pesan langsung diteruskan ke Rasa.
     */
    private const PARFUM_KEYWORDS = [
        // Kata inti parfum
        'parfum', 'wewangian', 'wangi', 'aroma', 'bau', 'fragrance', 'perfume',
        'scent', 'cologne', 'spray', 'botol', 'minyak wangi',
        // Jenis konsentrasi
        'edp', 'edt', 'edc', 'eau de parfum', 'eau de toilette', 'extrait',
        // Keluarga aroma
        'floral', 'woody', 'fresh', 'oriental', 'gourmand', 'aquatic', 'fougere',
        'citrus', 'musky', 'musk', 'amber', 'spicy', 'vanilla', 'oud', 'mawar',
        'jasmine', 'melati', 'rose', 'sandalwood', 'cendana', 'patchouli',
        // Nama produk koleksi
        'baccarat', 'sauvage', 'black opium', 'scandalouis', 'dunhill', 'nagita',
        'selena gomez', 'vanilla cake', 'vanilla ice', 'cappuccino', 'polo sports',
        'bvlgari', 'zara wonder', 'white rose', 'aqua kiss', 'blue channel',
        '212 men', 'baby love', 'avril rose', 'victoria secret', 'candy love',
        'incanto shine', 'chanel 05', 'christina night',
        // Istilah teknis parfum
        'notes', 'top notes', 'base notes', 'middle notes', 'heart notes',
        'longevity', 'ketahanan', 'sillage', 'proyeksi', 'piramida aroma',
        'sommelier', 'olfactory', 'olfaktori',
        // Kata aksi terkait parfum
        'semprotkan', 'semprot', 'pakai parfum', 'beli parfum', 'cari parfum',
        'rekomendasi parfum', 'rekomen', 'rekomendasikan',
        'tahan lama', 'awet', 'best seller', 'terlaris', 'kurang laris',
        'kurang diminati', 'kurang laku', 'sepi pembeli', 'tidak laris',
        'kebalikan', 'kebalikannya', 'tidak terlaris', 'tidak populer',
        // Salam & pertanyaan umum — tetap teruskan ke Rasa
        'halo', 'hai', 'hi', 'hello', 'hei', 'permisi', 'pagi', 'siang', 'malam',
        'bot', 'kamu siapa', 'chatbot', 'asisten', 'terima kasih', 'makasih',
        'bye', 'selamat tinggal',
    ];

    /**
     * Kata kunci NEGATIF — jika ditemukan dan tidak ada kata positif, tolak.
     */
    private const OFF_TOPIC_KEYWORDS = [
        // Fashion
        'sandal', 'sepatu', 'baju', 'celana', 'kemeja', 'kaos', 'jaket', 'dress',
        'tas', 'dompet', 'jam tangan', 'gelang', 'cincin', 'kalung',
        // Makanan & minuman
        'kue', 'resep', 'masak', 'nasi', 'mie', 'bakso', 'soto', 'rendang',
        'makanan', 'minuman', 'restoran', 'kafe', 'menu',
        // Otomotif
        'motor', 'mobil', 'ban', 'oli', 'bensin', 'kendaraan', 'otomotif',
        // Teknologi
        'laptop', 'komputer', 'android', 'iphone', 'gadget', 'handphone',
        // Hiburan
        'film', 'drakor', 'drama korea', 'anime', 'game', 'gaming',
        'lagu', 'musik', 'konser', 'artis', 'idol',
        // Berita & politik
        'berita', 'politik', 'presiden', 'menteri', 'pilkada', 'pemilu',
        // Cuaca & alam
        'cuaca', 'hujan', 'gempa', 'banjir',
        // Finansial
        'saham', 'investasi', 'crypto', 'bitcoin', 'deposito',
        'pinjaman', 'kredit', 'bank', 'atm', 'transfer',
        // Pariwisata
        'wisata', 'hotel', 'tiket pesawat', 'penginapan',
        // Kesehatan
        'obat', 'vitamin', 'dokter', 'rumah sakit', 'penyakit',
        // Hewan & tanaman
        'kucing', 'anjing', 'hewan', 'tanaman', 'pupuk',
        // Platform digital
        'youtube', 'instagram', 'tiktok', 'shopee', 'tokopedia', 'gojek', 'grab',
        // Pendidikan umum
        'sekolah', 'kuliah', 'kursus',
    ];

    /**
     * Pesan penolakan yang diputar secara acak agar tidak monoton.
     */
    private const REJECTION_REPLIES = [
        'Maaf, chatbot ini hanya membahas tentang parfum saja. 🌸',
        'Maaf, chatbot ini hanya membahas tentang parfum saja. Saya siap membantu Anda menemukan wewangian yang tepat! ✨',
        'Maaf, chatbot ini hanya membahas tentang parfum saja. Coba tanyakan seputar aroma, rekomendasi, atau tips wewangian! 🌹',
    ];

    /**
     * Cek apakah pesan berkaitan dengan parfum.
     * Prioritas: kata positif > kata negatif > ambigu (lolos ke Rasa).
     */
    public function isPerfumeRelated(string $text): bool
    {
        $text = mb_strtolower($text);

        foreach (self::PARFUM_KEYWORDS as $keyword) {
            if (str_contains($text, $keyword)) {
                return true;
            }
        }

        foreach (self::OFF_TOPIC_KEYWORDS as $keyword) {
            if (str_contains($text, $keyword)) {
                return false;
            }
        }

        // Pesan pendek / ambigu → loloskan ke Rasa untuk diproses NLU
        return true;
    }

    /**
     * Ambil pesan penolakan secara acak.
     */
    public function getRandomRejection(): string
    {
        return self::REJECTION_REPLIES[array_rand(self::REJECTION_REPLIES)];
    }

    /**
     * Kirim pesan ke Rasa NLU dan kembalikan teks balasan.
     * Mengembalikan null jika Rasa tidak merespons dengan benar.
     */
    public function sendToRasa(string $message, string $senderId): ?string
    {
        $client = new Client(['timeout' => 5.0]);

        $response = $client->post('http://127.0.0.1:5005/webhooks/rest/webhook', [
            'json' => [
                'sender'  => $senderId,
                'message' => $message,
            ],
        ]);

        $body = json_decode($response->getBody(), true);

        if (!empty($body) && isset($body[0]['text'])) {
            return collect($body)->pluck('text')->implode("\n\n");
        }

        return null;
    }
}
