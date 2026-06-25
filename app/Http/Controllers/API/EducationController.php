<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Education;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    public function index(Request $request)
    {
        $query = Education::query()
            ->with(['personalInfo' => function ($q) {
                $q->select('id', 'id_number', 'name_kh', 'name', 'phone_number', 'military_id', 'civilian_id');
            }]);

        if ($request->filled('personal_info_id')) {
            $query->where('personal_info_id', $request->personal_info_id);
        }

        $records = $query->orderBy('personal_info_id')->orderBy('id')->get();

        $grouped = $records
            ->groupBy('personal_info_id')
            ->map(function ($group) {
                return [
                    'personal_info' => $group->first()->personalInfo,
                    'records'       => $group->map(fn($r) => collect($r)->except('personal_info'))->values(),
                ];
            })
            ->values();

        return response()->json($grouped);
    }

    public function store(Request $request)
    {
        $personalInfoId = $request->filled('personal_info_id')
            ? $request->personal_info_id
            : $this->existingPersonalInfoId($request);

        $request->validate([
            'personal_info_id'              => 'nullable|integer|exists:personal_info,id',
            'records'                       => 'required|array|min:1',
            'records.*.id'                  => 'nullable|integer',
            'records.*.from_year'           => 'nullable',
            'records.*.to_year'             => 'nullable',
            'records.*.duration'            => 'nullable|string|max:50',
            'records.*.education_level'     => 'nullable|string|max:255',
            'records.*.course_name'         => 'nullable|string|max:255',
            'records.*.institution_name'    => 'nullable|string|max:255',
            'records.*.is_domestic'         => 'nullable|string|max:255',
            'records.*.is_overseas'         => 'nullable|string|max:255',
        ]);

        $savedIds = [];

        foreach ($request->records as $row) {
            $row['from_year'] = $this->normalizeYear($row['from_year'] ?? null);
            $row['to_year'] = $this->normalizeYear($row['to_year'] ?? null);

            if (!empty($row['id'])) {
                $record = Education::where('id', $row['id'])
                    ->where('personal_info_id', $personalInfoId)
                    ->first();

                if ($record) {
                    $record->update([
                        'from_year'        => $row['from_year'],
                        'to_year'          => $row['to_year'],
                        'duration'         => $row['duration'] ?? null,
                        'education_level'  => $row['education_level'] ?? null,
                        'course_name'      => $row['course_name'] ?? null,
                        'institution_name' => $row['institution_name'] ?? null,
                        'is_domestic'      => $row['is_domestic'] ?? null,
                        'is_overseas'      => $row['is_overseas'] ?? null,
                    ]);
                    $savedIds[] = $record->id;
                    continue;
                }
            }

            $record = Education::create([
                'personal_info_id' => $personalInfoId,
                'from_year'        => $row['from_year'],
                'to_year'          => $row['to_year'],
                'duration'         => $row['duration'] ?? null,
                'education_level'  => $row['education_level'] ?? null,
                'course_name'      => $row['course_name'] ?? null,
                'institution_name' => $row['institution_name'] ?? null,
                'is_domestic'      => $row['is_domestic'] ?? null,
                'is_overseas'      => $row['is_overseas'] ?? null,
            ]);
            $savedIds[] = $record->id;
        }

        return response()->json([
            'message' => 'Saved successfully',
            'ids'     => $savedIds,
        ]);
    }

    public function show(Request $request, $id)
    {
        $record = Education::with(['personalInfo' => function ($q) {
                $q->select('id', 'id_number', 'name_kh', 'name', 'phone_number', 'military_id', 'civilian_id');
            }])
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($record);
    }

    public function update(Request $request, $id)
    {
        $record = Education::where('id', $id)->firstOrFail();

        $data = $request->validate([
            'from_year'        => 'nullable',
            'to_year'          => 'nullable',
            'duration'         => 'nullable|string|max:50',
            'education_level'  => 'nullable|string|max:255',
            'course_name'      => 'nullable|string|max:255',
            'institution_name' => 'nullable|string|max:255',
            'is_domestic'      => 'nullable|string|max:255',
            'is_overseas'      => 'nullable|string|max:255',
        ]);
        $data['from_year'] = $this->normalizeYear($data['from_year'] ?? null);
        $data['to_year'] = $this->normalizeYear($data['to_year'] ?? null);

        $record->update($data);
        return response()->json($record);
    }

    public function destroy(Request $request, $id)
    {
        $record = Education::where('id', $id)->firstOrFail();

        $record->delete();
        return response()->json(['message' => 'Deleted successfully.']);
    }

    /**
     * Years are sometimes entered using Khmer numerals (e.g. ១៩៩៩); translate
     * them to Arabic digits so the integer cast below succeeds.
     */
    private function normalizeYear($value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        $khmer = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
        $arabic = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        return (int) trim(str_replace($khmer, $arabic, (string) $value));
    }
}
