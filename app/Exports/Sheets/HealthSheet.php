<?php

namespace App\Exports\Sheets;

use App\Models\PersonalInfo;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class HealthSheet implements FromArray, WithHeadings, WithTitle
{
    public function __construct(protected PersonalInfo $info)
    {
    }

    protected function fmtDate($date): string
    {
        return $date ? \Illuminate\Support\Carbon::parse($date)->format('d/m/Y') : '—';
    }

    public function array(): array
    {
        return $this->info->health->map(fn ($r, $i) => [
            $i + 1,
            $this->fmtDate($r->health_check_date),
            $r->weight ?? '—',
            $r->height ?? '—',
            $r->bmi_standard_level ?? '—',
            $r->blood_pressure ?: '—',
            $r->physical_condition ?: '—',
            $r->vaccination ?: '—',
            $r->chronic_disease ?: '—',
            $r->regular_medication ?: '—',
            $r->assigned_doctor ?: '—',
            $this->fmtDate($r->next_health_check_date),
        ])->all();
    }

    public function headings(): array
    {
        return ['ល.រ', 'ថ្ងៃពិនិត្យ', 'ទម្ងន់', 'កម្ពស់', 'BMI', 'សម្ពាធឈាម', 'ស្ថានភាពរាងកាយ', 'ការចាក់វ៉ាក់សាំង', 'ជំងឺរ៉ាំរ៉ៃ', 'ការប្រើថ្នាំទៀងទាត់', 'វេជ្ជបណ្ឌិតទទួលបន្ទុក', 'ថ្ងៃពិនិត្យលើកក្រោយ'];
    }

    public function title(): string
    {
        return 'សុខភាព';
    }
}
