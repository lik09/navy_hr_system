<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('education', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personal_info_id')->constrained('personal_info')->onDelete('cascade');
            $table->string('from_year')->nullable();
            $table->string('to_year')->nullable();
            $table->string('duration')->nullable();
            $table->string('education_level')->nullable();
            $table->string('course_name')->nullable();
            $table->string('institution_name')->nullable();
            $table->string('is_domestic')->nullable();
            $table->string('is_overseas')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('education');
    }
};
