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

        $fontdata = $defaultFontData + [
            'notosanskhmer' => ['R' => 'KhmerOSSiemreap.ttf', 'useOTL' => 0xFF, 'useKashida' => 75],
        ];
        if (file_exists(storage_path('fonts/Moul-Regular.ttf'))) {
            $fontdata['moul'] = ['R' => 'Moul-Regular.ttf', 'useOTL' => 0xFF, 'useKashida' => 75];
        }

        $mpdf = new Mpdf([
            'mode'          => 'utf-8',
            'format'        => 'A4',
            'default_font'  => 'notosanskhmer',
            'fontDir'       => array_merge($defaultFontDirs, [storage_path('fonts')]),
            'fontdata'      => $fontdata,
            'tempDir'       => storage_path('mpdf_tmp'),
            'useDictionaryLBR' => false,
            'margin_top'    => 16,
            'margin_bottom' => 20,
            'margin_header' => 10,
            'margin_footer' => 10,
            'margin_left'   => 10,
            'margin_right'  => 10,
        ]);

        $headerHtml = '<p 
            style="font-family: moul; 
            font-size: 10px; 
            font-weight: normal; 
            color: #008DDA; 
            margin: 0; 
            padding: 0; 
            line-height: 1.4;">
            បញ្ជាការដ្ឋានកងទ័ពជើងទឹក <span style="font-family: dejavuserif; font-weight: bold;">/ ROYAL CAMBODIAN NAVY</span>
        </p>';

        $footerHtml = '<p 
            style="font-family: moul;
            font-weight: 300;
            font-size: 9px; 
            color: #008DDA;
            text-align: right; 
            border-bottom: 2px solid #1F3864; 
            padding-bottom: 3px; margin: 0;">
            ស្នងការដ្ឋាន ប្រតិបត្តិការការសឹក <em style="font-family: Noto Sans Khmer; ">/ OPERATIONS DIVISION</em>
        </p>';

        $mpdf->SetHTMLHeader($headerHtml);
        $mpdf->SetHTMLFooter($footerHtml);
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
