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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category');
            $table->decimal('price', 15, 2);
            $table->text('image')->nullable();
            $table->text('description')->nullable();
            $table->string('gender')->default('Unisex'); // Perempuan, Laki-laki, Unisex
            $table->string('longevity')->default('4-6 Jam'); // Ketahanan aroma
            $table->boolean('is_bestseller')->default(false);
            $table->text('ai_verdict')->nullable();
            $table->decimal('rating', 3, 1)->default(5.0);
            $table->integer('reviews_count')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
