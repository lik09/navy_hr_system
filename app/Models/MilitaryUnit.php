<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MilitaryUnit extends Model
{
    protected $table = 'military_units';

    protected $fillable = [
        'name', 'name_kh', 'status'
    ];
}
