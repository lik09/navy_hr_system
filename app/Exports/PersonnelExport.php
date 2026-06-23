<?php

namespace App\Exports;

use App\Exports\Sheets\EducationSheet;
use App\Exports\Sheets\GeneralInfoSheet;
use App\Exports\Sheets\HealthSheet;
use App\Exports\Sheets\MilitaryServiceSheet;
use App\Exports\Sheets\MissionSheet;
use App\Exports\Sheets\TrainingSheet;
use App\Models\PersonalInfo;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class PersonnelExport implements WithMultipleSheets
{
    public function __construct(protected PersonalInfo $info)
    {
    }

    public function sheets(): array
    {
        return [
            new GeneralInfoSheet($this->info),
            new MilitaryServiceSheet($this->info),
            new EducationSheet($this->info),
            new TrainingSheet($this->info),
            new MissionSheet($this->info),
            new HealthSheet($this->info),
        ];
    }
}
