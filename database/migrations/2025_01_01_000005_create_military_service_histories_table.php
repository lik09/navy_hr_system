<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('military_service_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personal_info_id')->constrained('personal_info')->onDelete('cascade');
            $table->string('start_date')->nullable();
            $table->string('end_date')->nullable();
            $table->string('military_rank')->nullable();
            $table->string('position')->nullable();
            $table->string('office')->nullable();
            $table->string('military_unit')->nullable();
            $table->string('place')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('military_service_histories');
    }
};
