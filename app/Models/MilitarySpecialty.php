<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MilitarySpecialty extends Model
{
    protected $table = 'military_specialties';

    protected $fillable = [
        'name', 'name_kh', 'status'
    ];
}
