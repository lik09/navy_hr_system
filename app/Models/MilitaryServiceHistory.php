<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MilitaryServiceHistory extends Model
{
    protected $table = 'military_service_histories';

    protected $fillable = [
        'personal_info_id', 'start_date', 'end_date',
        'military_rank', 'position', 'office', 'military_unit', 'place',
    ];

    protected $casts = [
        'start_date' => 'date',
    ];

    public function personalInfo()
    {
        return $this->belongsTo(PersonalInfo::class);
    }
}
