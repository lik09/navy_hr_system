<!DOCTYPE html>
<html lang="km">
<head>
<meta charset="utf-8">
<style>
    * { font-family: 'Noto Sans Khmer', sans-serif; }

    body {
    margin: 0px;
    font-size: 11px;
    color: #222;
    }

    .doc-title {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        /* margin-top: 5px; */
        margin-bottom: 8px;
    }

    /* ════ របារផ្នែក ════ */
    .sec-bar {
        background: #1F3864;
        color: #fff;
        font-weight: bold;
        font-size: 12px;
        padding: 5px 10px;
        border: 1px solid #1F3864;
        border-bottom: none;
    }

    /* ════ Page 1 — តារាង label/value ════ */
    table.kv {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        border: 1px solid #1F3864;        /* ស៊ុមក្រៅក្រាស់ ខៀវ */
    }
    table.kv td {
        border: 1px solid #c5ccd6;        /* បន្ទាត់ក្នុងស្តើង ប្រផេះ */
        padding: 6px 8px;
        font-size: 11px;
        vertical-align: middle;
        line-height: 1.7;
        word-wrap: break-word;
        word-break: break-all;

    }
    table.kv td.lbl {
        width: 150px;
        white-space: nowrap;
        font-weight: bold;
    }
    table.kv td.lbl:before { content: "- "; }
    table.kv td.val {
        color: #000000;
        font-weight: normal;
    }
    table.kv td.photo-cell {
        width: 130px;
        text-align: center;
        vertical-align: middle;
        padding: 4px;
    }
    table.kv td.photo-cell img,
    table.kv td.photo-cell > div > div {
        border: 1px solid #1F3864;        /* ស៊ុមរូបក្រាស់ ខៀវ */
    }

    .sub { color: #555; font-weight: normal; }
    .sub-val { color: #000000; font-weight: normal; }
    .chk { font-size: 12px; }

    /* ════ Page 2+ — តារាងទិន្នន័យ ════ */
    .page-break { page-break-before: always; }

    .sec-bar2 {
        background: #1F3864;
        color: #fff;
        font-weight: bold;
        font-size: 13px;
        padding: 5px 10px;
        border: 1px solid #1F3864;
        border-bottom: none;
        margin-top: 5px;
    }

    /* .title-moul { font-family: 'moul', 'notosanskhmer'; } */

    table.data-tbl {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        border: 1px solid #1F3864;        /* ស៊ុមក្រៅក្រាស់ ខៀវ */
    }
    table.data-tbl th {
        border: 1px solid #c5ccd6;
        background: #f0f4f8;
        color: #000000;
        font-weight: bold;
        font-size: 11px;
        padding: 6px 4px;
        text-align: center;
        vertical-align: middle;
    }
    table.data-tbl td {
        border: 1px solid #c5ccd6;
        padding: 5px 6px;
        font-size: 10px;
        text-align: center;
        vertical-align: middle;
        color: #000000;
        word-wrap: break-word;
    }
    table.data-tbl td.empty {
        color: #888;
        font-style: italic;
    }
</style>
</head>
<body>

@php
    $fi  = $info->familyInfo;
    $mi  = $info->militaryInfo;
    $fmt = fn($d) => $d ? \Illuminate\Support\Carbon::parse($d)->format('d/m/Y') : '';

    $photoSrc = null;
    if ($info->photo) {
        $photoPath = storage_path('app/public/' . $info->photo);
        if (file_exists($photoPath)) {
            $mime = mime_content_type($photoPath);
            if (in_array($mime, ['image/jpeg', 'image/png'])) {
                $photoSrc = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($photoPath));
            }
        }
    }

    $g = $info->gender;
    $married   = (bool)($fi?->marital_status);
    $cbMale    = $g === 'male'   ? '☑' : '☐';
    $cbFemale  = $g === 'female' ? '☑' : '☐';
    $cbSingle  = !$married ? '☑' : '☐';
    $cbMarried =  $married ? '☑' : '☐';
    $cbHusband = ($fi && !$fi->spouse_type) ? '☑' : '☐';
    $cbWife    = ($fi &&  $fi->spouse_type) ? '☑' : '☐';
@endphp

{{-- ═══════════════════════════════════════════════════════════ --}}
{{-- ░░░░░░░░░░░░░░░░░  PAGE 1  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ --}}
{{-- ═══════════════════════════════════════════════════════════ --}}


<div class="doc-title title-moul">ព័ត៌មានផ្ទាល់ខ្លួនរបស់នាយនាវី នាយនាវីរង ពលនាវី</div>

<div class="sec-bar title-moul">I. ព័ត៌មានផ្ទាល់ខ្លួន</div>

<table class="kv">
    {{-- ជួរ ១: គោត្តនាម + ភេទ + រូបថត (rowspan=5) --}}
    <tr>
        <td class="lbl">គោត្តនាម-នាម</td>
        <td class="val">{{ $info->name_kh ?: '' }}</td>
        <td style="width:160px; white-space:nowrap;">
            <span class="sub">ភេទ៖</span>
            <span class="chk">{{ $cbMale }} ប្រុស &nbsp; {{ $cbFemale }} ស្រី</span>
        </td>
        <td class="photo-cell" rowspan="5">
            <div style="text-align:center;">
                @if($photoSrc)
                    <img src="{{ $photoSrc }}" style="width:115px; height:145px;" />
                @else
                    <div style="width:115px; height:145px; background:#eef2f7;
                                color:#888; font-size:10px; line-height:145px; margin:0 auto;">
                        មិនមានរូបភាព
                    </div>
                @endif
            </div>
        </td>
    </tr>
    {{-- ជួរ ២: អក្សរឡាតាំង + អត្តលេខ --}}
    <tr>
        <td class="lbl">អក្សរឡាតាំង</td>
        <td class="val">{{ $info->name ?: '' }}</td>
        <td style="white-space:nowrap;">
            <span class="sub">អត្តលេខ៖</span>
            <span class="sub-val">{{ $info->id_number ?: '' }}</span>
        </td>
    </tr>
    {{-- ជួរ ៣: ថ្ងៃខែឆ្នាំកំណើត --}}
    <tr>
        <td class="lbl">ថ្ងៃខែឆ្នាំកំណើត</td>
        <td class="val" colspan="2">{{ $fmt($info->date_of_birth) }}</td>
    </tr>
    {{-- ជួរ ៤: លេខអត្ត.យោធា --}}
    <tr>
        <td class="lbl">លេខអត្ត.យោធា</td>
        <td class="val" colspan="2">{{ $info->military_id ?: '' }}</td>
    </tr>
    {{-- ជួរ ៥: លេខអត្ត.សុីវិល --}}
    <tr>
        <td class="lbl">លេខអត្ត.សុីវិល</td>
        <td class="val" colspan="2">{{ $info->civilian_id ?: '' }}</td>
    </tr>

    {{-- ══ ពេញទទឹង (រូបថតចប់) ══ --}}
    <tr>
        <td class="lbl">ទីកន្លែងកំណើត</td>
        <td><span class="sub">ឃុំ/សង្កាត់៖</span> <span class="sub-val">{{ $info->birth_commune ?: '' }}</span></td>
        <td><span class="sub">ស្រុក/ខណ្ឌ៖</span> <span class="sub-val">{{ $info->birth_district ?: '' }}</span></td>
        <td><span class="sub">ខេត្ត/ក្រុង៖</span> <span class="sub-val">{{ $info->birth_province ?: '' }}</span></td>
        
    </tr>
    <tr>
        <td class="lbl">ទីលំនៅបច្ចុប្បន្ន</td>
        <td><span class="sub">ឃុំ/សង្កាត់៖</span> <span class="sub-val">{{ $info->current_commune ?: '' }}</span></td>
        <td><span class="sub">ស្រុក/ខណ្ឌ៖</span> <span class="sub-val">{{ $info->current_district ?: '' }}</span></td>
        <td><span class="sub">ខេត្ត/ក្រុង៖</span> <span class="sub-val">{{ $info->current_province ?: '' }}</span></td>
    </tr>
    <tr>
        <td class="lbl">លេខទូរស័ព្ទ</td>
        <td class="val" colspan="3">{{ $info->phone_number ?: '' }}</td>
    </tr>
    {{-- ── ផ្នែកយោធា (FK → ឈ្មោះ) ── --}}
    <tr>
        <td class="lbl">ថ្ងៃខែចូលទ័ព</td>
        <td class="val" colspan="3">{{ $fmt($mi?->military_enlistment_date) }}</td>
    </tr>
    <tr>
        <td class="lbl">ឋានន្តរសក្តិ</td>
        <td class="val" colspan="3">{{ $mi?->militaryRank?->name_kh ?: ($mi?->militaryRank?->name ?: '') }}</td>
    </tr>
    <tr>
        <td class="lbl">មុខតំណែង</td>
        <td class="val" colspan="3">{{ $mi?->position?->name_kh ?: ($mi?->position?->name ?: '') }}</td>
    </tr>
    <tr>
        <td class="lbl">អង្គភាព</td>
        <td class="val" colspan="3">{{ $mi?->unit?->name_kh ?: ($mi?->unit?->name ?: '') }}</td>
    </tr>
    <tr>
        <td class="lbl">កងឯកភាព</td>
        <td class="val" colspan="3">{{ $mi?->militaryUnit?->name_kh ?: ($mi?->militaryUnit?->name ?: '') }}</td>
    </tr>
    <tr>
        <td class="lbl">កំរិតវប្បធម៌</td>
        <td class="val" colspan="3">{{ $mi?->educationLevel?->name_kh ?: ($mi?->educationLevel?->name ?: '') }}</td>
    </tr>
    <tr>
        <td class="lbl">ជំនាញ-ឯកទេសយោធា</td>
        <td class="val" colspan="3">{{ $mi?->militarySpecialty?->name_kh ?: ($mi?->militarySpecialty?->name ?: '') }}</td>
    </tr>
    <tr>
        <td class="lbl">ថ្ងៃខែប្រកាសស័ក្តចុងក្រោយ</td>
        <td class="val" colspan="3">{{ $fmt($mi?->last_date_military_rank) }}</td>
    </tr>
    <tr>
        <td class="lbl">មុខតំណែងចុងក្រោយ</td>
        <td class="val" colspan="3">{{ $mi?->last_position ?: '' }}</td>
    </tr>

    {{-- ── ស្ថានភាពគ្រួសារ ── --}}
    <tr>
        <td class="lbl">ស្ថានភាពគ្រួសារ</td>
        <td colspan="3" class="chk">
            {{ $cbSingle }} នៅលីវ &nbsp;&nbsp;&nbsp; {{ $cbMarried }} មានគ្រួសារ
        </td>
    </tr>

    @if($married)
    <tr>
        <td class="lbl">គោត្តនាម-នាម</td>
        <td class="val">{{ $fi->spouse_name ?: '' }}</td>
        <td class="chk" colspan="2" style="white-space:nowrap;">{{ $cbHusband }} ប្ដី &nbsp; {{ $cbWife }} ប្រពន្ធ</td>
    </tr>
    <tr>
        <td class="lbl">ថ្ងៃខែឆ្នាំកំណើត</td>
        <td class="val" colspan="3">{{ $fmt($fi->spouse_dob) }}</td>
    </tr>
    <tr>
        <td class="lbl">ទីកន្លែងកំណើត</td>
        <td colspan="3">
            <span class="sub">ឃុំ/សង្កាត់៖</span> <span class="sub-val">{{ $fi->spouse_birth_commune ?: '' }}</span> &nbsp;
            <span class="sub">ស្រុក/ខណ្ឌ៖</span> <span class="sub-val">{{ $fi->spouse_birth_district ?: '' }}</span> &nbsp;
            <span class="sub">ខេត្ត/ក្រុង៖</span> <span class="sub-val">{{ $fi->spouse_birth_province ?: '' }}</span>
        </td>
    </tr>
    <tr>
        <td class="lbl">ទីលំនៅបច្ចុប្បន្ន</td>
        <td><span class="sub">ឃុំ/សង្កាត់៖</span> <span class="sub-val">{{ $fi->spouse_current_commune ?: '' }}</span></td>
        <td><span class="sub">ស្រុក/ខណ្ឌ៖</span> <span class="sub-val">{{ $fi->spouse_current_district ?: '' }}</span> </td>
        <td><span class="sub">ខេត្ត/ក្រុង៖</span> <span class="sub-val">{{ $fi->spouse_current_province ?: '' }}</span></td>
    </tr>
    <tr>
        <td class="lbl">លិខិតរៀបអាពាហ៍ពិពាហ៍</td>
        <td>
            <span class="sub">លេខ៖</span> <span class="sub-val">{{ $fi->marriage_certificate_number ?: '' }}</span>
        </td>
        <td colspan="2">
            <span class="sub-val">{{ $fmt($fi->marriage_certificate_date) }}</span>
        </td>
    </tr>
    @endif

    {{-- ចំនួនកូន --}}
    <tr>
        <td class="lbl">ចំនួនកូន</td>
        <td colspan="3">
            <span class="sub">សរុប៖  </span> <span class="sub-val">{{ $fi?->number_of_children ?? 0 }}</span>&nbsp;
            <span class="sub">ប្រុស៖ </span> <span class="sub-val">{{ $fi?->male_children_count ?? 0 }}</span> &nbsp;
            <span class="sub">ស្រី៖ </span> <span class="sub-val">{{ $fi?->female_children_count ?? 0 }}</span>
        </td>
    </tr>
    {{-- បញ្ជីកូន --}}
    @foreach($fi?->children ?? [] as $i => $child)
    <tr>
        <td class="lbl">{{ $i + 1 }}.ឈ្មោះកូន</td>
        <td class="val">{{ $child->name ?: '' }}</td>
        <td colspan="2">
            <span class="sub">ថ្ងៃខែឆ្នាំកំណើត៖</span>
            <span class="sub-val">{{ $fmt($child->date_of_birth) }}</span>
        </td>
    </tr>
    @endforeach
</table>

{{-- ═══════════════════════════════════════════════════════════ --}}
{{-- ░░░░░░░░░░░░░░░░░  PAGE 2  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ --}}
{{-- ═══════════════════════════════════════════════════════════ --}}

<div class="page-break"></div>

<div class="sec-bar2 title-moul">II. ព័ត៌មានការងារយោធា</div>

<table class="data-tbl">
    <thead>
        <tr>
            <th colspan="2" style="width:30%;">រយៈកាលការងារ</th>
            <th style="width:14%;">ឋានន្តរសក្តិ</th>
            <th style="width:14%;">មុខតំណែង</th>
            <th style="width:14%;">ការិយាល័យ</th>
            <th style="width:14%;">កងឯកភាព</th>
            <th style="width:14%;">ទីកន្លែង</th>
        </tr>

    </thead>

    <tbody>
        @forelse($info->serviceHistories as $r)
        <tr class="val">
            <td>
                <span class="sub">{{ $fmt($r->start_date) }}</span>
            </td>
            <td>
                <span class="sub">{{ $r->end_date ?: 'បច្ចុប្បន្ន' }}</span>
            </td>

            <td>{{ $r->military_rank ?: '' }}</td>
            <td>{{ $r->position ?: '' }}</td>
            <td>{{ $r->office ?: '' }}</td>
            <td>{{ $r->military_unit ?: '' }}</td>
            <td>{{ $r->place ?: '' }}</td>
        </tr>
        @empty
        <tr>
            <td colspan="7" class="empty" style="padding:14px;">
                មិនទាន់មានទិន្នន័យ
            </td>
        </tr>
        @endforelse
    </tbody>
</table>


{{-- ═══════════════════════════════════════════════════════════ --}}
{{-- ░░░░░░░░░░░░░░░░░  PAGE 3  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ --}}
{{-- ═══════════════════════════════════════════════════════════ --}}

<div class="page-break"></div>

<div class="sec-bar2 title-moul">III. ព័ត៌មានអំពីការសិក្សា</div>

<table class="data-tbl">
    <thead>
        <tr>
            <th colSpan="3">រយៈកាលសិក្សា</th>
            <th colSpan="2">ប្រភេទការអប់រំ</th>
            <th colSpan="3">ទីកន្លែងសិក្សា</th>
        </tr>
        <tr>
            <th colSpan="2">ឆ្នាំសិក្សា</th>
            <th>រយៈពេល</th>
            <th>កំរិតសិក្សា</th>
            <th>ឈ្មោះវគ្គសិក្សា</th>
            <th>ឈ្មោះគ្រឹះស្ថានអប់រំ</th>
            <th>ក្នុងប្រទេស</th>
            <th>ក្រៅប្រទេស</th>
        </tr>

    </thead>

    <tbody>
        @forelse($info->education as $r)
        <tr>
            <td>
                <span class="sub">{{ $r->from_year ?: '' }}</span>
            </td>
            <td>
                <span class="sub">{{ $r->to_year ?: '' }}</span>
            </td>

            <td>{{ $r->duration ?: '' }}</td>
            <td>{{ $r->education_level ?: '' }}</td>
            <td>{{ $r->course_name ?: '' }}</td>
            <td>{{ $r->institution_name ?: '' }}</td>
            <td>{{ $r->is_domestic ?: '' }}</td>
            <td>{{ $r->is_overseas ?: '' }}</td>
        </tr>
        @empty
        <tr>
            <td colspan="8" class="empty" style="padding:14px;">
                មិនទាន់មានទិន្នន័យ
            </td>
        </tr>
        @endforelse
    </tbody>
</table>



{{-- ═══════════════════════════════════════════════════════════ --}}
{{-- ░░░░░░░░░░░░░░░░░  PAGE 4  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ --}}
{{-- ═══════════════════════════════════════════════════════════ --}}

<div class="page-break"></div>

<div class="sec-bar2 title-moul">IV. ព័ត៌មានអំពីជំនាញ-ឯកទេស (បំប៉ន)</div>

<table class="data-tbl">
    <thead>
        <tr>
            <th colSpan="2">រយៈកាលសិក្សា</th>
            <th colSpan="3">ប្រភេទការអប់រំ</th>
            <th colSpan="3">ទីកន្លែងសិក្សា</th>
        </tr>
        <tr>
            <th style="width:9%;">រយៈពេល</th>
            <th style="width:11%;">ចុះថ្ងៃខែឆ្នាំ</th>
            <th style="width:12%;">ប្រភេទជំនាញ</th>
            <th style="width:12%;">ឯកទេស</th>
            <th style="width:8%;">កំរិត</th>
            <th style="width:28%;">ឈ្មោះគ្រឹះស្ថានអប់រំ</th>
            <th style="width:10%;">ក្នុងប្រទេស</th>
            <th style="width:10%;">ក្រៅប្រទេស</th>
        </tr>

    </thead>

    <tbody>
        @forelse($info->specializedTrainings as $r)
        <tr>
            <td>{{ $r->duration_study ?: '' }}</td>
            <td>{{ $r->register_date ?: '' }}</td>
            <td>{{ $r->specialty_type ?: '' }}</td>
            <td>{{ $r->specialty ?: '' }}</td>
            <td>{{ $r->education_level ?: '' }}</td>
            <td>{{ $r->institution_name ?: '' }}</td>
            <td>{{ $r->is_domestic ?: '' }}</td>
            <td>{{ $r->is_overseas ?: '' }}</td>
           
        </tr>
        @empty
        <tr>
            <td colspan="8" class="empty" style="padding:14px;">
                មិនទាន់មានទិន្នន័យ
            </td>
        </tr>
        @endforelse
    </tbody>
</table>


{{-- ═══════════════════════════════════════════════════════════ --}}
{{-- ░░░░░░░░░░░░░░░░░  PAGE 5  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ --}}
{{-- ═══════════════════════════════════════════════════════════ --}}

<div class="page-break"></div>

<div class="sec-bar2 title-moul">V. ព័ត៌មានអំពីបេសកម្ម</div>

<table class="data-tbl">
    <thead>
        <tr>
            <th style="width:12%;">ថ្ងៃចាប់ផ្ដើម</th>
            <th style="width:10%;">រយៈពេល</th>
            <th style="width:16%;">ឈ្មោះបេសកម្ម</th>
            <th style="width:16%;">ប្រភេទបេសកម្ម</th>
            <th style="width:12%;">កងឯកភាពបំពេញ</th>
            <th style="width:24%;">តួនាទីអំឡុងបំពេញ</th>
            <th style="width:10%;">លទ្ធផល</th>
        </tr>

    </thead>

    <tbody>
        @forelse($info->missions as $r)
        <tr>
            <td>{{ $fmt($r->start_date) }}</td>
            <td>{{ $r->duration ?: '' }}</td>
            <td>{{ $r->mission_name ?: '' }}</td>
            <td>{{ $r->mission_type ?: '' }}</td>
            <td>{{ $r->assigned_unit ?: '' }}</td>
            <td>{{ $r->role_during_mission ?: '' }}</td>
            <td>{{ $r->result ?: '' }}</td>
           
        </tr>
        @empty
        <tr>
            <td colspan="7" class="empty" style="padding:14px;">
                មិនទាន់មានទិន្នន័យ
            </td>
        </tr>
        @endforelse
    </tbody>
</table>


{{-- ═══════════════════════════════════════════════════════════ --}}
{{-- ░░░░░░░░░░░░░░░░░  PAGE 6  ░░░░░░░░░░░░░░░░░░░░░░░ --}}
{{-- ═══════════════════════════════════════════════════════════ --}}

<div class="page-break"></div>

<div class="sec-bar2 title-moul">VI. ព័ត៌មានអំពីសុខភាព</div>

@php
    // បើ health ជា hasMany → យក record ដំបូង; បើ hasOne → ប្រើផ្ទាល់
    $h = $info->health instanceof \Illuminate\Support\Collection
        ? $info->health->first()
        : $info->health;
@endphp

<table class="kv">
    {{-- ថ្ងៃពិនិត្យសុខភាព --}}
    <tr>
        <td class="lbl">ថ្ងៃពិនិត្យសុខភាព</td>
        <td class="val" colspan="5">{{ $fmt($h?->health_check_date) }}</td>
    </tr>

    {{-- ទម្ងន់ + កម្ពស់ + BMI (៣ field ក្នុងជួរតែ ១) --}}
    <tr>
        <td class="lbl">- ទម្ងន់</td>
        <td class="val" style="width:120px;">{{ $h?->weight ?? '' }} <span class="sub">kg</span></td>
        <td class="lbl">- កម្ពស់</td>
        <td class="val" style="width:120px;">{{ $h?->height ?? '' }} <span class="sub">cm</span></td>
        <td class="lbl">- កំរិតស្តង់ដា</td>
        <td class="val" style="width:120px;">{{ $h?->bmi_standard_level ?? '' }} <span class="sub">BMI</span></td>
    </tr>

    {{-- សម្ពាធឈាម + កាយសម្បទា --}}
    <tr>
        <td class="lbl">- សម្ពាធឈាម</td>
        <td class="val" colspan="2">{{ $h?->blood_pressure ?: '' }}</td>
        <td class="lbl">- កាយសម្បទា</td>
        <td class="val" colspan="2">{{ $h?->physical_condition ?: '' }}</td>
    </tr>

    {{-- វ៉ាក់សាំង --}}
    <tr>
        <td class="lbl">- វ៉ាក់សាំង</td>
        <td class="val" colspan="5">{{ $h?->vaccination ?: '' }}</td>
    </tr>

    {{-- ជំងឺប្រចាំកាយ --}}
    <tr>
        <td class="lbl">- ជំងឺប្រចាំកាយ</td>
        <td class="val" colspan="5">{{ $h?->chronic_disease ?: 'គ្មាន' }}</td>
    </tr>

    {{-- ថ្នាំប្រចាំកាយ --}}
    <tr>
        <td class="lbl">- ថ្នាំប្រចាំកាយ</td>
        <td class="val" colspan="5">{{ $h?->regular_medication ?: 'គ្មាន' }}</td>
    </tr>

    {{-- គ្រូពេទ្យប្រចាំ --}}
    <tr>
        <td class="lbl">- គ្រូពេទ្យប្រចាំ</td>
        <td class="val" colspan="5">{{ $h?->assigned_doctor ?: 'គ្មាន' }}</td>
    </tr>

    {{-- ពិនិត្យសុខភាពបន្ទាប់ --}}
    <tr>
        <td class="lbl">- ពិនិត្យសុខភាពបន្ទាប់</td>
        <td class="val" colspan="5">{{ $fmt($h?->next_health_check_date) }}</td>
    </tr>
</table>

</body>
</html>