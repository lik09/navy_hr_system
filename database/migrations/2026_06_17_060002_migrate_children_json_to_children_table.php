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
        DB::table('family_info')->whereNotNull('children')->orderBy('id')->get()->each(function ($family) {
            $children = json_decode($family->children, true);

            if (! is_array($children)) {
                return;
            }

            foreach ($children as $child) {
                $dob = null;
                if (! empty($child['dob'])) {
                    foreach (['d/m/Y', 'Y-m-d'] as $format) {
                        try {
                            $dob = Carbon::createFromFormat($format, trim($child['dob']))->format('Y-m-d');
                            break;
                        } catch (\Throwable $e) {
                            continue;
                        }
                    }
                }

                DB::table('children')->insert([
                    'family_info_id' => $family->id,
                    'name' => $child['name'] ?? null,
                    'date_of_birth' => $dob,
                    'gender' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        });

        Schema::table('family_info', function (Blueprint $table) {
            $table->dropColumn('children');
        });
    }

    public function down(): void
    {
        Schema::table('family_info', function (Blueprint $table) {
            $table->json('children')->nullable();
        });
    }
};
