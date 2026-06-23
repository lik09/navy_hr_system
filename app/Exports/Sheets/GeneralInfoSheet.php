<?php

namespace App\Exports\Sheets;

use App\Models\PersonalInfo;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class GeneralInfoSheet implements FromArray, WithHeadings, WithTitle
{
    public function __construct(protected PersonalInfo $info)
    {
    }

    protected function fmtDate($date): string
    {
        return $date ? \Illuminate\Support\Carbon::parse($date)->format('d/m/Y') : '—';
    }

    protected function joinLocation(...$parts): string
    {
        $parts = array_filter($parts);
        return $parts ? implode(' / ', $parts) : '—';
    }

    public function array(): array
    {
        $info = $this->info;
        $mi = $info->militaryInfo;
        $fi = $info->familyInfo;

        $rows = [
            ['ព័ត៌មានទូទៅ', ''],
            ['គោន្តនាម-នាម', $info->name_kh ?: '—'],
            ['អក្សរឡាតាំង', $info->name ?: '—'],
            ['ភេទ', $info->gender === 'male' ? 'ប្រុស' : ($info->gender === 'female' ? 'ស្រី' : '—')],
            ['អត្តលេខ', $info->id_number ?: '—'],
            ['ថ្ងៃខែឆ្នាំកំណើត', $this->fmtDate($info->date_of_birth)],
            ['លេខអត្ត.យោធា', $info->military_id ?: '—'],
            ['លេខអត្ត.សុីវិល', $info->civilian_id ?: '—'],
            ['ទីកន្លែងកំណើត', $this->joinLocation($info->birth_commune, $info->birth_district, $info->birth_province)],
            ['ទីលំនៅបច្ចុប្បន្ន', $this->joinLocation($info->current_commune, $info->current_district, $info->current_province)],
            ['ទូរស័ព្ទ', $info->phone_number ?: '—'],
            ['ព័ត៌មានយោធា', ''],
            ['ថ្ងៃខែចូលទ័ព', $this->fmtDate($mi?->military_enlistment_date)],
            ['ឋានន្តរសក្តិ', $mi?->military_rank ?: '—'],
            ['មុខតំណែង', $mi?->position ?: '—'],
            ['អង្គភាព', $mi?->unit ?: '—'],
            ['កងឯកភាព', $mi?->military_unit ?: '—'],
            ['កំរិតវប្បធម៍', $mi?->education_level ?: '—'],
            ['ជំនាញ-ឯកទេសយោធា', $mi?->military_specialty ?: '—'],
            ['ថ្ងៃខែប្រកាសស័ក្តចុងក្រោយ', $this->fmtDate($mi?->last_date_military_rank)],
            ['មុខតំណែងចុងក្រោយ', $mi?->last_position ?: '—'],
            ['ព័ត៌មានគ្រួសារ', ''],
            ['ស្ថានភាពគ្រួសារ', $fi?->marital_status ? 'មានគ្រួសារ' : 'នៅលីវ'],
        ];

        if ($fi?->marital_status) {
            $rows = array_merge($rows, [
                ['គោន្តនាម-នាមប្តី/ប្រពន្ធ', $fi->spouse_name ?: '—'],
                ['ប្តី/ប្រពន្ធ', $fi->spouse_type ? 'ប្រពន្ធ' : 'ប្ដី'],
                ['ថ្ងៃខែឆ្នាំកំណើតប្តី/ប្រពន្ធ', $this->fmtDate($fi->spouse_dob)],
                ['ទីកន្លែងកំណើតប្តី/ប្រពន្ធ', $this->joinLocation($fi->spouse_birth_commune, $fi->spouse_birth_district, $fi->spouse_birth_province)],
                ['ទីលំនៅបច្ចុប្បន្នប្តី/ប្រពន្ធ', $this->joinLocation($fi->spouse_current_commune, $fi->spouse_current_district, $fi->spouse_current_province)],
                ['លិខិតរៀបអាពាហ៍ពិពាហ៍', $fi->marriage_certificate_number ?: '—'],
                ['ថ្ងៃខែលិខិតរៀបអាពាហ៍ពិពាហ៍', $this->fmtDate($fi->marriage_certificate_date)],
            ]);
        }

        $rows[] = ['ចំនួនកូន', sprintf('%d (ប្រុស ៖ %d, ស្រី ៖ %d)', $fi?->number_of_children ?? 0, $fi?->male_children_count ?? 0, $fi?->female_children_count ?? 0)];

        foreach ($fi?->children ?? [] as $i => $child) {
            $rows[] = [sprintf('កូនទី %d', $i + 1), sprintf('%s (ថ្ងៃខែឆ្នាំកំណើត ៖ %s)', $child->name ?: '—', $this->fmtDate($child->date_of_birth))];
        }

        return $rows;
    }

    public function headings(): array
    {
        return ['ប្រភេទ', 'តម្លៃ'];
    }

    public function title(): string
    {
        return 'ព័ត៌មានទូទៅ';
    }
}
