<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique(); // Contoh: INV-20260518-0001
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->string('delivery_type')->default('Kirim ke Alamat (Kurir / Ekspedisi)'); // Kirim ke Alamat, Ambil di Toko
            $table->text('shipping_address')->nullable();
            $table->decimal('total_amount', 15, 2);
            $table->string('payment_method')->default('Transfer Bank (BCA/Mandiri)');
            $table->string('payment_status')->default('Menunggu Pembayaran'); // Menunggu Pembayaran, Terverifikasi, Gagal
            $table->string('order_status')->default('Menunggu Verifikasi'); // Menunggu Verifikasi, Diproses, Siap Diambil, Dikirim, Selesai, Dibatalkan
            $table->text('payment_proof')->nullable(); // Bukti transfer / pembayaran
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_name');
            $table->string('bottle_size'); // Contoh: '35 ml'
            $table->decimal('unit_price', 15, 2);
            $table->integer('quantity');
            $table->decimal('subtotal', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
