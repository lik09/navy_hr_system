<?php

namespace App\Http\Controllers\API;

use App\Exports\PersonnelExport;
use App\Exports\PersonnelRosterExport;
use App\Http\Controllers\Controller;
use App\Models\PersonalInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Mpdf\Config\ConfigVariables;
use Mpdf\Config\FontVariables;
use Mpdf\Mpdf;

class PersonnelExportController extends Controller
{
    protected function loadPersonalInfo(Request $request, $id): PersonalInfo
    {
        return PersonalInfo::with([
            'militaryInfo.militaryRank',
            'militaryInfo.position',
            'militaryInfo.unit',
            'militaryInfo.militaryUnit',
            'militaryInfo.educationLevel',
            'militaryInfo.militarySpecialty',
            'familyInfo.children',
            'serviceHistories',
            'education',
            'specializedTrainings',
            'missions',
            'health',
        ])->findOrFail($id);
    }

    private function renderPdf(string $view, array $data = []): string
    {
        $html = view($view, $data)->render();

        $defaultFontDirs = (new ConfigVariables())->getDefaults()['fontDir'];
        $defaultFontData = (new FontVariables())->getDefaults()['fontdata'];

        $mpdf = new Mpdf([
            'mode'         => 'utf-8',
            'format'       => 'A4',
            'default_font' => 'notosanskhmer',
            'fontDir'      => array_merge($defaultFontDirs, [storage_path('fonts')]),
            'fontdata'     => $defaultFontData + [
                'notosanskhmer' => [
                    'R'          => 'KhmerOSSiemreap.ttf',
                    'useOTL'     => 0xFF,
                    'useKashida' => 75,
                ],
            ],
            'tempDir'      => storage_path('mpdf_tmp'),
        ]);

        $mpdf->WriteHTML($html);

        return $mpdf->Output('', \Mpdf\Output\Destination::STRING_RETURN);
    }

    public function pdf(Request $request, $id)
    {
        try {
            $info     = $this->loadPersonalInfo($request, $id);
            $content  = $this->renderPdf('exports.personnel-pdf', ['info' => $info]);
            $filename = "personnel-{$info->name_kh}-{$info->id_number}.pdf";

            Log::info('pdf generated: ' . strlen($content) . ' bytes');

            return response()->json([
                'pdf'      => base64_encode($content),
                'filename' => $filename,
            ]);

        } catch (\Throwable $e) {
            Log::error('pdf error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Failed to generate PDF. Please try again.'], 500);
        }
    }


    public function roster()
    {
        try {
            $people = PersonalInfo::with([
                'militaryInfo.militaryRank',
                'militaryInfo.position',
                'militaryInfo.unit',
                'militaryInfo.militaryUnit',
                'militaryInfo.educationLevel',
                'militaryInfo.militarySpecialty',
                'familyInfo',
            ])->orderByDesc('id')->get();

            return Excel::download(
                new PersonnelRosterExport($people),
                'personnel-roster-' . now()->format('Ymd') . '.xlsx'
            );
        } catch (\Throwable $e) {
            Log::error('roster export error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to generate Excel. Please try again.'], 500);
        }
    }
}
