<?php

namespace App\Http\Controllers\API;

use App\Exports\PersonnelExport;
use App\Http\Controllers\Controller;
use App\Models\PersonalInfo;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class PersonnelExportController extends Controller
{
    protected function loadPersonalInfo(Request $request, $id): PersonalInfo
    {
        return PersonalInfo::with([
            'militaryInfo',
            'familyInfo.children',
            'serviceHistories',
            'education',
            'specializedTrainings',
            'missions',
            'health',
        ])->findOrFail($id);
    }

    public function pdf(Request $request, $id)
{
    $info = $this->loadPersonalInfo($request, $id);

    $pdf = Pdf::loadView('exports.personnel-pdf', ['info' => $info])
        ->setPaper('a4', 'portrait');

    $filename = "personnel-{$info->id_number}.pdf";
    $content = $pdf->output();

    return response($content, 200, [
        'Content-Type'        => 'application/pdf',
        'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        'Content-Length'      => strlen($content),
        'Cache-Control'       => 'no-cache, no-store, must-revalidate',
        'Pragma'              => 'no-cache',
        'Expires'             => '0',
    ]);
}

    public function excel(Request $request, $id)
    {
        $info = $this->loadPersonalInfo($request, $id);

        return Excel::download(new PersonnelExport($info), "personnel-{$info->id_number}.xlsx");
    }
}
