<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MilitaryInfo;
use Illuminate\Http\Request;

class MilitaryInfoController extends Controller
{
    public function index(Request $request)
    {
        $info = MilitaryInfo::where('personal_info_id', $this->ownedPersonalInfoId($request))->first();
        return response()->json($info);
    }

    public function store(Request $request)
    {
        $personalInfoId = $this->ownedPersonalInfoId($request);

        $data = $request->validate([
            'military_enlistment_date' => 'nullable|date',
            'military_rank'            => 'nullable|string|max:255',
            'position'                 => 'nullable|string|max:255',
            'unit'                     => 'nullable|string|max:255',
            'military_unit'            => 'nullable|string|max:255',
            'education_level'          => 'nullable|string|max:255',
            'military_specialty'       => 'nullable|string|max:255',
            'last_date_military_rank'  => 'nullable|date',
            'last_position'            => 'nullable|string|max:255',
        ]);

        $info = MilitaryInfo::updateOrCreate(
            ['personal_info_id' => $personalInfoId],
            $data
        );

        return response()->json($info, 201);
    }

    public function update(Request $request, $id)
    {
        $info = MilitaryInfo::where('id', $id)
            ->whereHas('personalInfo', fn ($q) => $q->where('user_id', $request->user()->id))
            ->firstOrFail();

        $data = $request->validate([
            'military_enlistment_date' => 'nullable|date',
            'military_rank'            => 'nullable|string|max:255',
            'position'                 => 'nullable|string|max:255',
            'unit'                     => 'nullable|string|max:255',
            'military_unit'            => 'nullable|string|max:255',
            'education_level'          => 'nullable|string|max:255',
            'military_specialty'       => 'nullable|string|max:255',
            'last_date_military_rank'  => 'nullable|date',
            'last_position'            => 'nullable|string|max:255',
        ]);

        $info->update($data);
        return response()->json($info);
    }
}
