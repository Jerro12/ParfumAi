<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Pengaturan', [
            'settings' => [
                // Hero (Welcome page)
                'hero_image'           => SiteSetting::get('hero_image'),
                'hero_label'           => SiteSetting::get('hero_label', 'AI Signature Blend'),
                'hero_title'           => SiteSetting::get('hero_title', "Velour d'Or #99"),
                'hero_badge'           => SiteSetting::get('hero_badge', 'Top 1% Pick'),
                // Tentang Kami page
                'tentang_kisah_image'  => SiteSetting::get('tentang_kisah_image'),
                'tentang_kisah_label'  => SiteSetting::get('tentang_kisah_label', 'Koleksi 36 Varian Pilihan'),
                'tentang_kisah_desc'   => SiteSetting::get('tentang_kisah_desc', 'Diformulasikan secara ketat berdasarkan dataset olfaktori teruji untuk menjamin ketahanan dan proyeksi aroma terbaik.'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'hero_image'          => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
            'hero_label'          => ['nullable', 'string', 'max:60'],
            'hero_title'          => ['nullable', 'string', 'max:80'],
            'hero_badge'          => ['nullable', 'string', 'max:40'],
            'tentang_kisah_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:3072'],
            'tentang_kisah_label' => ['nullable', 'string', 'max:80'],
            'tentang_kisah_desc'  => ['nullable', 'string', 'max:300'],
        ]);

        // --- Hero image ---
        if ($request->hasFile('hero_image')) {
            $path = $request->file('hero_image')->store('hero', 'public');
            SiteSetting::set('hero_image', '/storage/' . $path);
        }
        if ($request->filled('hero_label')) SiteSetting::set('hero_label', $request->hero_label);
        if ($request->filled('hero_title')) SiteSetting::set('hero_title', $request->hero_title);
        if ($request->filled('hero_badge')) SiteSetting::set('hero_badge', $request->hero_badge);

        // --- Tentang Kami: Kisah image ---
        if ($request->hasFile('tentang_kisah_image')) {
            $path = $request->file('tentang_kisah_image')->store('tentang', 'public');
            SiteSetting::set('tentang_kisah_image', '/storage/' . $path);
        }
        if ($request->filled('tentang_kisah_label')) SiteSetting::set('tentang_kisah_label', $request->tentang_kisah_label);
        if ($request->filled('tentang_kisah_desc'))  SiteSetting::set('tentang_kisah_desc',  $request->tentang_kisah_desc);

        return redirect()->back()->with('success', 'Pengaturan berhasil disimpan!');
    }

    public function resetHeroImage()
    {
        SiteSetting::where('key', 'hero_image')->delete();
        return redirect()->back()->with('success', 'Foto hero berhasil direset ke default.');
    }

    public function resetTentangKisah()
    {
        SiteSetting::where('key', 'tentang_kisah_image')->delete();
        return redirect()->back()->with('success', 'Foto kisah kami berhasil direset ke default.');
    }
}
