<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MilitaryServiceHistory;
use Illuminate\Http\Request;

class MilitaryServiceHistoryController extends Controller
{
    public function index(Request $request)
    {
        $query = MilitaryServiceHistory::query()
            ->with(['personalInfo' => function ($q) {
                $q->select('id', 'id_number', 'name_kh', 'name', 'phone_number', 'military_id', 'civilian_id');
            }]);

        if ($request->filled('personal_info_id')) {
            $query->where('personal_info_id', $request->personal_info_id);
        }

        $histories = $query->orderBy('personal_info_id')->orderBy('id')->get();

        // Group by personal_info_id → return array of groups
        $grouped = $histories
            ->groupBy('personal_info_id')
            ->map(function ($group) {
                return [
                    'personal_info' => $group->first()->personalInfo,
                    'histories'     => $group->map(fn($h) => collect($h)->except('personal_info'))->values(),
                ];
            })
            ->values();

        return response()->json($grouped);
    }

    public function store(Request $request)
    {
        // Accept personal_info_id from request OR fallback to owned
        $personalInfoId = $request->filled('personal_info_id')
            ? $request->personal_info_id
            : $this->existingPersonalInfoId($request);

        $request->validate([
            'personal_info_id'    => 'nullable|integer|exists:personal_info,id',
            'histories'           => 'required|array|min:1',
            'histories.*.id'          => 'nullable|integer',
            'histories.*.start_date'  => 'nullable|date',
            'histories.*.end_date'    => 'nullable|string|max:50',
            'histories.*.military_rank' => 'nullable|string|max:255',
            'histories.*.position'    => 'nullable|string|max:255',
            'histories.*.office'      => 'nullable|string|max:255',
            'histories.*.military_unit' => 'nullable|string|max:255',
            'histories.*.place'       => 'nullable|string|max:255',
        ]);

        $savedIds = [];

        foreach ($request->histories as $row) {
            if (!empty($row['id'])) {
                $record = MilitaryServiceHistory::where('id', $row['id'])
                    ->where('personal_info_id', $personalInfoId)
                    ->first();

                if ($record) {
                    $record->update([
                        'start_date'    => $row['start_date'] ?? null,
                        'end_date'      => $row['end_date'] ?? null,
                        'military_rank' => $row['military_rank'] ?? null,
                        'position'      => $row['position'] ?? null,
                        'office'        => $row['office'] ?? null,
                        'military_unit' => $row['military_unit'] ?? null,
                        'place'         => $row['place'] ?? null,
                    ]);
                    $savedIds[] = $record->id;
                    continue;
                }
            }

            $record = MilitaryServiceHistory::create([
                'personal_info_id' => $personalInfoId,
                'start_date'       => $row['start_date'] ?? null,
                'end_date'         => $row['end_date'] ?? null,
                'military_rank'    => $row['military_rank'] ?? null,
                'position'         => $row['position'] ?? null,
                'office'           => $row['office'] ?? null,
                'military_unit'    => $row['military_unit'] ?? null,
                'place'            => $row['place'] ?? null,
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
        $record = MilitaryServiceHistory::with(['personalInfo' => function ($q) {
                $q->select('id', 'id_number', 'name_kh', 'name', 'phone_number', 'military_id', 'civilian_id');
            }])
            ->where('id', $id)
            ->firstOrFail();

        return response()->json($record);
    }

    public function update(Request $request, $id)
    {
        $record = MilitaryServiceHistory::where('id', $id)->firstOrFail();

        $data = $request->validate([
            'start_date'    => 'nullable|date',
            'end_date'      => 'nullable|string|max:50',
            'military_rank' => 'nullable|string|max:255',
            'position'      => 'nullable|string|max:255',
            'office'        => 'nullable|string|max:255',
            'military_unit' => 'nullable|string|max:255',
            'place'         => 'nullable|string|max:255',
        ]);

        $record->update($data);
        return response()->json($record);
    }

    public function destroy(Request $request, $id)
    {
        $record = MilitaryServiceHistory::where('id', $id)->firstOrFail();

        $record->delete();
        return response()->json(['message' => 'Deleted successfully.']);
    }
}