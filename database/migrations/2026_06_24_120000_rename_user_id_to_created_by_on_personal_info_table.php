<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// personal_info.user_id meant "the account that owns this row" (self-service).
// It's becoming created_by: an audit trail of which staff account entered the
// record, no longer an access restriction. Note: this table is MyISAM, which
// never enforced the original onDelete('cascade') as a real FK constraint
// (confirmed: no row exists for it in information_schema.KEY_COLUMN_USAGE,
// just a plain index) — so there is no real constraint to drop/recreate here,
// only the column itself needs renaming and relaxing to nullable.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('personal_info', function (Blueprint $table) {
            $table->renameColumn('user_id', 'created_by');
        });

        Schema::table('personal_info', function (Blueprint $table) {
            $table->unsignedBigInteger('created_by')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('personal_info', function (Blueprint $table) {
            $table->unsignedBigInteger('created_by')->nullable(false)->change();
        });

        Schema::table('personal_info', function (Blueprint $table) {
            $table->renameColumn('created_by', 'user_id');
        });
    }
};
