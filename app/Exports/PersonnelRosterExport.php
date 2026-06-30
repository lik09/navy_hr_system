<?php

namespace App\Exports;

use App\Models\PersonalInfo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

/**
 * បញ្ជីឈ្មោះបុគ្គលិក — ផ្ដុំ ទូទៅ + យោធា + គ្រួសារ ចូល sheet តែមួយ ម្នាក់មួយជួរ
 * លំដាប់ column និងស្ទីលធ្វើតាម UI Excel ដើម៖
 *   - header បៃតង អក្សរសបញ្ឈរ ៩០°, freeze ជួរ ១, dropdown filter
 *   - column ក្រហម៖ អាយុ / រយៈពេលបម្រើការ / អាយុប្ដី-ប្រពន្ធ (គណនាក្នុង PHP, គ្មាន #VALUE!)
 *   - column កូន (ឈ្មោះ + ថ្ងៃកំណើត) កើតឡើង dynamic តាមចំនួនកូនច្រើនបំផុត
 */
class PersonnelRosterExport implements FromArray, WithHeadings, WithColumnWidths, WithEvents, WithTitle
{
    private const GREEN   = '2E7D32';
    private const RED     = 'FF0000';
    private const KH_FONT = 'Khmer OS Siemreap';

    /** Cache ចំនួនកូនច្រើនបំផុត ដើម្បីកុំឱ្យរាប់ឡើងវិញរាល់ពេលហៅ columns() */
    private ?int $maxChildren = null;

    /** @param Collection<int, PersonalInfo> $people */
    public function __construct(protected Collection $people)
    {
    }

    /**
     * Column ទាំងអស់នៅកន្លែងតែមួយ — លំដាប់ដូច UI Excel (ឆ្វេង → ស្ដាំ)។
     *   heading => ចំណងជើង   width => ទទឹង   red => ក្បាលក្រហម   value => អានពី PersonalInfo
     */
    protected function columns(): array
    {
        $cols = [
            // ───────── ព័ត៌មានទូទៅ ─────────
            ['heading' => 'អត្តលេខ',              'width' => 18, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->id_number ?: '—'],
            ['heading' => 'ឋានន្តរសក្តិ',           'width' => 24, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->militaryInfo?->militaryRank?->name_kh ?: '—'],
            ['heading' => 'គោត្តនាម-នាម',          'width' => 30, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->name_kh ?: '—'],
            ['heading' => 'ភេទ',                  'width' => 8,  'red' => false, 'value' => fn (PersonalInfo $p) => $this->gender($p->gender)],
            ['heading' => 'អក្សរឡាតាំង',           'width' => 30, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->name ?: '—'],
            ['heading' => 'លេខអត្ត.យោធា',          'width' => 14, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->military_id ?: '—'],
            ['heading' => 'លេខអត្ត.សុីវិល',         'width' => 14, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->civilian_id ?: '—'],
            ['heading' => 'ថ្ងៃខែឆ្នាំកំណើត',        'width' => 20, 'red' => false, 'value' => fn (PersonalInfo $p) => $this->fmtDate($p->date_of_birth)],
            ['heading' => 'អាយុ',                  'width' => 7,  'red' => true,  'value' => fn (PersonalInfo $p) => $this->age($p->date_of_birth)],
            ['heading' => 'ទីកន្លែងកំណើត',         'width' => 40, 'red' => false, 'value' => fn (PersonalInfo $p) => $this->loc($p->birth_commune, $p->birth_district, $p->birth_province)],
            ['heading' => 'ទីលំនៅបច្ចុប្បន្ន',      'width' => 40, 'red' => false, 'value' => fn (PersonalInfo $p) => $this->loc($p->current_commune, $p->current_district, $p->current_province)],
            ['heading' => 'ទូរស័ព្ទ',              'width' => 40, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->phone_number ?: '—'],

            // ───────── ព័ត៌មានយោធា ─────────
            ['heading' => 'ថ្ងៃខែចូលទ័ព',          'width' => 14, 'red' => false, 'value' => fn (PersonalInfo $p) => $this->fmtDate($p->militaryInfo?->military_enlistment_date)],
            ['heading' => 'រយៈពេលបម្រើការ',        'width' => 9,  'red' => true,  'value' => fn (PersonalInfo $p) => $this->years($p->militaryInfo?->military_enlistment_date)],
            ['heading' => 'មុខតំណែង',             'width' => 20, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->militaryInfo?->position?->name_kh ?: '—'],
            ['heading' => 'អង្គភាព',              'width' => 30, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->militaryInfo?->unit?->name_kh ?: '—'],
            ['heading' => 'កងឯកភាព',             'width' => 30, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->militaryInfo?->militaryUnit?->name_kh ?: '—'],
            ['heading' => 'កំរិតវប្បធម៍',           'width' => 24, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->militaryInfo?->educationLevel?->name_kh ?: '—'],
            ['heading' => 'ជំនាញ-ឯកទេសយោធា',    'width' => 24, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->militaryInfo?->militarySpecialty?->name_kh ?: '—'],
            ['heading' => 'ថ្ងៃប្រកាសស័ក្តចុងក្រោយ', 'width' => 16, 'red' => false, 'value' => fn (PersonalInfo $p) => $this->fmtDate($p->militaryInfo?->last_date_military_rank)],
            ['heading' => 'មុខតំណែងចុងក្រោយ',     'width' => 24, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->militaryInfo?->last_position ?: '—'],

            // ───────── ព័ត៌មានគ្រួសារ ─────────
            ['heading' => 'ស្ថានភាពគ្រួសារ',       'width' => 14, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->familyInfo?->marital_status ? 'មានគ្រួសារ' : 'នៅលីវ'],
            ['heading' => 'ឈ្មោះប្តី/ប្រពន្ធ',       'width' => 18, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->familyInfo?->spouse_name ?: '—'],
            ['heading' => 'ប្តី/ប្រពន្ធ',            'width' => 9,  'red' => false, 'value' => fn (PersonalInfo $p) => $this->spouseType($p->familyInfo)],
            ['heading' => 'ថ្ងៃកំណើតប្តី/ប្រពន្ធ',    'width' => 14, 'red' => false, 'value' => fn (PersonalInfo $p) => $this->fmtDate($p->familyInfo?->spouse_dob)],
            ['heading' => 'អាយុប្តី/ប្រពន្ធ',        'width' => 9,  'red' => true,  'value' => fn (PersonalInfo $p) => $this->age($p->familyInfo?->spouse_dob)],
            ['heading' => 'ទីកន្លែងកំណើតប្តី/ប្រពន្ធ', 'width' => 40, 'red' => false, 'value' => fn (PersonalInfo $p) => $this->loc($p->familyInfo?->spouse_birth_commune, $p->familyInfo?->spouse_birth_district, $p->familyInfo?->spouse_birth_province)],
            ['heading' => 'ទីលំនៅប្តី/ប្រពន្ធ',      'width' => 40, 'red' => false, 'value' => fn (PersonalInfo $p) => $this->loc($p->familyInfo?->spouse_current_commune, $p->familyInfo?->spouse_current_district, $p->familyInfo?->spouse_current_province)],
            ['heading' => 'លិខិតរៀបអាពាហ៍ពិពាហ៍',  'width' => 18, 'red' => false, 'value' => fn (PersonalInfo $p) => $p->familyInfo?->marriage_certificate_number ?: '—'],
            ['heading' => 'ថ្ងៃលិខិតរៀបការ',        'width' => 14, 'red' => false, 'value' => fn (PersonalInfo $p) => $this->fmtDate($p->familyInfo?->marriage_certificate_date)],
            ['heading' => 'ចំនួនកូន',             'width' => 8,  'red' => false, 'value' => fn (PersonalInfo $p) => (string) ($p->familyInfo?->number_of_children ?? 0)],
            ['heading' => 'កូនប្រុស',              'width' => 8,  'red' => false, 'value' => fn (PersonalInfo $p) => (string) ($p->familyInfo?->male_children_count ?? 0)],
            ['heading' => 'កូនស្រី',               'width' => 8,  'red' => false, 'value' => fn (PersonalInfo $p) => (string) ($p->familyInfo?->female_children_count ?? 0)],
        ];

        // ───────── កូនម្នាក់ៗ (dynamic តាមចំនួនកូនច្រើនបំផុត) ─────────
        // បន្ថែមបន្ទាប់ពី column "កូនស្រី"៖ កូនទី១ ឈ្មោះ | កូនទី១ ថ្ងៃកំណើត | កូនទី២ ឈ្មោះ | ...
        for ($i = 0; $i < $this->maxChildren(); $i++) {
            $n = $this->khNum($i + 1);

            $cols[] = ['heading' => "កូនទី{$n} ឈ្មោះ",       'width' => 18, 'red' => false, 'value' => fn (PersonalInfo $p) => $this->childName($p, $i)];
            $cols[] = ['heading' => "កូនទី{$n} ថ្ងៃកំណើត", 'width' => 14, 'red' => false, 'value' => fn (PersonalInfo $p) => $this->childDob($p, $i)];
        }

        return $cols;
    }

    // ─────────────────────────── Data ───────────────────────────

    public function array(): array
    {
        $cols = $this->columns();

        return $this->people
            ->map(fn (PersonalInfo $p) => array_map(fn ($c) => ($c['value'])($p), $cols))
            ->all();
    }

    public function headings(): array
    {
        return array_column($this->columns(), 'heading');
    }

    public function columnWidths(): array
    {
        $widths = [];
        foreach ($this->columns() as $i => $col) {
            $widths[Coordinate::stringFromColumnIndex($i + 1)] = $col['width'];
        }

        return $widths;
    }

    public function title(): string
    {
        return 'បញ្ជីឈ្មោះបុគ្គលិក';
    }

    // ─────────────────────────── Styling ───────────────────────────

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet   = $event->sheet->getDelegate();
                $cols    = $this->columns();
                $lastCol = Coordinate::stringFromColumnIndex(count($cols));
                $lastRow = max(2, $this->people->count() + 1);

                // Font ខ្មែរ សម្រាប់តារាងទាំងមូល
                $sheet->getStyle("A1:{$lastCol}{$lastRow}")->getFont()->setName(self::KH_FONT);

                // Header បៃតង + អក្សរសបញ្ឈរ ៩០°
                $sheet->getStyle("A1:{$lastCol}1")->applyFromArray([
                    'font'      => ['bold' => true, 'size' => 11, 'color' => ['rgb' => 'FFFFFF']],
                    'alignment' => [
                        'horizontal'   => Alignment::HORIZONTAL_CENTER,
                        'vertical'     => Alignment::VERTICAL_CENTER,
                        'textRotation' => 90,
                        'wrapText'     => true,
                    ],
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => self::GREEN]],
                ]);

                // Column ដែល red => true ដាក់ក្បាលក្រហម
                foreach ($cols as $i => $col) {
                    if (! empty($col['red'])) {
                        $letter = Coordinate::stringFromColumnIndex($i + 1);
                        $sheet->getStyle("{$letter}1")->getFill()
                            ->setFillType(Fill::FILL_SOLID)
                            ->getStartColor()->setRGB(self::RED);
                    }
                }

                $sheet->getRowDimension(1)->setRowHeight(155);

                // ខ្សែបន្ទាត់ជុំវិញក្រឡាទាំងអស់
                $sheet->getStyle("A1:{$lastCol}{$lastRow}")->applyFromArray([
                    'borders' => [
                        'allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'BFBFBF']],
                    ],
                ]);

                // ក្រឡាទិន្នន័យ៖ center បញ្ឈរ + wrap
                $sheet->getStyle("A2:{$lastCol}{$lastRow}")->applyFromArray([
                    'alignment' => ['vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
                ]);

                // Freeze ជួរ header + បើក dropdown filter
                $sheet->freezePane('A2');
                $sheet->setAutoFilter("A1:{$lastCol}{$lastRow}");
            },
        ];
    }

    // ─────────────────────────── Helpers ───────────────────────────

    protected function fmtDate($date): string
    {
        return $date ? Carbon::parse($date)->format('d-M-Y') : '—';
    }

    /** អាយុ (ឆ្នាំ) គណនាក្នុង PHP — ជំនួស #VALUE! ក្នុង Excel */
    protected function age($date): string
    {
        return $date ? (string) Carbon::parse($date)->age : '—';
    }

    /** រយៈពេលបម្រើការ (ឆ្នាំ) ចាប់ពីថ្ងៃចូលទ័ពដល់បច្ចុប្បន្ន */
    protected function years($date): string
    {
        return $date ? (string) (int) Carbon::parse($date)->diffInYears(now()) : '—';
    }

    protected function gender(?string $g): string
    {
        return match ($g) {
            'male'   => 'ប្រុស',
            'female' => 'ស្រី',
            default  => '—',
        };
    }

    protected function spouseType($fi): string
    {
        if (! $fi || ! $fi->marital_status) {
            return '—';
        }

        return $fi->spouse_type ? 'ប្រពន្ធ' : 'ប្ដី';
    }

    protected function loc(...$parts): string
    {
        $parts = array_filter($parts);

        return $parts ? implode(' / ', $parts) : '—';
    }

    // ──────────────────────── Helpers: កូន ────────────────────────

    /**
     * ចំនួនកូនច្រើនបំផុតក្នុង collection — កំណត់ថាត្រូវបង្កើតគូ column ប៉ុន្មាន។
     * បើគ្មាននរណាមានកូនទេ យ៉ាងហោចបង្ហាញ ១ គូ (ដើម្បីកុំឱ្យបាត់ column ស្រាប់)។
     */
    protected function maxChildren(): int
    {
        return $this->maxChildren ??= max(
            1,
            (int) $this->people->max(
                fn (PersonalInfo $p) => $p->familyInfo?->children?->count() ?? 0
            )
        );
    }


    protected function child(PersonalInfo $p, int $index)
    {
        return $p->familyInfo?->children?->values()->get($index);
    }

   
    protected function childName(PersonalInfo $p, int $index): string
    {
        return $this->child($p, $index)?->name ?: '—';
    }

    protected function childDob(PersonalInfo $p, int $index): string
    {
        return $this->fmtDate($this->child($p, $index)?->date_of_birth);
    }

    /** បំប្លែងលេខអារ៉ាប់ (1,2,3) ទៅជាលេខខ្មែរ (១,២,៣) សម្រាប់ចំណងជើង column */
    protected function khNum(int $n): string
    {
        return strtr((string) $n, [
            '0' => '០', '1' => '១', '2' => '២', '3' => '៣', '4' => '៤',
            '5' => '៥', '6' => '៦', '7' => '៧', '8' => '៨', '9' => '៩',
        ]);
    }
}