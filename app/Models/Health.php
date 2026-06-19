<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Health extends Model
{
    protected $table = 'health';

    protected $fillable = [
        'personal_info_id', 'health_check_date', 'weight', 'height',
        'bmi_standard_level', 'blood_pressure', 'physical_condition',
        'vaccination', 'chronic_disease', 'regular_medication',
        'assigned_doctor', 'next_health_check_date',
    ];

    protected $casts = [
        'health_check_date' => 'date',
        'next_health_check_date' => 'date',
    ];

    public function personalInfo()
    {
        return $this->belongsTo(PersonalInfo::class);
    }
}
