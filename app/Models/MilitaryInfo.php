<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MilitaryInfo extends Model
{
    protected $table = 'military_info';

    protected $fillable = [
        'personal_info_id',
        'military_enlistment_date',
        'military_rank_id',        // ✅ FK
        'position_id',             // ✅ FK
        'unit_id',                 // ✅ FK
        'military_unit_id',        // ✅ FK
        'education_level_id',      // ✅ FK
        'military_specialty_id',   // ✅ FK
        'last_date_military_rank',
        'last_position',
    ];

    protected $casts = [
        'military_enlistment_date' => 'date',
        'last_date_military_rank'  => 'date',
    ];

    // ─── Relations ───────────────────────────────────────────
    public function personalInfo()
    {
        return $this->belongsTo(PersonalInfo::class);
    }

    public function militaryRank()
    {
        return $this->belongsTo(MilitaryRank::class, 'military_rank_id');
    }

    public function position()
    {
        return $this->belongsTo(Position::class, 'position_id');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    public function militaryUnit()
    {
        return $this->belongsTo(MilitaryUnit::class, 'military_unit_id');
    }

    public function educationLevel()
    {
        return $this->belongsTo(EducationLevel::class, 'education_level_id');
    }

    public function militarySpecialty()
    {
        return $this->belongsTo(MilitarySpecialty::class, 'military_specialty_id');
    }
}