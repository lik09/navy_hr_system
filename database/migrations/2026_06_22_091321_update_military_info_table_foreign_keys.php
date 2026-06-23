<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('military_info', function (Blueprint $table) {
            // លុប columns ចាស់
            $table->dropColumn([
                'military_rank',
                'position',
                'unit',
                'military_unit',
                'education_level',
                'military_specialty',
            ]);

            // បន្ថែម foreign key columns ថ្មី
            $table->foreignId('military_rank_id')
                ->nullable()
                ->constrained('military_ranks')
                ->onDelete('set null');

            $table->foreignId('position_id')
                ->nullable()
                ->constrained('positions')
                ->onDelete('set null');

            $table->foreignId('unit_id')
                ->nullable()
                ->constrained('units')
                ->onDelete('set null');

            $table->foreignId('military_unit_id')
                ->nullable()
                ->constrained('military_units')
                ->onDelete('set null');

            $table->foreignId('education_level_id')
                ->nullable()
                ->constrained('education_levels')
                ->onDelete('set null');

            $table->foreignId('military_specialty_id')
                ->nullable()
                ->constrained('military_specialties')
                ->onDelete('set null');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('military_info', function (Blueprint $table) {
            $table->dropForeign(['military_rank_id']);
            $table->dropForeign(['position_id']);
            $table->dropForeign(['unit_id']);
            $table->dropForeign(['military_unit_id']);
            $table->dropForeign(['education_level_id']);
            $table->dropForeign(['military_specialty_id']);

            $table->dropColumn([
                'military_rank_id',
                'position_id',
                'unit_id',
                'military_unit_id',
                'education_level_id',
                'military_specialty_id',
            ]);

            // បន្ថែម columns ចាស់វិញ
            $table->string('military_rank')->nullable();
            $table->string('position')->nullable();
            $table->string('unit')->nullable();
            $table->string('military_unit')->nullable();
            $table->string('education_level')->nullable();
            $table->string('military_specialty')->nullable();
        });
    }
};
