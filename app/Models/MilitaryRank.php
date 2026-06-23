<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MilitaryRank extends Model
{
    protected $table = 'military_ranks';

    protected $fillable = [
        'name', 'name_kh', 'status'
    ];
}
