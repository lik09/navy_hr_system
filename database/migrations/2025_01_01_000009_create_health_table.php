<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('health', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personal_info_id')->constrained('personal_info')->onDelete('cascade');
            $table->date('health_check_date')->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->decimal('height', 5, 2)->nullable();
            $table->string('bmi_standard_level')->nullable();
            $table->string('blood_pressure')->nullable();
            $table->string('physical_condition')->nullable();
            $table->text('vaccination')->nullable();
            $table->text('chronic_disease')->nullable();
            $table->text('regular_medication')->nullable();
            $table->string('assigned_doctor')->nullable();
            $table->date('next_health_check_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('health');
    }
};
