<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('health', function (Blueprint $table) {
            $table->decimal('bmi_standard_level_new', 5, 2)->nullable()->after('bmi_standard_level');
        });

        DB::statement("UPDATE health SET bmi_standard_level_new = CAST(bmi_standard_level AS DECIMAL(5,2)) WHERE bmi_standard_level REGEXP '^[0-9]+(\\\\.[0-9]+)?$'");

        Schema::table('health', function (Blueprint $table) {
            $table->dropColumn('bmi_standard_level');
        });

        Schema::table('health', function (Blueprint $table) {
            $table->renameColumn('bmi_standard_level_new', 'bmi_standard_level');
        });
    }

    public function down(): void
    {
        Schema::table('health', function (Blueprint $table) {
            $table->string('bmi_standard_level_old')->nullable()->after('bmi_standard_level');
        });

        DB::statement('UPDATE health SET bmi_standard_level_old = bmi_standard_level');

        Schema::table('health', function (Blueprint $table) {
            $table->dropColumn('bmi_standard_level');
        });

        Schema::table('health', function (Blueprint $table) {
            $table->renameColumn('bmi_standard_level_old', 'bmi_standard_level');
        });
    }
};
