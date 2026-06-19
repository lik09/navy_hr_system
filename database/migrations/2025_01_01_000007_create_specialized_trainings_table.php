<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('specialized_trainings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personal_info_id')->constrained('personal_info')->onDelete('cascade');
            $table->string('duration_study')->nullable();
            $table->string('register_date')->nullable();
            $table->string('specialty_type')->nullable();
            $table->string('specialty')->nullable();
            $table->string('education_level')->nullable();
            $table->string('institution_name')->nullable();
            $table->string('is_domestic')->nullable();
            $table->string('is_overseas')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('specialized_trainings');
    }
};
