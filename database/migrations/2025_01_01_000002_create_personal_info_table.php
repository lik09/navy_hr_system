<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personal_info', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nam_kh')->nullable();
            $table->string('name')->nullable();
            $table->string('gender')->nullable();
            $table->string('id_number')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('military_id')->nullable();
            $table->string('civilian_id')->nullable();
            $table->string('birth_village')->nullable();
            $table->string('birth_district')->nullable();
            $table->string('birth_province')->nullable();
            $table->string('current_village')->nullable();
            $table->string('current_district')->nullable();
            $table->string('current_province')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('photo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_info');
    }
};
