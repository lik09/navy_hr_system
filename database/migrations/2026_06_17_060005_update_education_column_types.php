<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('education', function (Blueprint $table) {
            $table->integer('from_year_new')->nullable()->after('from_year');
            $table->integer('to_year_new')->nullable()->after('to_year');
        });

        $khmer = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
        $arabic = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        DB::table('education')->select('id', 'from_year', 'to_year')->get()->each(function ($row) use ($khmer, $arabic) {
            $fromYear = trim(str_replace($khmer, $arabic, (string) $row->from_year));
            $toYear = trim(str_replace($khmer, $arabic, (string) $row->to_year));

            DB::table('education')->where('id', $row->id)->update([
                'from_year_new' => ctype_digit($fromYear) ? (int) $fromYear : null,
                'to_year_new' => ctype_digit($toYear) ? (int) $toYear : null,
            ]);
        });

        Schema::table('education', function (Blueprint $table) {
            $table->dropColumn(['from_year', 'to_year']);
        });

        Schema::table('education', function (Blueprint $table) {
            $table->renameColumn('from_year_new', 'from_year');
            $table->renameColumn('to_year_new', 'to_year');
        });
    }

    public function down(): void
    {
        Schema::table('education', function (Blueprint $table) {
            $table->string('from_year_old')->nullable()->after('from_year');
            $table->string('to_year_old')->nullable()->after('to_year');
        });

        DB::statement('UPDATE education SET from_year_old = from_year, to_year_old = to_year');

        Schema::table('education', function (Blueprint $table) {
            $table->dropColumn(['from_year', 'to_year']);
        });

        Schema::table('education', function (Blueprint $table) {
            $table->renameColumn('from_year_old', 'from_year');
            $table->renameColumn('to_year_old', 'to_year');
        });
    }
};
