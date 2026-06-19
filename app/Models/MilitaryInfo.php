<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MilitaryInfo extends Model
{
    protected $table = 'military_info';

    protected $fillable = [
        'personal_info_id', 'military_enlistment_date', 'military_rank',
        'position', 'unit', 'military_unit', 'education_level',
        'military_specialty', 'last_date_military_rank', 'last_position',
    ];

    protected $casts = [
        'military_enlistment_date' => 'date',
        'last_date_military_rank' => 'date',
    ];

    public function personalInfo()
    {
        return $this->belongsTo(PersonalInfo::class);
    }
}
