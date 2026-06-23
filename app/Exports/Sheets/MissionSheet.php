<?php

namespace App\Exports\Sheets;

use App\Models\PersonalInfo;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class MissionSheet implements FromArray, WithHeadings, WithTitle
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
        return $this->info->missions->map(fn ($r, $i) => [
            $i + 1,
            $this->fmtDate($r->start_date),
            $r->duration ?: '—',
            $r->mission_name ?: '—',
            $r->mission_type ?: '—',
            $r->assigned_unit ?: '—',
            $r->role_during_mission ?: '—',
            $r->result ?: '—',
        ])->all();
    }

    public function headings(): array
    {
        return ['ល.រ', 'ថ្ងៃចាប់ផ្តើម', 'រយៈពេល', 'ឈ្មោះបេសកកម្ម', 'ប្រភេទបេសកកម្ម', 'អង្គភាពចំណាត់ការ', 'តួនាទីក្នុងបេសកកម្ម', 'លទ្ធផល'];
    }

    public function title(): string
    {
        return 'បេសកកម្ម';
    }
}
