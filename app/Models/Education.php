<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    protected $table = 'education';

    protected $fillable = [
        'personal_info_id', 'from_year', 'to_year', 'duration',
        'education_level', 'course_name', 'institution_name',
        'is_domestic', 'is_overseas',
    ];

    protected $casts = [
        'from_year' => 'integer',
        'to_year' => 'integer',
    ];

    public function personalInfo()
    {
        return $this->belongsTo(PersonalInfo::class);
    }
}
