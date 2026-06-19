<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Child extends Model
{
    protected $table = 'children';

    protected $fillable = [
        'family_info_id', 'name', 'date_of_birth', 'gender',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    public function familyInfo()
    {
        return $this->belongsTo(FamilyInfo::class);
    }
}
