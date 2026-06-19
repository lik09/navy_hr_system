<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('family_info', function (Blueprint $table) {
            $table->boolean('marital_status_new')->nullable()->after('marital_status');
            $table->boolean('spouse_type_new')->nullable()->after('spouse_type');
        });

        DB::statement("UPDATE family_info SET marital_status_new = (marital_status = 'married')");
        DB::statement("UPDATE family_info SET spouse_type_new = (spouse_type = 'wife')");

        Schema::table('family_info', function (Blueprint $table) {
            $table->dropColumn(['marital_status', 'spouse_type']);
        });

        Schema::table('family_info', function (Blueprint $table) {
            $table->renameColumn('marital_status_new', 'marital_status');
            $table->renameColumn('spouse_type_new', 'spouse_type');
        });
    }

    public function down(): void
    {
        Schema::table('family_info', function (Blueprint $table) {
            $table->string('marital_status_old')->nullable()->after('marital_status');
            $table->string('spouse_type_old')->nullable()->after('spouse_type');
        });

        DB::statement("UPDATE family_info SET marital_status_old = IF(marital_status = 1, 'married', 'single')");
        DB::statement("UPDATE family_info SET spouse_type_old = IF(spouse_type = 1, 'wife', 'husband')");

        Schema::table('family_info', function (Blueprint $table) {
            $table->dropColumn(['marital_status', 'spouse_type']);
        });

        Schema::table('family_info', function (Blueprint $table) {
            $table->renameColumn('marital_status_old', 'marital_status');
            $table->renameColumn('spouse_type_old', 'spouse_type');
        });
    }
};
