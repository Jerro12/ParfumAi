<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Menampilkan daftar semua produk di Dasbor Admin.
     */
    public function index()
    {
        $products = Product::latest()->get();
        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    /**
     * Menyimpan produk baru ke basis data.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'gender' => 'required|string|max:50',
            'longevity' => 'required|string|max:50',
            'is_bestseller' => 'boolean',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string|max:1000',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'description' => 'nullable|string',
            'ai_verdict' => 'nullable|string',
        ]);

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            $destPath = public_path('images/products');
            if (!file_exists($destPath)) {
                mkdir($destPath, 0755, true);
            }
            
            $file->move($destPath, $filename);
            $validated['image'] = '/images/products/' . $filename;
        }

        if (empty($validated['image'])) {
            $validated['image'] = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop';
        }

        unset($validated['image_file']);

        Product::create($validated);

        return redirect()->route('admin.produk')->with('success', 'Produk parfum baru berhasil ditambahkan.');
    }

    /**
     * Memperbarui data produk yang ada.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'gender' => 'required|string|max:50',
            'longevity' => 'required|string|max:50',
            'is_bestseller' => 'boolean',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string|max:1000',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'description' => 'nullable|string',
            'ai_verdict' => 'nullable|string',
        ]);

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            $destPath = public_path('images/products');
            if (!file_exists($destPath)) {
                mkdir($destPath, 0755, true);
            }
            
            $file->move($destPath, $filename);
            $validated['image'] = '/images/products/' . $filename;
        }

        unset($validated['image_file']);

        $product->update($validated);

        return redirect()->route('admin.produk')->with('success', 'Data produk parfum berhasil diperbarui.');
    }

    /**
     * Menghapus produk dari basis data.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.produk')->with('success', 'Produk parfum berhasil dihapus.');
    }
}
