<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FamilyInfo extends Model
{
    protected $table = 'family_info';

    protected $fillable = [
        'personal_info_id', 'marital_status', 'spouse_name', 'spouse_type',
        'spouse_gender', 'spouse_dob',
        'spouse_birth_commune', 'spouse_birth_district', 'spouse_birth_province',
        'spouse_current_commune', 'spouse_current_district', 'spouse_current_province',
        'marriage_certificate_number', 'marriage_certificate_date',
        'number_of_children', 'male_children_count', 'female_children_count',
    ];

    protected $casts = [
        'marital_status' => 'boolean',
        'spouse_type' => 'boolean',
        'spouse_dob' => 'date',
        'marriage_certificate_date' => 'date',
    ];

    public function personalInfo()
    {
        return $this->belongsTo(PersonalInfo::class);
    }

    public function children()
    {
        return $this->hasMany(Child::class);
    }
}
