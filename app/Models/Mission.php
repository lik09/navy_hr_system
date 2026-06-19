<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    protected $table = 'missions';

    protected $fillable = [
        'personal_info_id', 'start_date', 'duration', 'mission_name',
        'mission_type', 'assigned_unit', 'role_during_mission', 'result',
    ];

    protected $casts = [
        'start_date' => 'date',
    ];

    public function personalInfo()
    {
        return $this->belongsTo(PersonalInfo::class);
    }
}
