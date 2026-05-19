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

class ActionRekomendasiParfum(Action):
    def name(self) -> Text:
        return "action_rekomendasi_parfum"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Membaca 36 dataset dari file Excel / CSV
        perfumes = load_dataset_from_file()

        user_message = tracker.latest_message.get('text', '').lower()
        gender_slot = (tracker.get_slot('gender') or '').lower()
        aroma_slot = (tracker.get_slot('aroma') or '').lower()

        is_female = 'wanita' in user_message or 'cewek' in user_message or 'perempuan' in user_message or gender_slot in ['wanita', 'cewek', 'perempuan']
        is_male = 'pria' in user_message or 'cowok' in user_message or 'laki' in user_message or gender_slot in ['pria', 'cowok', 'laki']
        is_bestseller = 'best seller' in user_message or 'terlaris' in user_message or 'favorit' in user_message or 'laris' in user_message
        is_coffee = 'kopi' in user_message or 'opium' in user_message or 'cappuccino' in user_message
        is_vanilla = 'vanilla' in user_message or 'cake' in user_message or 'kue' in user_message or 'manis' in user_message
        is_woody = 'woody' in user_message or 'kayu' in user_message or 'scandal' in user_message or 'channel' in user_message
        is_longlasting = 'tahan lama' in user_message or '8 jam' in user_message or '12 jam' in user_message or 'awet' in user_message or 'sauvage' in user_message

        results = []

        for p in perfumes:
            match = True
            if is_female and p['gender'].lower() != 'perempuan':
                match = False
            if is_male and p['gender'].lower() != 'laki-laki':
                match = False
            if is_bestseller and not p['bestseller']:
                match = False
            if is_coffee and 'kopi' not in p['category'].lower() and 'cappuccino' not in p['name'].lower():
                match = False
            if is_vanilla and 'manis' not in p['category'].lower() and 'vanilla' not in p['category'].lower():
                match = False
            if is_woody and 'woody' not in p['category'].lower():
                match = False
            if is_longlasting and ('8' not in p['longevity'] and '10' not in p['longevity'] and '12' not in p['longevity']):
                match = False

            if match:
                results.append(p)

        # Jika hasil filter spesifik kosong, ambil produk terlaris
        if not results:
            results = [p for p in perfumes if p['bestseller']]
        if not results and perfumes:
            results = perfumes[:4]

        # Penentuan judul balasan
        if is_female and is_bestseller:
            header = "✨ [Dataset Excel/CSV] Berikut adalah koleksi **Parfum Wanita Terlaris (Best Seller)**:\n\n"
        elif is_male and is_longlasting:
            header = "👑 [Dataset Excel/CSV] Untuk pria yang mencari **Ketahanan Ekstrem (8-12 Jam)** (seperti Sauvage Louis & Baccarat):\n\n"
        elif is_coffee:
            header = "☕ [Dataset Excel/CSV] Pilihan teratas aroma adiktif **Kopi & Vanilla** (termasuk Black Opium & Cappuccino):\n\n"
        elif is_woody:
            header = "🌲 [Dataset Excel/CSV] Koleksi keharuman **Woody Elegan & Musky** (Scandalouis, DunhillBlue, Black Channel):\n\n"
        elif is_vanilla:
            header = "🍰 [Dataset Excel/CSV] Koleksi keharuman **Manis & Vanilla (Gourmand)**:\n\n"
        elif is_female:
            header = "🌸 [Dataset Excel/CSV] Rekomendasi khusus **Parfum Wanita** terunggul:\n\n"
        elif is_male:
            header = "🎩 [Dataset Excel/CSV] Pilihan eksklusif **Parfum Pria**:\n\n"
        else:
            header = "🌟 [Dataset Excel/CSV] Hasil pencarian wewangian dari berkas dataset (Total 36 Varian):\n\n"

        body = ""
        for idx, item in enumerate(results[:5], 1):
            star = "⭐ Best Seller!" if item['bestseller'] else "✦ Regular"
            body += f"{idx}. **{item['name']}** ({item['gender']})\n"
            body += f"   • Kategori Aroma: {item['category']} ({star})\n"
            body += f"   • Daya Tahan: {item['longevity']} | Ukuran Standar: 10ml, 20ml, 35ml, 100ml\n"
            body += f"   • Daftar Harga: Rp 8.000 (10ml) | Rp 13.000 (20ml) | Rp 25.000 (35ml) | Rp 50.000 (100ml)\n\n"

        footer = "💡 **Info Sommelier**: Seluruh 36 varian parfum di atas dapat dipesan dalam 4 pilihan botol resmi kami. Kunjungi menu **Katalog** untuk berbelanja!"

        dispatcher.utter_message(text=header + body + footer)

        return []
