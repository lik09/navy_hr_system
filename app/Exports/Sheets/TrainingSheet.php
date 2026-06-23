<?php

namespace App\Exports\Sheets;

use App\Models\PersonalInfo;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class TrainingSheet implements FromArray, WithHeadings, WithTitle
{
    public function __construct(protected PersonalInfo $info)
    {
    }

    public function array(): array
    {
        return $this->info->specializedTrainings->map(fn ($r, $i) => [
            $i + 1,
            $r->duration_study ?: '—',
            $r->register_date ?: '—',
            $r->specialty_type ?: '—',
            $r->specialty ?: '—',
            $r->education_level ?: '—',
            $r->institution_name ?: '—',
            $r->is_domestic ?: '—',
            $r->is_overseas ?: '—',
        ])->all();
    }

    public function headings(): array
    {
        return ['ល.រ', 'រយៈពេលសិក្សា', 'ថ្ងៃចូលរៀន', 'ប្រភេទឯកទេស', 'ឯកទេស', 'កំរិតវប្បធម៍', 'គ្រឹះស្ថានសិក្សា', 'ក្នុងប្រទេស', 'ក្រៅប្រទេស'];
    }

    public function title(): string
    {
        return 'ការបង្ហាត់បង្រៀនឯកទេស';
    }
}
