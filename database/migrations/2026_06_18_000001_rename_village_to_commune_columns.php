<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('personal_info', function (Blueprint $table) {
            $table->renameColumn('birth_village', 'birth_commune');
            $table->renameColumn('current_village', 'current_commune');
        });

        Schema::table('family_info', function (Blueprint $table) {
            $table->renameColumn('spouse_birth_village', 'spouse_birth_commune');
            $table->renameColumn('spouse_current_village', 'spouse_current_commune');
        });
    }

    public function down(): void
    {
        Schema::table('personal_info', function (Blueprint $table) {
            $table->renameColumn('birth_commune', 'birth_village');
            $table->renameColumn('current_commune', 'current_village');
        });

        Schema::table('family_info', function (Blueprint $table) {
            $table->renameColumn('spouse_birth_commune', 'spouse_birth_village');
            $table->renameColumn('spouse_current_commune', 'spouse_current_village');
        });
    }
};
