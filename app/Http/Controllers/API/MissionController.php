<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use Illuminate\Http\Request;

class MissionController extends Controller
{
    public function index(Request $request)
    {
        $query = Mission::query()
            ->with(['personalInfo' => function ($q) {
                $q->select('id', 'id_number', 'name_kh', 'name', 'phone_number', 'military_id', 'civilian_id');
            }])
            ->whereHas('personalInfo', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            });

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
            : $this->ownedPersonalInfoId($request);

        $request->validate([
            'personal_info_id'                => 'nullable|integer|exists:personal_info,id',
            'records'                          => 'required|array|min:1',
            'records.*.id'                     => 'nullable|integer',
            'records.*.start_date'             => 'nullable|date',
            'records.*.duration'               => 'nullable|string|max:100',
            'records.*.mission_name'           => 'nullable|string|max:255',
            'records.*.mission_type'           => 'nullable|string|max:255',
            'records.*.assigned_unit'          => 'nullable|string|max:255',
            'records.*.role_during_mission'    => 'nullable|string|max:255',
            'records.*.result'                 => 'nullable|string|max:255',
        ]);

        $savedIds = [];

        foreach ($request->records as $row) {
            if (!empty($row['id'])) {
                $record = Mission::where('id', $row['id'])
                    ->where('personal_info_id', $personalInfoId)
                    ->first();

                if ($record) {
                    $record->update([
                        'start_date'          => $row['start_date'] ?? null,
                        'duration'            => $row['duration'] ?? null,
                        'mission_name'        => $row['mission_name'] ?? null,
                        'mission_type'        => $row['mission_type'] ?? null,
                        'assigned_unit'       => $row['assigned_unit'] ?? null,
                        'role_during_mission' => $row['role_during_mission'] ?? null,
                        'result'              => $row['result'] ?? null,
                    ]);
                    $savedIds[] = $record->id;
                    continue;
                }
            }

            $record = Mission::create([
                'personal_info_id'    => $personalInfoId,
                'start_date'          => $row['start_date'] ?? null,
                'duration'            => $row['duration'] ?? null,
                'mission_name'        => $row['mission_name'] ?? null,
                'mission_type'        => $row['mission_type'] ?? null,
                'assigned_unit'       => $row['assigned_unit'] ?? null,
                'role_during_mission' => $row['role_during_mission'] ?? null,
                'result'              => $row['result'] ?? null,
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
        $record = Mission::with(['personalInfo' => function ($q) {
                $q->select('id', 'id_number', 'name_kh', 'name', 'phone_number', 'military_id', 'civilian_id');
            }])
            ->where('id', $id)
            ->whereHas('personalInfo', fn($q) => $q->where('user_id', $request->user()->id))
            ->firstOrFail();

        return response()->json($record);
    }

    public function update(Request $request, $id)
    {
        $record = Mission::where('id', $id)
            ->whereHas('personalInfo', fn($q) => $q->where('user_id', $request->user()->id))
            ->firstOrFail();

        $data = $request->validate([
            'start_date'          => 'nullable|date',
            'duration'            => 'nullable|string|max:100',
            'mission_name'        => 'nullable|string|max:255',
            'mission_type'        => 'nullable|string|max:255',
            'assigned_unit'       => 'nullable|string|max:255',
            'role_during_mission' => 'nullable|string|max:255',
            'result'              => 'nullable|string|max:255',
        ]);

        $record->update($data);
        return response()->json($record);
    }

    public function destroy(Request $request, $id)
    {
        $record = Mission::where('id', $id)
            ->whereHas('personalInfo', fn($q) => $q->where('user_id', $request->user()->id))
            ->firstOrFail();

        $record->delete();
        return response()->json(['message' => 'Deleted successfully.']);
    }
}
