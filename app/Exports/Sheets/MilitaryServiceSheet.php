<?php

namespace App\Exports\Sheets;

use App\Models\PersonalInfo;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class MilitaryServiceSheet implements FromArray, WithHeadings, WithTitle
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
        return $this->info->serviceHistories->map(fn ($r, $i) => [
            $i + 1,
            $this->fmtDate($r->start_date),
            $r->end_date ?: '—',
            $r->military_rank ?: '—',
            $r->position ?: '—',
            $r->office ?: '—',
            $r->military_unit ?: '—',
            $r->place ?: '—',
        ])->all();
    }

    public function headings(): array
    {
        return ['ល.រ', 'ថ្ងៃចូល', 'ថ្ងៃចេញ', 'ឋានន្តរសក្តិ', 'មុខតំណែង', 'ការិយាល័យ', 'កងឯកភាព', 'ទីកន្លែង'];
    }

    public function title(): string
    {
        return 'សេវាកម្មយោធា';
    }
}
