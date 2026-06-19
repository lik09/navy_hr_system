<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('family_info', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personal_info_id')->constrained('personal_info')->onDelete('cascade');
            $table->string('marital_status')->nullable();
            $table->string('spouse_name')->nullable();
            $table->string('spouse_type')->nullable();
            $table->string('spouse_gender')->nullable();
            $table->date('spouse_dob')->nullable();
            $table->string('spouse_birth_village')->nullable();
            $table->string('spouse_birth_district')->nullable();
            $table->string('spouse_birth_province')->nullable();
            $table->string('spouse_current_village')->nullable();
            $table->string('spouse_current_district')->nullable();
            $table->string('spouse_current_province')->nullable();
            $table->string('marriage_certificate_number')->nullable();
            $table->date('marriage_certificate_date')->nullable();
            $table->integer('number_of_children')->default(0);
            $table->integer('male_children_count')->default(0);
            $table->integer('female_children_count')->default(0);
            $table->json('children')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('family_info');
    }
};
