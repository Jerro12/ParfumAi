import os
import csv
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

def load_dataset_from_file() -> List[Dict[str, Any]]:
    """
    Membaca dataset langsung dari berkas Excel (.xlsx) atau CSV (.csv).
    Sesuai dengan format kolom berkas Excel skripsi:
    JENIS PARFUM | JENIS AROMA | JENIS KELAMIN | PENJUALAN | KETAHANAN | UKURAN | HARGA
    """
    dataset = []
    base_dir = os.path.dirname(__file__)
    excel_path = os.path.join(base_dir, '..', 'data', 'dataset_parfum.xlsx')
    csv_path = os.path.join(base_dir, '..', 'data', 'dataset_parfum.csv')

    # 1. Coba baca file Excel .xlsx atau .xls jika library pandas tersedia
    if os.path.exists(excel_path):
        try:
            import pandas as pd
            df = pd.read_excel(excel_path)
            for _, row in df.iterrows():
                dataset.append({
                    "name": str(row.get('JENIS PARFUM', '')),
                    "category": str(row.get('JENIS AROMA', '')),
                    "gender": str(row.get('JENIS KELAMIN', '')),
                    "longevity": str(row.get('KETAHANAN', '')),
                    "bestseller": 'BEST SELLER' in str(row.get('PENJUALAN', '')).upper(),
                    "price": str(row.get('HARGA', 'Rp 8.000 - Rp 50.000')),
                    "size": str(row.get('UKURAN', '10ml, 20ml, 35ml, 100ml')),
                })
            return dataset
        except Exception as e:
            print(f"Peringatan: Gagal membaca Excel dengan pandas ({e}). Beralih ke CSV...")

    # 2. Pembacaan CSV sebagai standar andal tanpa dependensi library eksternal
    if os.path.exists(csv_path):
        with open(csv_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                price_val = row.get('HARGA', '') if row.get('HARGA') else 'Rp 8.000 - Rp 50.000'
                size_val = row.get('UKURAN', '') if row.get('UKURAN') else '10ml, 20ml, 35ml, 100ml'
                dataset.append({
                    "name": row.get('JENIS PARFUM', ''),
                    "category": row.get('JENIS AROMA', ''),
                    "gender": row.get('JENIS KELAMIN', ''),
                    "longevity": row.get('KETAHANAN', ''),
                    "bestseller": 'BEST SELLER' in str(row.get('PENJUALAN', '')).upper(),
                    "price": price_val,
                    "size": size_val,
                })
    return dataset


def longevity_hours(longevity_str: str) -> int:
    """Ekstrak angka jam maksimum dari string ketahanan seperti '4-6 Jam' -> 6."""
    import re
    nums = re.findall(r'\d+', longevity_str)
    if nums:
        return max(int(n) for n in nums)
    return 0


class ActionRekomendasiParfum(Action):
    def name(self) -> Text:
        return "action_rekomendasi_parfum"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Membaca dataset dari file Excel / CSV
        perfumes = load_dataset_from_file()

        user_message = tracker.latest_message.get('text', '').lower()
        gender_slot = (tracker.get_slot('gender') or '').lower()
        aroma_slot = (tracker.get_slot('aroma') or '').lower()

        # ---------- Deteksi GENDER ----------
        is_female = any(kw in user_message for kw in [
            'wanita', 'cewek', 'perempuan', 'cewe', 'wanite', 'ladies', 'lady'
        ]) or gender_slot in ['wanita', 'cewek', 'perempuan']

        is_male = any(kw in user_message for kw in [
            'pria', 'cowok', 'laki', 'pria', 'men', 'gents', 'jantan', 'cowo'
        ]) or gender_slot in ['pria', 'cowok', 'laki-laki']

        # ---------- Deteksi PREFERENSI AROMA ----------
        is_bestseller = any(kw in user_message for kw in [
            'best seller', 'terlaris', 'favorit', 'laris', 'populer', 'hits', 'top', 'paling banyak'
        ])
        is_coffee = any(kw in user_message for kw in [
            'kopi', 'opium', 'cappuccino', 'coffee', 'espresso', 'mocha', 'coklat', 'chocolate'
        ])
        is_vanilla = any(kw in user_message for kw in [
            'vanilla', 'cake', 'kue', 'bakery', 'creamy', 'gourmand', 'dessert', 'karamel', 'caramel', 'sweet'
        ])
        is_woody = any(kw in user_message for kw in [
            'woody', 'kayu', 'scandal', 'dunhill', 'sandalwood', 'cendana', 'cedar', 'maskulin masculine', 'earthy'
        ])
        is_fresh = any(kw in user_message for kw in [
            'segar', 'fresh', 'aquatic', 'clean', 'ringan', 'airy', 'citrus', 'jeruk', 'lemon', 'sporty', 'dingin', 'cool'
        ])
        is_floral = any(kw in user_message for kw in [
            'bunga', 'floral', 'rose', 'mawar', 'jasmine', 'melati', 'lily', 'flower', 'powdery', 'feminim'
        ])
        is_manis = any(kw in user_message for kw in [
            'manis', 'sweet', 'fruity', 'buah', 'fruit', 'lembut', 'girly'
        ])
        is_spicy = any(kw in user_message for kw in [
            'spicy', 'rempah', 'pedas', 'warm', 'hangat', 'elegan'
        ])

        # ---------- Deteksi KETAHANAN ----------
        is_longlasting = any(kw in user_message for kw in [
            'tahan lama', '8 jam', '10 jam', '12 jam', 'awet', 'seharian', 'lama', 'long lasting',
            'sauvage', 'baccarat', 'tidak cepat', 'gak cepat'
        ])
        is_short = any(kw in user_message for kw in [
            'ringan', 'tidak kuat', 'tidak pekat', 'tidak menyengat', 'soft'
        ])

        # ---------- Filter Dataset ----------
        results = []
        for p in perfumes:
            if not p.get('name'):
                continue
            match = True
            cat_lower = p['category'].lower()
            name_lower = p['name'].lower()
            gender_lower = p['gender'].lower()

            if is_female and gender_lower != 'perempuan':
                match = False
            if is_male and gender_lower != 'laki-laki':
                match = False
            if is_bestseller and not p['bestseller']:
                match = False

            # Filter aroma berdasarkan kategori dan nama produk
            if is_coffee and not any(kw in cat_lower or kw in name_lower for kw in ['kopi', 'cappuccino', 'coffee']):
                match = False
            if is_woody and 'woody' not in cat_lower:
                match = False
            if is_fresh and not any(kw in cat_lower for kw in ['fresh', 'aquatic', 'sporty', 'cold']):
                match = False
            if is_floral and not any(kw in cat_lower for kw in ['floral', 'flower', 'rose', 'soft']):
                match = False
            if is_vanilla and not any(kw in cat_lower or kw in name_lower for kw in ['vanilla', 'manis', 'sweet', 'creamy', 'cake']):
                match = False
            if is_spicy and 'spicy' not in cat_lower:
                match = False

            # Filter ketahanan
            if is_longlasting and longevity_hours(p['longevity']) < 7:
                match = False
            if is_short and longevity_hours(p['longevity']) > 7:
                match = False

            if match:
                results.append(p)

        # Jika hasil filter spesifik kosong, relax filter (hilangkan filter aroma)
        if not results:
            results_relaxed = []
            for p in perfumes:
                if not p.get('name'):
                    continue
                match = True
                gender_lower = p['gender'].lower()
                if is_female and gender_lower != 'perempuan':
                    match = False
                if is_male and gender_lower != 'laki-laki':
                    match = False
                if is_bestseller and not p['bestseller']:
                    match = False
                if match:
                    results_relaxed.append(p)
            results = results_relaxed

        # Fallback ke best seller, lalu semua produk
        if not results:
            results = [p for p in perfumes if p.get('bestseller')]
        if not results and perfumes:
            results = [p for p in perfumes if p.get('name')][:4]

        # ---------- Susun Header Balasan ----------
        if is_female and is_bestseller:
            header = "✨ **[Dataset] Berikut adalah koleksi Parfum Wanita Terlaris (Best Seller):**\n\n"
        elif is_male and is_longlasting:
            header = "👑 **[Dataset] Parfum Pria dengan Ketahanan Ekstrem (8-12 Jam):**\n\n"
        elif is_coffee:
            header = "☕ **[Dataset] Pilihan Aroma Adiktif Kopi & Vanilla:**\n\n"
        elif is_woody:
            header = "🌲 **[Dataset] Koleksi Keharuman Woody Elegan & Musky:**\n\n"
        elif is_vanilla and not is_coffee:
            header = "🍰 **[Dataset] Koleksi Keharuman Manis & Vanilla (Gourmand):**\n\n"
        elif is_fresh:
            header = "💧 **[Dataset] Koleksi Parfum Fresh & Segar:**\n\n"
        elif is_floral:
            header = "🌸 **[Dataset] Koleksi Parfum Floral & Bunga-Bungaan:**\n\n"
        elif is_female and is_bestseller:
            header = "🌸 **[Dataset] Rekomendasi Parfum Wanita Terlaris:**\n\n"
        elif is_female:
            header = "🌸 **[Dataset] Rekomendasi khusus Parfum Wanita:**\n\n"
        elif is_male:
            header = "🎩 **[Dataset] Pilihan eksklusif Parfum Pria:**\n\n"
        elif is_bestseller:
            header = "⭐ **[Dataset] Koleksi Parfum Best Seller Terpopuler:**\n\n"
        elif is_longlasting:
            header = "⏱️ **[Dataset] Parfum dengan Daya Tahan Terlama:**\n\n"
        else:
            header = "🌟 **[Dataset] Rekomendasi Wewangian Parfumerie AI (36 Varian):**\n\n"

        # ---------- Susun Body Balasan ----------
        # Urutkan: best seller duluan, lalu berdasarkan ketahanan terlama
        results_sorted = sorted(results, key=lambda p: (
            -int(p['bestseller']),
            -longevity_hours(p['longevity'])
        ))

        body = ""
        for idx, item in enumerate(results_sorted[:5], 1):
            star = "⭐ Best Seller!" if item['bestseller'] else "✦ Regular"
            body += f"{idx}. **{item['name']}** ({item['gender']})\n"
            body += f"   • Kategori Aroma: {item['category']} ({star})\n"
            body += f"   • Daya Tahan: {item['longevity']}\n"
            body += f"   • 💰 10ml=Rp 8.000 | 20ml=Rp 13.000 | 35ml=Rp 25.000 | 100ml=Rp 50.000\n\n"

        footer = "💡 **Info Sommelier**: Semua parfum tersedia dalam 4 pilihan botol (10ml/20ml/35ml/100ml). Kunjungi menu **Katalog** untuk langsung memesan!"

        dispatcher.utter_message(text=header + body + footer)

        return []
