<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('military_info', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personal_info_id')->constrained('personal_info')->onDelete('cascade');
            $table->date('military_enlistment_date')->nullable();
            $table->string('military_rank')->nullable();
            $table->string('position')->nullable();
            $table->string('unit')->nullable();
            $table->string('military_unit')->nullable();
            $table->string('education_level')->nullable();
            $table->string('military_specialty')->nullable();
            $table->date('last_date_military_rank')->nullable();
            $table->string('last_position')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('military_info');
    }
};
