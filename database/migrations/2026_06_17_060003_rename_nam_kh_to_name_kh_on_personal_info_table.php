<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('personal_info', function (Blueprint $table) {
            $table->renameColumn('nam_kh', 'name_kh');
        });
    }

    public function down(): void
    {
        Schema::table('personal_info', function (Blueprint $table) {
            $table->renameColumn('name_kh', 'nam_kh');
        });
    }
};
