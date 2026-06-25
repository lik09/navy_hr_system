<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\FamilyInfo;
use Illuminate\Http\Request;

class FamilyInfoController extends Controller
{
    public function index(Request $request)
    {
        $info = FamilyInfo::with('children')->where('personal_info_id', $this->existingPersonalInfoId($request))->first();
        return response()->json($info);
    }

    public function store(Request $request)
    {
        $personalInfoId = $this->existingPersonalInfoId($request);

        $data = $request->validate([
            'marital_status'             => 'nullable|boolean',
            'spouse_name'                => 'nullable|string|max:255',
            'spouse_type'                => 'nullable|boolean',
            'spouse_gender'              => 'nullable|string|max:10',
            'spouse_dob'                 => 'nullable|date',
            'spouse_birth_commune'       => 'nullable|string|max:255',
            'spouse_birth_district'      => 'nullable|string|max:255',
            'spouse_birth_province'      => 'nullable|string|max:255',
            'spouse_current_commune'     => 'nullable|string|max:255',
            'spouse_current_district'    => 'nullable|string|max:255',
            'spouse_current_province'    => 'nullable|string|max:255',
            'marriage_certificate_number'=> 'nullable|string|max:100',
            'marriage_certificate_date'  => 'nullable|date',
            'number_of_children'         => 'nullable|integer|min:0',
            'male_children_count'        => 'nullable|integer|min:0',
            'female_children_count'      => 'nullable|integer|min:0',
        ]);

        $info = FamilyInfo::updateOrCreate(
            ['personal_info_id' => $personalInfoId],
            $data
        );

        return response()->json($info->load('children'), 201);
    }

    public function update(Request $request, $id)
    {
        $info = FamilyInfo::where('id', $id)->firstOrFail();

        $data = $request->validate([
            'marital_status'             => 'nullable|boolean',
            'spouse_name'                => 'nullable|string|max:255',
            'spouse_type'                => 'nullable|boolean',
            'spouse_gender'              => 'nullable|string|max:10',
            'spouse_dob'                 => 'nullable|date',
            'spouse_birth_commune'       => 'nullable|string|max:255',
            'spouse_birth_district'      => 'nullable|string|max:255',
            'spouse_birth_province'      => 'nullable|string|max:255',
            'spouse_current_commune'     => 'nullable|string|max:255',
            'spouse_current_district'    => 'nullable|string|max:255',
            'spouse_current_province'    => 'nullable|string|max:255',
            'marriage_certificate_number'=> 'nullable|string|max:100',
            'marriage_certificate_date'  => 'nullable|date',
            'number_of_children'         => 'nullable|integer|min:0',
            'male_children_count'        => 'nullable|integer|min:0',
            'female_children_count'      => 'nullable|integer|min:0',
        ]);

        $info->update($data);
        return response()->json($info->load('children'));
    }
}
