<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BottleSize;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BottleSizeController extends Controller
{
    /**
     * Menampilkan halaman pengelolaan ukuran botol dan harga.
     */
    public function index()
    {
        $bottleSizes = BottleSize::orderBy('default_price')->get();
        return Inertia::render('Admin/BottleSizes/Index', [
            'bottleSizes' => $bottleSizes
        ]);
    }

    /**
     * Menyimpan ukuran botol baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'size' => 'required|string|max:255|unique:bottle_sizes,size',
            'default_price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        BottleSize::create($validated);

        return redirect()->route('admin.ukuran-botol')->with('success', 'Ukuran botol dan harga baru berhasil ditambahkan.');
    }

    /**
     * Memperbarui ukuran botol dan harga.
     */
    public function update(Request $request, BottleSize $bottleSize)
    {
        $validated = $request->validate([
            'size' => 'required|string|max:255|unique:bottle_sizes,size,' . $bottleSize->id,
            'default_price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $bottleSize->update($validated);

        return redirect()->route('admin.ukuran-botol')->with('success', 'Ukuran dan harga botol berhasil diperbarui.');
    }

    /**
     * Menghapus ukuran botol.
     */
    public function destroy(BottleSize $bottleSize)
    {
        $bottleSize->delete();

        return redirect()->route('admin.ukuran-botol')->with('success', 'Ukuran botol berhasil dihapus.');
    }
}
