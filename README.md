# ✧ Parfumerie AI — Wewangian Mewah dengan Kecerdasan Buatan

<!-- ![Parfumerie AI Banner](https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=1600&auto=format&fit=crop) -->

**Parfumerie AI** adalah platform rekomendasi parfum eksklusif dan e-commerce mewah yang memanfaatkan asisten kecerdasan buatan (*AI Scent Sommelier*) untuk membantu pelanggan menemukan identitas aroma (*signature scent*) yang paling mencerminkan kepribadian, gaya hidup, dan memori mereka.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

Aplikasi ini dibangun menggunakan arsitektur **Monolitik Modern SPA (Single Page Application)** yang menggabungkan keandalan backend PHP dengan kecepatan antarmuka React.

### **Backend**
* **Laravel 11**: Kerangka kerja PHP tangguh untuk perutean, autentikasi, manajemen sesi, dan logika bisnis.
* **MySQL / SQLite**: Sistem manajemen basis data relasional yang dikelola melalui Eloquent ORM & Migrasi skema.
* **Inertia.js Server**: Penghubung (*bridge*) yang memungkinkan pembuatan aplikasi React berskala penuh tanpa memerlukan pembuatan REST API terpisah.

### **Frontend & Desain**
* **React 18**: Pustaka JavaScript untuk membangun komponen UI interaktif dan reaktif.
* **Inertia.js Client**: Pengelola navigasi sisi klien (*client-side routing*) dengan transisi halaman secepat kilat.
* **Vite**: Pemaket aset (*bundler*) generasi baru dengan fitur *Hot Module Replacement* (HMR) instan.
* **Tailwind CSS v3**: Pustaka CSS utilitas yang dikonfigurasi secara khusus dengan variabel warna **OKLCH** mewah (*Cream*, *Terracotta*, *Gold*, *Forest*).
* **Lucide React**: Koleksi ikon minimalis dan modern untuk Dasbor Admin dan antarmuka pengguna.
* **Google Fonts**: Menggunakan kombinasi tipografi elegan **Cormorant Garamond** (Serif) dan **Inter** (Sans).

---

## 🚀 Panduan Instalasi & Menjalankan Proyek (How to Install)

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di lingkungan pengembangan lokal (misalnya menggunakan **Laragon** di Windows atau sistem sejenis):

### **1. Persyaratan Sistem (Prerequisites)**
* **PHP** (v8.2 atau lebih baru)
* **Composer** (v2.x)
* **Node.js** (v18.x atau v20.x) & **NPM**
* **MySQL / MariaDB** (Tersedia dalam bundel Laragon)

### **2. Kloning & Pengaturan Awal**
Buka terminal di dalam direktori server web lokal Anda (`d:\laragon\www\` atau `htdocs`), lalu jalankan:

```bash
# 1. Klon repositori (jika dari git) atau navigasi ke folder proyek
cd ParfumAi

# 2. Instalasi dependensi PHP (Laravel)
composer install

# 3. Instalasi dependensi JavaScript (React, Inertia, Lucide)
npm install
```

### **3. Konfigurasi Lingkungan (.env)**
Salin berkas konfigurasi contoh dan buat kunci enkripsi aplikasi:
```bash
cp .env.example .env
php artisan key:generate
```
Buka berkas `.env` dan pastikan pengaturan basis data telah sesuai dengan server MySQL lokal Anda:
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=parfum
DB_USERNAME=root
DB_PASSWORD=
```
*Catatan: Pastikan Anda telah membuat basis data kosong bernama `parfum` di MySQL (lewat phpMyAdmin / HeidiSQL / Laragon).*

### **4. Migrasi & Pengisian Basis Data (Seeder)**
Jalankan migrasi skema tabel (termasuk tabel `sessions`, `users` dengan kolom `role`, dll.) dan isi dengan data pengguna demo:
```bash
php artisan migrate:fresh --seed
```

#### **Akun Demo Terdaftar:**
* 👑 **Akun Administrator**
  * **Email**: `admin@parfum.ai`
  * **Password**: `password`
  * **Akses**: Otomatis dialihkan ke *Control Tower* di `http://127.0.0.1:8000/admin/dashboard`
* 👤 **Akun Pengguna Biasa (Customer)**
  * **Email**: `user@parfum.ai`
  * **Password**: `password`
  * **Akses**: Dasbor pelanggan reguler di `http://127.0.0.1:8000/dashboard`

### **5. Menjalankan Server Pengembangan**
Untuk menjalankan aplikasi, Anda memerlukan **2 terminal terpisah**:

**Terminal 1 (Server Frontend Vite):**
```bash
npm run dev
```
*(Biarkan terminal ini tetap menyala agar kompilasi aset React dan Tailwind berjalan otomatis saat ada perubahan).*

**Terminal 2 (Server Backend Laravel):**
Jika menggunakan Laragon dengan fitur *Virtual Host*, Anda bisa langsung membuka browser ke alamat `http://parfumai.test`. Atau, gunakan *Artisan server*:
```bash
php artisan serve
```
Akses aplikasi melalui peramban web di: **`http://127.0.0.1:8000`**

---

## ⚖️ Kelebihan dan Kekurangan Sistem (Pros & Cons)

### **✨ Kelebihan (Kekuatan & Keunggulan)**
1. **Pengalaman Pengguna (UX) Mulus Secepat SPA**: Transisi antar halaman terasa sangat instan tanpa memuat ulang peramban (*no full-page reloads*) berkat integrasi **Inertia.js** dan antarmuka **React**.
2. **Efisiensi Pengembangan Monolitik**: Pengembang tidak perlu merancang dan mengamankan REST API / JWT terpisah karena data langsung dikirim dari *controller* Laravel ke *props* React secara aman dan terenkripsi melalui mekanisme autentikasi bawaan Laravel.
3. **Desain Visual Kelas Atas & Elegan**: Menggunakan skema warna premium berbasis standar **OKLCH** (*Gold*, *Forest*, *Terracotta*, *Cream*) yang menghasilkan palet warna harmonis dan mewah di semua jenis layar.
4. **Interaktivitas Asisten AI**: Hadir dengan *Chatbot Widget Scent Sommelier* yang reaktif dengan efek animasi mengetik, memberikan simulasi rekomendasi parfum yang disesuaikan dengan suasana atau acara pengguna.
5. **Keamanan & Manajemen Peran Kuat**: Menggunakan proteksi *middleware* `role:admin` serta pengalihan (*redirect*) cerdas otomatis untuk memastikan bahwa Admin dan Pengguna tidak saling memasuki ruang kerja yang salah.

### **⚠️ Kekurangan (Area untuk Peningkatan)**
1. **Keterikatan Server Backend**: Karena menggunakan Inertia.js, antarmuka React terikat erat dengan server Laravel. Frontend tidak dapat di-host secara terpisah di platform statis murni seperti AWS S3, Cloudflare Pages, atau Vercel (harus dijalankan pada server VPS / Cloud yang mendukung PHP).
2. **Simulasi Logika AI**: Chatbot saat ini menggunakan logika kecerdasan olfaktori berbasis pencocokan pola kata kunci internal (*keyword matching*). Untuk kueri bahasa alami yang sangat kompleks atau tak terduga, sistem perlu dihubungkan dengan API eksternal berbayar (seperti OpenAI GPT-4 atau Anthropic Claude).
3. **Beban Penyimpanan Sesi Basis Data**: Pengaturan `.env` menggunakan `SESSION_DRIVER=database` untuk melacak aktivitas pengguna secara presisi di Dasbor Admin. Pada skala ratusan ribu pengguna aktif bersamaan (*concurrent users*), tabel `sessions` perlu dibersihkan secara berkala (*pruning*) atau dialihkan ke penyimpanan memori seperti Redis.
