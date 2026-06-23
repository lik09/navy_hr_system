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
        Schema::create('military_ranks', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('name_kh')->nullable()->unique();
            $table->boolean('status')->default(1);           
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('military_ranks');
    }
};
