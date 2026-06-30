<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalInfo extends Model
{
    protected $table = 'personal_info';

    protected $fillable = [
        'created_by', 'name_kh', 'name', 'gender', 'id_number', 'date_of_birth',
        'military_id', 'civilian_id',
        'birth_commune', 'birth_district', 'birth_province',
        'current_commune', 'current_district', 'current_province',
        'phone_number', 'photo',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function militaryInfo()
    {
        return $this->hasOne(MilitaryInfo::class);
    }

    public function familyInfo()
    {
        return $this->hasOne(FamilyInfo::class);
    }

    public function serviceHistories()
    {
        return $this->hasMany(MilitaryServiceHistory::class)->orderBy('id');
    }

    public function education()
    {
        return $this->hasMany(Education::class)->orderBy('id');
    }

    public function specializedTrainings()
    {
        return $this->hasMany(SpecializedTraining::class)->orderBy('id');
    }

    public function missions()
    {
        return $this->hasMany(Mission::class)->orderBy('id');
    }

    public function health()
    {
        return $this->hasMany(Health::class)->orderBy('id');
    }
}
