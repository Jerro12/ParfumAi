<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Product;
use App\Models\CartItem;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Test checkout redirects immediately to WhatsApp.
     */
    public function test_checkout_redirects_immediately_to_whatsapp(): void
    {
        // 1. Dapatkan atau buat pengguna demo
        $user = User::where('role', 'user')->first() ?? User::factory()->create(['role' => 'user']);
        
        // 2. Dapatkan atau buat produk
        $product = Product::first() ?? Product::create([
            'name' => 'Test Perfume',
            'category' => 'Manis Floral',
            'gender' => 'Perempuan',
            'longevity' => '4-6 Jam',
            'price' => 50000,
            'image' => 'https://example.com/test.jpg',
            'description' => 'Test description'
        ]);

        // 3. Masukkan produk ke keranjang belanja pengguna
        CartItem::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'bottle_size' => '100 ml',
            'unit_price' => 50000,
            'quantity' => 2,
        ]);

        // 4. Kirim request POST checkout dengan metode pembayaran WhatsApp
        $response = $this->actingAs($user)
            ->post(route('checkout.process'), [
                'customer_name' => 'Budi Santoso',
                'customer_email' => 'budi@example.com',
                'customer_phone' => '08123456789',
                'delivery_type' => 'Kirim ke Alamat (Kurir / Ekspedisi)',
                'shipping_address' => 'Jl. Merdeka No. 45, Jakarta',
                'payment_method' => 'WhatsApp Payment Link (Bayar Langsung via Chat WhatsApp Admin)',
                'notes' => 'Test notes',
            ], [
                'X-Inertia' => 'true'
            ]);

        // 5. Assert bahwa Inertia meluncurkan respon lokasi eksternal (Inertia::location mengembalikan status 409)
        $response->assertStatus(409);
        
        // 6. Verifikasi header X-Inertia-Location mengarah ke WhatsApp API dengan nomor tujuan 6281952823254
        $location = $response->headers->get('X-Inertia-Location');
        $this->assertNotNull($location);
        $this->assertStringContainsString('https://api.whatsapp.com/send', $location);
        $this->assertStringContainsString('phone=6281952823254', $location);
        $this->assertStringContainsString('Budi+Santoso', $location);
        $this->assertStringContainsString('08123456789', $location);
        $this->assertStringContainsString('INV-', $location);
    }
}
