<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('missions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personal_info_id')->constrained('personal_info')->onDelete('cascade');
            $table->date('start_date')->nullable();
            $table->string('duration')->nullable();
            $table->string('mission_name')->nullable();
            $table->string('mission_type')->nullable();
            $table->string('assigned_unit')->nullable();
            $table->string('role_during_mission')->nullable();
            $table->string('result')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('missions');
    }
};
