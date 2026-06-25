<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SpecializedTraining;
use Illuminate\Http\Request;

class SpecializedTrainingController extends Controller
{
    public function index(Request $request)
    {
        $query = SpecializedTraining::query()
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
            'personal_info_id'           => 'nullable|integer|exists:personal_info,id',
            'records'                    => 'required|array|min:1',
            'records.*.id'               => 'nullable|integer',
            'records.*.duration_study'   => 'nullable|string|max:100',
            'records.*.register_date'    => 'nullable|string|max:50',
            'records.*.specialty_type'   => 'nullable|string|max:255',
            'records.*.specialty'        => 'nullable|string|max:255',
            'records.*.education_level'  => 'nullable|string|max:255',
            'records.*.institution_name' => 'nullable|string|max:255',
            'records.*.is_domestic'      => 'nullable|string|max:255',
            'records.*.is_overseas'      => 'nullable|string|max:255',
        ]);

        $savedIds = [];

        foreach ($request->records as $row) {
            if (!empty($row['id'])) {
                $record = SpecializedTraining::where('id', $row['id'])
                    ->where('personal_info_id', $personalInfoId)
                    ->first();

                if ($record) {
                    $record->update([
                        'duration_study'   => $row['duration_study'] ?? null,
                        'register_date'    => $row['register_date'] ?? null,
                        'specialty_type'   => $row['specialty_type'] ?? null,
                        'specialty'        => $row['specialty'] ?? null,
                        'education_level'  => $row['education_level'] ?? null,
                        'institution_name' => $row['institution_name'] ?? null,
                        'is_domestic'      => $row['is_domestic'] ?? null,
                        'is_overseas'      => $row['is_overseas'] ?? null,
                    ]);
                    $savedIds[] = $record->id;
                    continue;
                }
            }

            $record = SpecializedTraining::create([
                'personal_info_id' => $personalInfoId,
                'duration_study'   => $row['duration_study'] ?? null,
                'register_date'    => $row['register_date'] ?? null,
                'specialty_type'   => $row['specialty_type'] ?? null,
                'specialty'        => $row['specialty'] ?? null,
                'education_level'  => $row['education_level'] ?? null,
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
        $record = SpecializedTraining::with(['personalInfo' => function ($q) {
                $q->select('id', 'id_number', 'name_kh', 'name', 'phone_number', 'military_id', 'civilian_id');
            }])
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($record);
    }

    public function update(Request $request, $id)
    {
        $record = SpecializedTraining::where('id', $id)->firstOrFail();

        $data = $request->validate([
            'duration_study'   => 'nullable|string|max:100',
            'register_date'    => 'nullable|string|max:50',
            'specialty_type'   => 'nullable|string|max:255',
            'specialty'        => 'nullable|string|max:255',
            'education_level'  => 'nullable|string|max:255',
            'institution_name' => 'nullable|string|max:255',
            'is_domestic'      => 'nullable|string|max:255',
            'is_overseas'      => 'nullable|string|max:255',
        ]);

        $record->update($data);
        return response()->json($record);
    }

    public function destroy(Request $request, $id)
    {
        $record = SpecializedTraining::where('id', $id)->firstOrFail();

        $record->delete();
        return response()->json(['message' => 'Deleted successfully.']);
    }
}
