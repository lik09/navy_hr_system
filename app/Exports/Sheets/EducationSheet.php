<?php

namespace App\Exports\Sheets;

use App\Models\PersonalInfo;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class EducationSheet implements FromArray, WithHeadings, WithTitle
{
    public function __construct(protected PersonalInfo $info)
    {
    }

    public function array(): array
    {
        return $this->info->education->map(fn ($r, $i) => [
            $i + 1,
            $r->from_year ?: '—',
            $r->to_year ?: '—',
            $r->duration ?: '—',
            $r->education_level ?: '—',
            $r->course_name ?: '—',
            $r->institution_name ?: '—',
            $r->is_domestic ?: '—',
            $r->is_overseas ?: '—',
        ])->all();
    }

    public function headings(): array
    {
        return ['ល.រ', 'ពីឆ្នាំ', 'ដល់ឆ្នាំ', 'រយៈពេល', 'កំរិតវប្បធម៍', 'ឈ្មោះវគ្គសិក្សា', 'គ្រឹះស្ថានសិក្សា', 'ក្នុងប្រទេស', 'ក្រៅប្រទេស'];
    }

    public function title(): string
    {
        return 'ការសិក្សា';
    }
}
