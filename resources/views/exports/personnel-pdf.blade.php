<!DOCTYPE html>
<html lang="km">
<head>
<meta charset="utf-8">
<?php
    $khmerRegularUri = 'file://' . str_replace('\\', '/', resource_path('fonts/Battambang-Regular.ttf'));
    $khmerBoldUri = 'file://' . str_replace('\\', '/', resource_path('fonts/Battambang-Bold.ttf'));
?>
<style>
    @font-face {
        font-family: 'Khmer';
        font-style: normal;
        font-weight: normal;
        src: url('{{ $khmerRegularUri }}') format('truetype');
    }
    @font-face {
        font-family: 'Khmer';
        font-style: normal;
        font-weight: bold;
        src: url('{{ $khmerBoldUri }}') format('truetype');
    }

    @page {
        size: A4 portrait;
        margin: 130px 36px 90px 36px;
    }

    * { font-family: 'Khmer', sans-serif; }

    body { font-size: 12px; color: #222; }

    .pdf-header {
        position: fixed;
        top: -100px;
        left: 0px;
        right: 0px;
        text-align: center;
    }
    .pdf-header .line { border-top: 2px solid #002366; margin: 4px 0; }
    .pdf-header .red  { color: #c00000; font-weight: bold; font-size: 15px; }
    .pdf-header .blue { color: #002366; font-weight: bold; font-size: 13px; }

    .pdf-footer {
        position: fixed;
        bottom: -70px;
        left: 0px;
        right: 0px;
        text-align: center;
    }
    .pdf-footer .line { border-top: 2px solid #002366; margin-bottom: 4px; }
    .pdf-footer .blue { color: #002366; font-weight: bold; font-size: 11px; }
    .pdf-footer .pagenum:before { content: "ទំព័រ " counter(page); color: #c00000; font-size: 10px; }

    .section-title {
        background: #002366;
        color: #fff;
        padding: 6px 12px;
        font-size: 15px;
        font-weight: bold;
        margin-bottom: 0;
    }

    table.form-tbl { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    table.form-tbl td {
        border: 1px solid #bbb;
        padding: 6px 8px;
        font-size: 12px;
        vertical-align: middle;
    }
    table.form-tbl td.lbl {
        background: #f0f4f8;
        font-weight: bold;
        white-space: nowrap;
        width: 150px;
    }

    table.data-tbl { width: 100%; border-collapse: collapse; }
    table.data-tbl th, table.data-tbl td {
        border: 1px solid #bbb;
        padding: 5px 6px;
        font-size: 11px;
        text-align: center;
    }
    table.data-tbl th { background: #002366; color: #fff; }

    .page-break { page-break-after: always; }
    .empty-note { padding: 10px; text-align: center; color: #888; }
</style>
</head>
<body>

<div class="pdf-header">
    <div class="red">បញ្ជាការដ្ឋានកងទ័ពជើងទឹក / ROYAL CAMBODIAN NAVY</div>
    <div class="line"></div>
    <div class="blue">ស្នងការដ្ឋានប្រតិបត្តិការស្ឹក / OPERATIONS DIVISION</div>
    <div class="line"></div>
</div>

<div class="pdf-footer">
    <div class="line"></div>
    <div class="blue">ស្នងការដ្ឋានប្រតិបត្តិការស្ឹក / OPERATIONS DIVISION &nbsp;&nbsp; <span class="pagenum"></span></div>
</div>

@php
    $fmt = fn($d) => $d ? \Illuminate\Support\Carbon::parse($d)->format('d/m/Y') : '—';
    $loc = fn(...$p) => ($p = array_filter($p)) ? implode(' / ', $p) : '—';
    $mi = $info->militaryInfo;
    $fi = $info->familyInfo;
@endphp

{{-- ══════════════ PAGE 1 — GENERAL / MILITARY / FAMILY INFO ══════════════ --}}
<div class="page-break">
    <div class="section-title">I. ព័ត៌មានទូទៅ / GENERAL INFORMATION</div>
    <table class="form-tbl">
        <tr>
            <td class="lbl">គោន្តនាម-នាម</td><td>{{ $info->name_kh ?: '—' }}</td>
            <td class="lbl">ភេទ</td><td>{{ $info->gender === 'male' ? 'ប្រុស' : ($info->gender === 'female' ? 'ស្រី' : '—') }}</td>
        </tr>
        <tr>
            <td class="lbl">អក្សរឡាតាំង</td><td>{{ $info->name ?: '—' }}</td>
            <td class="lbl">អត្តលេខ</td><td>{{ $info->id_number ?: '—' }}</td>
        </tr>
        <tr>
            <td class="lbl">ថ្ងៃខែឆ្នាំកំណើត</td><td colspan="3">{{ $fmt($info->date_of_birth) }}</td>
        </tr>
        <tr>
            <td class="lbl">លេខអត្ត.យោធា</td><td colspan="3">{{ $info->military_id ?: '—' }}</td>
        </tr>
        <tr>
            <td class="lbl">លេខអត្ត.សុីវិល</td><td colspan="3">{{ $info->civilian_id ?: '—' }}</td>
        </tr>
        <tr>
            <td class="lbl">ទីកន្លែងកំណើត</td>
            <td colspan="3">{{ $loc($info->birth_commune, $info->birth_district, $info->birth_province) }}</td>
        </tr>
        <tr>
            <td class="lbl">ទីលំនៅបច្ចុប្បន្ន</td>
            <td colspan="3">{{ $loc($info->current_commune, $info->current_district, $info->current_province) }}</td>
        </tr>
        <tr>
            <td class="lbl">ទូរស័ព្ទ</td><td colspan="3">{{ $info->phone_number ?: '—' }}</td>
        </tr>
    </table>

    <div class="section-title">II. ព័ត៌មានយោធា / MILITARY INFORMATION</div>
    <table class="form-tbl">
        <tr><td class="lbl">ថ្ងៃខែចូលទ័ព</td><td colspan="3">{{ $fmt($mi?->military_enlistment_date) }}</td></tr>
        <tr><td class="lbl">ឋានន្តរសក្តិ</td><td colspan="3">{{ $mi?->military_rank ?: '—' }}</td></tr>
        <tr><td class="lbl">មុខតំណែង</td><td colspan="3">{{ $mi?->position ?: '—' }}</td></tr>
        <tr><td class="lbl">អង្គភាព</td><td colspan="3">{{ $mi?->unit ?: '—' }}</td></tr>
        <tr><td class="lbl">កងឯកភាព</td><td colspan="3">{{ $mi?->military_unit ?: '—' }}</td></tr>
        <tr><td class="lbl">កំរិតវប្បធម៍</td><td colspan="3">{{ $mi?->education_level ?: '—' }}</td></tr>
        <tr><td class="lbl">ជំនាញ-ឯកទេសយោធា</td><td colspan="3">{{ $mi?->military_specialty ?: '—' }}</td></tr>
        <tr><td class="lbl">ថ្ងៃខែប្រកាសស័ក្តចុងក្រោយ</td><td colspan="3">{{ $fmt($mi?->last_date_military_rank) }}</td></tr>
        <tr><td class="lbl">មុខតំណែងចុងក្រោយ</td><td colspan="3">{{ $mi?->last_position ?: '—' }}</td></tr>
    </table>

    <div class="section-title">III. ព័ត៌មានគ្រួសារ / FAMILY INFORMATION</div>
    <table class="form-tbl">
        <tr><td class="lbl">ស្ថានភាពគ្រួសារ</td><td colspan="3">{{ $fi?->marital_status ? 'មានគ្រួសារ' : 'នៅលីវ' }}</td></tr>
        @if($fi?->marital_status)
        <tr>
            <td class="lbl">គោន្តនាម-នាម</td><td>{{ $fi->spouse_name ?: '—' }}</td>
            <td class="lbl">ប្ដី/ប្រពន្ធ</td><td>{{ $fi->spouse_type ? 'ប្រពន្ធ' : 'ប្ដី' }}</td>
        </tr>
        <tr><td class="lbl">ថ្ងៃខែឆ្នាំកំណើត</td><td colspan="3">{{ $fmt($fi->spouse_dob) }}</td></tr>
        <tr>
            <td class="lbl">ទីកន្លែងកំណើត</td>
            <td colspan="3">{{ $loc($fi->spouse_birth_commune, $fi->spouse_birth_district, $fi->spouse_birth_province) }}</td>
        </tr>
        <tr>
            <td class="lbl">ទីលំនៅបច្ចុប្បន្ន</td>
            <td colspan="3">{{ $loc($fi->spouse_current_commune, $fi->spouse_current_district, $fi->spouse_current_province) }}</td>
        </tr>
        <tr>
            <td class="lbl">លិខិតរៀបអាពាហ៍ពិពាហ៍</td>
            <td colspan="3">{{ $fi->marriage_certificate_number ?: '—' }} ({{ $fmt($fi->marriage_certificate_date) }})</td>
        </tr>
        @endif
        <tr>
            <td class="lbl">ចំនួនកូន</td>
            <td colspan="3">{{ $fi?->number_of_children ?? 0 }} (ប្រុស ៖ {{ $fi?->male_children_count ?? 0 }}, ស្រី ៖ {{ $fi?->female_children_count ?? 0 }})</td>
        </tr>
        @foreach($fi?->children ?? [] as $i => $child)
        <tr>
            <td class="lbl">{{ $i + 1 }}. ឈ្មោះកូន</td><td>{{ $child->name ?: '—' }}</td>
            <td class="lbl">ថ្ងៃខែឆ្នាំកំណើត</td><td>{{ $fmt($child->date_of_birth) }}</td>
        </tr>
        @endforeach
    </table>
</div>

{{-- ══════════════ PAGE 2 — MILITARY SERVICE HISTORY ══════════════ --}}
<div class="page-break">
    <div class="section-title">IV. ប្រវត្តិសេវាកម្មយោធា / MILITARY SERVICE HISTORY</div>
    @if($info->serviceHistories->isEmpty())
        <div class="empty-note">មិនទាន់មានទិន្នន័យ</div>
    @else
    <table class="data-tbl">
        <thead>
        <tr>
            <th>ល.រ</th><th>ថ្ងៃចូល</th><th>ថ្ងៃចេញ</th><th>ឋានន្តរសក្តិ</th>
            <th>មុខតំណែង</th><th>ការិយាល័យ</th><th>កងឯកភាព</th><th>ទីកន្លែង</th>
        </tr>
        </thead>
        <tbody>
        @foreach($info->serviceHistories as $i => $r)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $fmt($r->start_date) }}</td>
            <td>{{ $r->end_date ?: '—' }}</td>
            <td>{{ $r->military_rank ?: '—' }}</td>
            <td>{{ $r->position ?: '—' }}</td>
            <td>{{ $r->office ?: '—' }}</td>
            <td>{{ $r->military_unit ?: '—' }}</td>
            <td>{{ $r->place ?: '—' }}</td>
        </tr>
        @endforeach
        </tbody>
    </table>
    @endif
</div>

{{-- ══════════════ PAGE 3 — EDUCATION ══════════════ --}}
<div class="page-break">
    <div class="section-title">V. ការសិក្សា / EDUCATION</div>
    @if($info->education->isEmpty())
        <div class="empty-note">មិនទាន់មានទិន្នន័យ</div>
    @else
    <table class="data-tbl">
        <thead>
        <tr>
            <th>ល.រ</th><th>ពីឆ្នាំ</th><th>ដល់ឆ្នាំ</th><th>រយៈពេល</th><th>កំរិតវប្បធម៍</th>
            <th>ឈ្មោះវគ្គសិក្សា</th><th>គ្រឹះស្ថានសិក្សា</th><th>ក្នុងប្រទេស</th><th>ក្រៅប្រទេស</th>
        </tr>
        </thead>
        <tbody>
        @foreach($info->education as $i => $r)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $r->from_year ?: '—' }}</td>
            <td>{{ $r->to_year ?: '—' }}</td>
            <td>{{ $r->duration ?: '—' }}</td>
            <td>{{ $r->education_level ?: '—' }}</td>
            <td>{{ $r->course_name ?: '—' }}</td>
            <td>{{ $r->institution_name ?: '—' }}</td>
            <td>{{ $r->is_domestic ?: '—' }}</td>
            <td>{{ $r->is_overseas ?: '—' }}</td>
        </tr>
        @endforeach
        </tbody>
    </table>
    @endif
</div>

{{-- ══════════════ PAGE 4 — SPECIALIZED TRAINING ══════════════ --}}
<div class="page-break">
    <div class="section-title">VI. ការបង្ហាត់បង្រៀនឯកទេស / SPECIALIZED TRAINING</div>
    @if($info->specializedTrainings->isEmpty())
        <div class="empty-note">មិនទាន់មានទិន្នន័យ</div>
    @else
    <table class="data-tbl">
        <thead>
        <tr>
            <th>ល.រ</th><th>រយៈពេលសិក្សា</th><th>ថ្ងៃចូលរៀន</th><th>ប្រភេទឯកទេស</th>
            <th>ឯកទេស</th><th>កំរិតវប្បធម៍</th><th>គ្រឹះស្ថានសិក្សា</th><th>ក្នុងប្រទេស</th><th>ក្រៅប្រទេស</th>
        </tr>
        </thead>
        <tbody>
        @foreach($info->specializedTrainings as $i => $r)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $r->duration_study ?: '—' }}</td>
            <td>{{ $r->register_date ?: '—' }}</td>
            <td>{{ $r->specialty_type ?: '—' }}</td>
            <td>{{ $r->specialty ?: '—' }}</td>
            <td>{{ $r->education_level ?: '—' }}</td>
            <td>{{ $r->institution_name ?: '—' }}</td>
            <td>{{ $r->is_domestic ?: '—' }}</td>
            <td>{{ $r->is_overseas ?: '—' }}</td>
        </tr>
        @endforeach
        </tbody>
    </table>
    @endif
</div>

{{-- ══════════════ PAGE 5 — MISSIONS ══════════════ --}}
<div class="page-break">
    <div class="section-title">VII. បេសកកម្ម / MISSIONS</div>
    @if($info->missions->isEmpty())
        <div class="empty-note">មិនទាន់មានទិន្នន័យ</div>
    @else
    <table class="data-tbl">
        <thead>
        <tr>
            <th>ល.រ</th><th>ថ្ងៃចាប់ផ្តើម</th><th>រយៈពេល</th><th>ឈ្មោះបេសកកម្ម</th>
            <th>ប្រភេទបេសកកម្ម</th><th>អង្គភាពចំណាត់ការ</th><th>តួនាទីក្នុងបេសកកម្ម</th><th>លទ្ធផល</th>
        </tr>
        </thead>
        <tbody>
        @foreach($info->missions as $i => $r)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $fmt($r->start_date) }}</td>
            <td>{{ $r->duration ?: '—' }}</td>
            <td>{{ $r->mission_name ?: '—' }}</td>
            <td>{{ $r->mission_type ?: '—' }}</td>
            <td>{{ $r->assigned_unit ?: '—' }}</td>
            <td>{{ $r->role_during_mission ?: '—' }}</td>
            <td>{{ $r->result ?: '—' }}</td>
        </tr>
        @endforeach
        </tbody>
    </table>
    @endif
</div>

{{-- ══════════════ PAGE 6 — HEALTH ══════════════ --}}
<div>
    <div class="section-title">VIII. សុខភាព / HEALTH</div>
    @if($info->health->isEmpty())
        <div class="empty-note">មិនទាន់មានទិន្នន័យ</div>
    @else
    <table class="data-tbl">
        <thead>
        <tr>
            <th>ល.រ</th><th>ថ្ងៃពិនិត្យ</th><th>ទម្ងន់</th><th>កម្ពស់</th><th>BMI</th>
            <th>សម្ពាធឈាម</th><th>ស្ថានភាពរាងកាយ</th><th>ការចាក់វ៉ាក់សាំង</th>
            <th>ជំងឺរ៉ាំរ៉ៃ</th><th>ការប្រើថ្នាំទៀងទាត់</th><th>វេជ្ជបណ្ឌិតទទួលបន្ទុក</th><th>ថ្ងៃពិនិត្យលើកក្រោយ</th>
        </tr>
        </thead>
        <tbody>
        @foreach($info->health as $i => $r)
        <tr>
            <td>{{ $i + 1 }}</td>
            <td>{{ $fmt($r->health_check_date) }}</td>
            <td>{{ $r->weight ?? '—' }}</td>
            <td>{{ $r->height ?? '—' }}</td>
            <td>{{ $r->bmi_standard_level ?? '—' }}</td>
            <td>{{ $r->blood_pressure ?: '—' }}</td>
            <td>{{ $r->physical_condition ?: '—' }}</td>
            <td>{{ $r->vaccination ?: '—' }}</td>
            <td>{{ $r->chronic_disease ?: '—' }}</td>
            <td>{{ $r->regular_medication ?: '—' }}</td>
            <td>{{ $r->assigned_doctor ?: '—' }}</td>
            <td>{{ $fmt($r->next_health_check_date) }}</td>
        </tr>
        @endforeach
        </tbody>
    </table>
    @endif
</div>

</body>
</html>
