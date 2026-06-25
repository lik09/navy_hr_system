<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\FamilyInfo;
use Illuminate\Http\Request;

class ChildController extends Controller
{
    public function index(Request $request)
    {
        $familyInfoId = FamilyInfo::where('personal_info_id', $this->existingPersonalInfoId($request))->value('id');

        $records = Child::where('family_info_id', $familyInfoId)
            ->orderBy('id')
            ->get();

        return response()->json($records);
    }

    public function store(Request $request)
    {
        $familyInfoId = $this->familyInfoIdForCreate($request);

        $data = $request->validate([
            'name'          => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'gender'        => 'nullable|in:male,female',
        ]);
        $data['family_info_id'] = $familyInfoId;

        $record = Child::create($data);
        return response()->json($record, 201);
    }

    public function show(Request $request, $id)
    {
        $record = Child::where('id', $id)->firstOrFail();
        return response()->json($record);
    }

    public function update(Request $request, $id)
    {
        $record = Child::where('id', $id)->firstOrFail();

        $data = $request->validate([
            'name'          => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'gender'        => 'nullable|in:male,female',
        ]);

        $record->update($data);
        return response()->json($record);
    }

    public function destroy(Request $request, $id)
    {
        $record = Child::where('id', $id)->firstOrFail();
        $record->delete();
        return response()->json(['message' => 'Deleted successfully.']);
    }
}
