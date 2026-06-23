<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MilitarySpecialty;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MilitarySpecialtyController extends Controller
{
    // GET /api/military-specialties
    public function index()
    {
        $specialties = MilitarySpecialty::all();

        return response()->json($specialties, 200);
    }

    // POST /api/military-specialties
    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:military_specialties,name',
            ],
            'name_kh' => [
                'nullable',
                'string',
                'max:255',
                'unique:military_specialties,name_kh',
            ],
            'status' => 'boolean',
        ]);

        $specialty = MilitarySpecialty::create([
            'name' => $request->name,
            'name_kh' => $request->name_kh,
            'status' => $request->status ?? 1,
        ]);

        return response()->json($specialty, 201);
    }

    // GET /api/military-specialties/{id}
    public function show(string $id)
    {
        $specialty = MilitarySpecialty::find($id);

        if (!$specialty) {
            return response()->json([
                'success' => false,
                'message' => 'Military Specialty not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $specialty,
        ], 200);
    }

    // PUT /api/military-specialties/{id}
    public function update(Request $request, string $id)
    {
        $specialty = MilitarySpecialty::find($id);

        if (!$specialty) {
            return response()->json([
                'success' => false,
                'message' => 'Military Specialty not found.',
            ], 404);
        }

        $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('military_specialties', 'name')
                    ->ignore($specialty->id),
            ],
            'name_kh' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('military_specialties', 'name_kh')
                    ->ignore($specialty->id),
            ],
            'status' => 'boolean',
        ]);

        $specialty->update([
            'name' => $request->has('name')
                ? $request->name
                : $specialty->name,

            'name_kh' => $request->has('name_kh')
                ? $request->name_kh
                : $specialty->name_kh,

            'status' => $request->has('status')
                ? $request->status
                : $specialty->status,
        ]);

        return response()->json($specialty, 200);
    }

    // DELETE /api/military-specialties/{id}
    public function destroy(string $id)
    {
        $specialty = MilitarySpecialty::find($id);

        if (!$specialty) {
            return response()->json([
                'success' => false,
                'message' => 'Military Specialty not found.',
            ], 404);
        }

        $specialty->delete();

        return response()->json([
            'success' => true,
            'message' => 'Military Specialty deleted successfully.',
        ], 200);
    }
}