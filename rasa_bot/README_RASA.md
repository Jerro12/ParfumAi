# 🤖 Dokumentasi Integrasi Rasa Framework — Skripsi Parfumerie AI

Direktori `rasa_bot/` ini berisi keseluruhan berkas konfigurasi, data latih NLP, dan *Action Server* berbasis **Rasa Open Source Framework** yang bertindak sebagai otak di balik kecerdasan buatan (*AI Scent Sommelier*) pada aplikasi e-commerce wewangian ini.

---

## 📁 Struktur Direktori & Fungsi Berkas

```
rasa_bot/
├── config.yml           # Pengaturan pipeline NLP (WhitespaceTokenizer, DIETClassifier, TEDPolicy) untuk pengenalan Bahasa Indonesia.
├── domain.yml           # Kamus domain bot yang mendefinisikan Intent, Entitas, Slot, dan Respon Utterance.
├── endpoints.yml        # Penghubung antara Rasa Core dengan Custom Action Server (port 5055).
├── data/
│   ├── nlu.yml          # Dataset latih NLU berisi contoh kalimat kueri pengguna (cari parfum wanita, pria tahan lama, kopi, dll).
│   ├── rules.yml        # Aturan statis alur percakapan (greeting, goodbye, pemanggilan aksi rekomendasi).
│   └── stories.yml      # Skenario cerita dialog interaktif untuk melatih model pembelajaran mesin.
└── actions/
    ├── __init__.py
    └── actions.py       # Action Server Python yang memuat dataset 31 parfum skripsi dan logika penyaringan dinamis.
```

---

## 🚀 Panduan Instalasi & Eksekusi untuk Sidang Skripsi

Untuk menjalankan *chatbot* Rasa di komputer lokal Anda saat demonstrasi atau sidang skripsi, ikuti 4 langkah mudah berikut:

### 1. Persiapan Lingkungan Virtual Python
Pastikan Python (versi 3.8 - 3.10) telah terinstal. Buka terminal baru dan masuk ke direktori `rasa_bot`:
```bash
cd d:\laragon\www\ParfumAi\rasa_bot
python -m venv venv39
```
Aktifkan *virtual environment*:
- **Windows (Command Prompt / PowerShell)**:
  ```bash
  .\venv39\Scripts\activate
  ```
- **Linux / macOS**:
  ```bash
  source venv39/bin/activate
  ```

### 2. Instalasi Dependensi Rasa
Instal paket Rasa dan Rasa SDK:
```bash
pip install rasa rasa-sdk
```

### 3. Melatih Model NLP (*Training*)
Jalankan perintah berikut untuk melatih model pembelajaran mesin berdasarkan data NLU dan cerita yang telah disediakan:
```bash
rasa train
```
Setelah proses selesai, berkas model baru (`.tar.gz`) akan otomatis tersimpan di dalam folder `models/`.

### 4. Menjalankan Layanan Bot (2 Terminal Python Terpisah)

#### Terminal Python A: Menjalankan Rasa Custom Action Server
Terminal ini menjalankan skrip `actions.py` pada port `5055`:
```bash
rasa run actions --port 5055
```

#### Terminal Python B: Menjalankan Layanan Rasa REST Webhook
Terminal ini membuka akses API REST Rasa pada port `5005` agar dapat menerima pesan dari backend Laravel:
```bash
rasa run --enable-api --cors "*" --port 5005
```

---

## 🔌 Skema Komunikasi Aplikasi Web dengan Rasa

Aplikasi Laravel dan React Anda dirancang dengan sistem **Pencegahan Kegagalan (*Fail-Safe Fallback*)**:

1. Ketika pengguna mengirim pesan di *widget chat*, Laravel akan mengirimkan permintaan HTTP POST ke endpoint Rasa REST: `http://localhost:5005/webhooks/rest/webhook`.
2. Jika server Rasa sedang aktif, bot akan menjawab dengan analisis NLU dari Rasa dan data rekomendasi dari `actions.py`.
3. **Fitur Pengaman (*Fallback*)**: Jika Anda belum menjalankan server Rasa lokal (misal saat sedang mengembangkan fitur web lain), backend Laravel akan secara otomatis mengambil alih dan menggunakan mesin pencocokan kata kunci internal berbasis basis data MySQL `products`. Aplikasi Anda dipastikan **tidak akan pernah rusak (*crash*)** di hadapan dosen penguji!
