import os
import sys
import json
from typing import Dict, Any

# Ensure UTF-8 output on Windows terminal
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Add actions directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), 'actions'))
from actions.actions import ActionRekomendasiParfum, load_dataset_from_file

class DummyTracker:
    def __init__(self, text: str, slots: Dict[str, Any] = None):
        self.latest_message = {'text': text}
        self.slots = slots or {}

    def get_slot(self, slot_name: str):
        return self.slots.get(slot_name)

class DummyDispatcher:
    def __init__(self):
        self.messages = []

    def utter_message(self, text: str = None, **kwargs):
        if text:
            self.messages.append(text)

# 20 Test Questions covering varied phrasing (dibolak-balik)
TEST_QUESTIONS = [
    {
        "id": 1,
        "question": "rekomendasi parfum terlaris",
        "expected_kw": ["Best Seller"],
        "category": "Best Seller Umum"
    },
    {
        "id": 2,
        "question": "parfum best seller untuk wanita apa saja",
        "expected_kw": ["Perempuan", "Best Seller"],
        "category": "Best Seller Wanita"
    },
    {
        "id": 3,
        "question": "rekomendasi parfum yang kurang laris",
        "expected_kw": ["Kurang Laris", "Aqua Kiss", "Candy Love"],
        "category": "Kurang Laris Umum"
    },
    {
        "id": 4,
        "question": "parfum cewek yang kurang diminati apa aja",
        "expected_kw": ["Kurang Laris", "Aqua Kiss", "Candy Love"],
        "category": "Kurang Laris Wanita"
    },
    {
        "id": 5,
        "question": "parfum mana yang sepi pembeli",
        "expected_kw": ["Kurang Laris"],
        "category": "Kurang Laris / Sepi"
    },
    {
        "id": 6,
        "question": "apa kebalikannya parfum terlaris",
        "expected_kw": ["Kurang Laris"],
        "category": "Kebalikan Terlaris"
    },
    {
        "id": 7,
        "question": "cari parfum cewek yang aromanya manis",
        "expected_kw": ["Perempuan", "Manis"],
        "category": "Aroma Manis Wanita"
    },
    {
        "id": 8,
        "question": "parfum cowok yang tahan lama",
        "expected_kw": ["Laki-laki"],
        "category": "Pria Tahan Lama"
    },
    {
        "id": 9,
        "question": "parfum yang wanginya seperti kopi",
        "expected_kw": ["Kopi", "Black Opium"],
        "category": "Aroma Kopi"
    },
    {
        "id": 10,
        "question": "ada parfum aroma kue vanilla?",
        "expected_kw": ["Vanilla", "Vanilla Cake"],
        "category": "Aroma Vanilla"
    },
    {
        "id": 11,
        "question": "rekomendasi parfum floral mawar",
        "expected_kw": ["Floral"],
        "category": "Aroma Floral"
    },
    {
        "id": 12,
        "question": "parfum fresh segar untuk outdoor",
        "expected_kw": ["Fresh"],
        "category": "Aroma Fresh"
    },
    {
        "id": 13,
        "question": "parfum woody maskulin untuk pria",
        "expected_kw": ["Woody", "Laki-laki"],
        "category": "Woody Maskulin"
    },
    {
        "id": 14,
        "question": "parfum untuk kencan romantis malam hari",
        "expected_kw": ["Romantis"],
        "category": "Romantis"
    },
    {
        "id": 15,
        "question": "parfum yang cocok untuk kerja di kantor",
        "expected_kw": ["Jam"],
        "category": "Kantor / Formal"
    },
    {
        "id": 16,
        "question": "baccarat dubai tahan berapa lama",
        "expected_kw": ["Baccarat Dubai"],
        "category": "Spesifik Produk"
    },
    {
        "id": 17,
        "question": "apa kebalikan dari parfum terlaris di toko ini",
        "expected_kw": ["Kurang Laris"],
        "category": "Variasi Kebalikan Best Seller"
    },
    {
        "id": 18,
        "question": "parfum perempuan yang paling kurang laku",
        "expected_kw": ["Kurang Laris", "Perempuan"],
        "category": "Variasi Kurang Laku Wanita"
    },
    {
        "id": 19,
        "question": "parfum laki-laki yang best seller",
        "expected_kw": ["Laki-laki", "Best Seller"],
        "category": "Best Seller Pria"
    },
    {
        "id": 20,
        "question": "rekomendasi parfum tidak laris",
        "expected_kw": ["Kurang Laris"],
        "category": "Variasi Tidak Laris"
    }
]

def run_accuracy_test():
    action = ActionRekomendasiParfum()
    dataset = load_dataset_from_file()
    print("=== UJI AKURASI 20 PERTANYAAN VARIATIF (DIBOLAK-BALIK) ===")
    print(f"Total Dataset Parfum: {len(dataset)} varian\n")

    correct = 0
    total = len(TEST_QUESTIONS)

    results_summary = []

    for item in TEST_QUESTIONS:
        tracker = DummyTracker(item["question"])
        dispatcher = DummyDispatcher()
        action.run(dispatcher, tracker, {})

        response = dispatcher.messages[0] if dispatcher.messages else ""
        passed = all(kw.lower() in response.lower() for kw in item["expected_kw"])

        if passed:
            correct += 1
            status = "PASS"
        else:
            status = "FAIL"

        results_summary.append({
            "id": item["id"],
            "category": item["category"],
            "question": item["question"],
            "status": status,
            "matched_keywords": item["expected_kw"]
        })

        print(f"[{status}] Q{item['id']} ({item['category']}): \"{item['question']}\"")
        if not passed:
            print(f"    Expected Keywords: {item['expected_kw']}")
            print(f"    Actual Response:\n{response[:200]}...\n")

    accuracy = (correct / total) * 100
    print("\n==========================================")
    print(f"HASIL AKURASI: {correct}/{total} PERTANYAAN TERJAWAB DENGAN AKURAT ({accuracy:.1f}%)")
    print("==========================================")

    # Save summary to JSON for record
    summary_file = os.path.join(os.path.dirname(__file__), 'test_accuracy_results.json')
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump({
            "total_questions": total,
            "passed": correct,
            "accuracy_percent": accuracy,
            "details": results_summary
        }, f, indent=2)

    return accuracy

if __name__ == '__main__':
    run_accuracy_test()
