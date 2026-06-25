<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Health;
use Illuminate\Http\Request;

class HealthController extends Controller
{
    public function index(Request $request)
    {
        $query = Health::query()
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
            'personal_info_id'                  => 'nullable|integer|exists:personal_info,id',
            'records'                            => 'required|array|min:1',
            'records.*.id'                       => 'nullable|integer',
            'records.*.health_check_date'        => 'nullable|date',
            'records.*.weight'                   => 'nullable|numeric',
            'records.*.height'                   => 'nullable|numeric',
            'records.*.bmi_standard_level'        => 'nullable|numeric',
            'records.*.blood_pressure'           => 'nullable|string|max:50',
            'records.*.physical_condition'       => 'nullable|string|max:255',
            'records.*.vaccination'              => 'nullable|string',
            'records.*.chronic_disease'          => 'nullable|string',
            'records.*.regular_medication'       => 'nullable|string',
            'records.*.assigned_doctor'          => 'nullable|string|max:255',
            'records.*.next_health_check_date'   => 'nullable|date',
        ]);

        $savedIds = [];

        foreach ($request->records as $row) {
            $payload = [
                'health_check_date'      => $row['health_check_date'] ?? null,
                'weight'                 => $row['weight'] ?? null,
                'height'                 => $row['height'] ?? null,
                'bmi_standard_level'     => $row['bmi_standard_level'] ?? null,
                'blood_pressure'         => $row['blood_pressure'] ?? null,
                'physical_condition'     => $row['physical_condition'] ?? null,
                'vaccination'            => $row['vaccination'] ?? null,
                'chronic_disease'        => $row['chronic_disease'] ?? null,
                'regular_medication'     => $row['regular_medication'] ?? null,
                'assigned_doctor'        => $row['assigned_doctor'] ?? null,
                'next_health_check_date' => $row['next_health_check_date'] ?? null,
            ];

            if (!empty($row['id'])) {
                $record = Health::where('id', $row['id'])
                    ->where('personal_info_id', $personalInfoId)
                    ->first();

                if ($record) {
                    $record->update($payload);
                    $savedIds[] = $record->id;
                    continue;
                }
            }

            $payload['personal_info_id'] = $personalInfoId;
            $record = Health::create($payload);
            $savedIds[] = $record->id;
        }

        return response()->json([
            'message' => 'Saved successfully',
            'ids'     => $savedIds,
        ]);
    }

    public function show(Request $request, $id)
    {
        $record = Health::with(['personalInfo' => function ($q) {
                $q->select('id', 'id_number', 'name_kh', 'name', 'phone_number', 'military_id', 'civilian_id');
            }])
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($record);
    }

    public function update(Request $request, $id)
    {
        $record = Health::where('id', $id)->firstOrFail();

        $data = $request->validate([
            'health_check_date'     => 'nullable|date',
            'weight'                => 'nullable|numeric',
            'height'                => 'nullable|numeric',
            'bmi_standard_level'    => 'nullable|numeric',
            'blood_pressure'        => 'nullable|string|max:50',
            'physical_condition'    => 'nullable|string|max:255',
            'vaccination'           => 'nullable|string',
            'chronic_disease'       => 'nullable|string',
            'regular_medication'    => 'nullable|string',
            'assigned_doctor'       => 'nullable|string|max:255',
            'next_health_check_date'=> 'nullable|date',
        ]);

        $record->update($data);
        return response()->json($record);
    }

    public function destroy(Request $request, $id)
    {
        $record = Health::where('id', $id)->firstOrFail();

        $record->delete();
        return response()->json(['message' => 'Deleted successfully.']);
    }
}
