<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('military_service_histories', function (Blueprint $table) {
            $table->date('start_date_new')->nullable()->after('start_date');
        });

        DB::table('military_service_histories')->select('id', 'start_date')->get()->each(function ($row) {
            $parsed = null;

            if (! empty($row->start_date)) {
                foreach (['d/m/Y', 'Y-m-d'] as $format) {
                    try {
                        $parsed = Carbon::createFromFormat($format, trim($row->start_date))->format('Y-m-d');
                        break;
                    } catch (\Throwable $e) {
                        continue;
                    }
                }
            }

            DB::table('military_service_histories')->where('id', $row->id)->update(['start_date_new' => $parsed]);
        });

        Schema::table('military_service_histories', function (Blueprint $table) {
            $table->dropColumn('start_date');
        });

        Schema::table('military_service_histories', function (Blueprint $table) {
            $table->renameColumn('start_date_new', 'start_date');
        });
    }

    public function down(): void
    {
        Schema::table('military_service_histories', function (Blueprint $table) {
            $table->string('start_date_old')->nullable()->after('start_date');
        });

        DB::statement('UPDATE military_service_histories SET start_date_old = start_date');

        Schema::table('military_service_histories', function (Blueprint $table) {
            $table->dropColumn('start_date');
        });

        Schema::table('military_service_histories', function (Blueprint $table) {
            $table->renameColumn('start_date_old', 'start_date');
        });
    }
};
