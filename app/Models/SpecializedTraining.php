<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpecializedTraining extends Model
{
    protected $table = 'specialized_trainings';

    protected $fillable = [
        'personal_info_id', 'duration_study', 'register_date',
        'specialty_type', 'specialty', 'education_level',
        'institution_name', 'is_domestic', 'is_overseas',
    ];

    public function personalInfo()
    {
        return $this->belongsTo(PersonalInfo::class);
    }
}
