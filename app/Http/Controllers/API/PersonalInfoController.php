<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PersonalInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PersonalInfoController extends Controller
{
    // public function index(Request $request)
    // {
    //     $records = PersonalInfo::with(['militaryInfo', 'familyInfo.children', 'creator'])
    //         ->orderByDesc('id')
    //         ->get();

    //     return response()->json($records);
    // }
    public function index(Request $request)
{
    $records = PersonalInfo::with([
        'militaryInfo.militaryRank',
        'militaryInfo.position',
        'militaryInfo.unit',
        'militaryInfo.militaryUnit',
        'militaryInfo.educationLevel',
        'militaryInfo.militarySpecialty',
        'familyInfo.children',
        'creator',
    ])
        ->orderByDesc('id')
        ->get();

    return response()->json($records);
}
    

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_kh'          => 'nullable|string|max:255',
            'name'             => 'required|string|max:255',
            'gender'           => 'required|string',
            'id_number'        => 'required|string|max:100',
            'date_of_birth'    => 'required|date',
            'military_id'      => 'nullable|string|max:100',
            'civilian_id'      => 'nullable|string|max:100',
            'birth_commune'    => 'required|string|max:255',
            'birth_district'   => 'required|string|max:255',
            'birth_province'   => 'required|string|max:255',
            'current_commune'  => 'required|string|max:255',
            'current_district' => 'required|string|max:255',
            'current_province' => 'required|string|max:255',
            'phone_number'     => 'nullable|string|max:30',
            'photo'            => 'nullable|file|image|max:5120',
        ]);

        $data['created_by'] = $request->user()->id;

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('personnel_photos', 'public');
        }

        $info = PersonalInfo::create($data);

        return response()->json($info->load(['militaryInfo', 'familyInfo.children']), 201);
    }

    public function update(Request $request, $id)
    {
        $info = PersonalInfo::where('id', $id)->firstOrFail();

        $data = $request->validate([
            'name_kh'          => 'nullable|string|max:255',
            'name'             => 'required|string|max:255',
            'gender'           => 'required|string',
            'id_number'        => 'required|string|max:100',
            'date_of_birth'    => 'required|date',
            'military_id'      => 'nullable|string|max:100',
            'civilian_id'      => 'nullable|string|max:100',
            'birth_commune'    => 'required|string|max:255',
            'birth_district'   => 'required|string|max:255',
            'birth_province'   => 'required|string|max:255',
            'current_commune'  => 'required|string|max:255',
            'current_district' => 'required|string|max:255',
            'current_province' => 'required|string|max:255',
            'phone_number'     => 'nullable|string|max:30',
            'photo'            => 'nullable|file|image|max:5120',
        ]);

        if ($request->hasFile('photo')) {
            if ($info->photo) {
                Storage::disk('public')->delete($info->photo);
            }
            $data['photo'] = $request->file('photo')->store('personnel_photos', 'public');
        } elseif ($request->boolean('remove_photo')) {
            if ($info->photo) {
                Storage::disk('public')->delete($info->photo);
            }
            $data['photo'] = null;
        }

        $info->update($data);

        return response()->json($info->load(['militaryInfo', 'familyInfo.children']));
    }

    public function destroy(Request $request, $id)
    {
        $info = PersonalInfo::where('id', $id)->firstOrFail();

        if ($info->photo) {
            Storage::disk('public')->delete($info->photo);
        }

        $info->delete();

        return response()->json(['message' => 'Deleted successfully.']);
    }
}
