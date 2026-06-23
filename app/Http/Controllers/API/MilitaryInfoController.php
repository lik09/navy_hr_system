<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MilitaryInfo;
use Illuminate\Http\Request;

class MilitaryInfoController extends Controller
{
    public function index(Request $request)
    {
        $info = MilitaryInfo::with([
            'militaryRank',
            'position',
            'unit',
            'militaryUnit',
            'educationLevel',
            'militarySpecialty',
        ])
        ->where('personal_info_id', $this->ownedPersonalInfoId($request))
        ->first();

        return response()->json($info);
    }

    public function store(Request $request)
    {
        $personalInfoId = $this->ownedPersonalInfoId($request);

        $data = $request->validate([
            'military_enlistment_date' => 'nullable|date',
            'military_rank_id'         => 'nullable|exists:military_ranks,id',      // ✅ FK
            'position_id'              => 'nullable|exists:positions,id',            // ✅ FK
            'unit_id'                  => 'nullable|exists:units,id',               // ✅ FK
            'military_unit_id'         => 'nullable|exists:military_units,id',      // ✅ FK
            'education_level_id'       => 'nullable|exists:education_levels,id',    // ✅ FK
            'military_specialty_id'    => 'nullable|exists:military_specialties,id',// ✅ FK
            'last_date_military_rank'  => 'nullable|date',
            'last_position'            => 'nullable|string|max:255',
        ]);

        $info = MilitaryInfo::updateOrCreate(
            ['personal_info_id' => $personalInfoId],
            $data
        );

        // Load relations ត្រឡប់មក
        $info->load([
            'militaryRank',
            'position',
            'unit',
            'militaryUnit',
            'educationLevel',
            'militarySpecialty',
        ]);

        return response()->json($info, 201);
    }

    public function update(Request $request, $id)
    {
        $info = MilitaryInfo::where('id', $id)
            ->whereHas('personalInfo', fn ($q) => $q->where('user_id', $request->user()->id))
            ->firstOrFail();

        $data = $request->validate([
            'military_enlistment_date' => 'nullable|date',
            'military_rank_id'         => 'nullable|exists:military_ranks,id',      // ✅ FK
            'position_id'              => 'nullable|exists:positions,id',            // ✅ FK
            'unit_id'                  => 'nullable|exists:units,id',               // ✅ FK
            'military_unit_id'         => 'nullable|exists:military_units,id',      // ✅ FK
            'education_level_id'       => 'nullable|exists:education_levels,id',    // ✅ FK
            'military_specialty_id'    => 'nullable|exists:military_specialties,id',// ✅ FK
            'last_date_military_rank'  => 'nullable|date',
            'last_position'            => 'nullable|string|max:255',
        ]);

        $info->update($data);

        // Load relations ត្រឡប់មក
        $info->load([
            'militaryRank',
            'position',
            'unit',
            'militaryUnit',
            'educationLevel',
            'militarySpecialty',
        ]);

        return response()->json($info);
    }
}