<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\EducationLevel;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EducationLevelController extends Controller
{
    // GET /api/education-levels
    public function index()
    {
        $levels = EducationLevel::all();

        return response()->json($levels, 200);
    }

    // POST /api/education-levels
    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:education_levels,name',
            ],
            'name_kh' => [
                'nullable',
                'string',
                'max:255',
                'unique:education_levels,name_kh',
            ],
            'status' => 'boolean',
        ]);

        $level = EducationLevel::create([
            'name' => $request->name,
            'name_kh' => $request->name_kh,
            'status' => $request->status ?? 1,
        ]);

        return response()->json( $level, 201);
    }

    // GET /api/education-levels/{id}
    public function show(string $id)
    {
        $level = EducationLevel::find($id);

        if (!$level) {
            return response()->json([
                'success' => false,
                'message' => 'Education Level not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $level,
        ], 200);
    }

    // PUT /api/education-levels/{id}
    public function update(Request $request, string $id)
    {
        $level = EducationLevel::find($id);

        if (!$level) {
            return response()->json([
                'success' => false,
                'message' => 'Education Level not found.',
            ], 404);
        }

        $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('education_levels', 'name')->ignore($level->id),
            ],
            'name_kh' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('education_levels', 'name_kh')->ignore($level->id),
            ],
            'status' => 'boolean',
        ]);

        $level->update([
            'name' => $request->has('name')
                ? $request->name
                : $level->name,

            'name_kh' => $request->has('name_kh')
                ? $request->name_kh
                : $level->name_kh,

            'status' => $request->has('status')
                ? $request->status
                : $level->status,
        ]);

        return response()->json($level,200);
    }

    // DELETE /api/education-levels/{id}
    public function destroy(string $id)
    {
        $level = EducationLevel::find($id);

        if (!$level) {
            return response()->json([
                'success' => false,
                'message' => 'Education Level not found.',
            ], 404);
        }

        $level->delete();

        return response()->json([
            'success' => true,
            'message' => 'Education Level deleted successfully.',
        ], 200);
    }
}