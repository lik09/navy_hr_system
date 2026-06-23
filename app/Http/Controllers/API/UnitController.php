<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UnitController extends Controller
{
    // GET /api/units
    public function index()
    {
        $units = Unit::all();
        return response()->json($units, 200);
    }

    // POST /api/units
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:units,name',
            'name_kh' => 'nullable|string|max:255|unique:units,name_kh',
            'status' => 'boolean',
        ]);

        $unit = Unit::create([
            'name'    => $request->name,
            'name_kh' => $request->name_kh,
            'status'  => $request->status ?? 1,
        ]);

        return response()->json($unit, 201);
    }

    // GET /api/units/{id}
    public function show(string $id)
    {
        $unit = Unit::find($id);

        if (!$unit) {
            return response()->json([
                'success' => false,
                'message' => 'Unit not found',
            ], 404);
        }

        return response()->json($unit, 200);
    }

    // PUT /api/units/{id}
    public function update(Request $request, string $id)
    {
        $unit = Unit::find($id);

        if (!$unit) {
            return response()->json([
                'success' => false,
                'message' => 'Unit not found',
            ], 404);
        }

        $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('units', 'name')->ignore($unit->id),
            ],
            'name_kh' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('units', 'name_kh')->ignore($unit->id),
            ],
            'status' => 'boolean',
        ]);

        $unit->update([
            'name'    => $request->name    ?? $unit->name,
            'name_kh' => $request->name_kh ?? $unit->name_kh,
            'status'  => $request->status  ?? $unit->status,
        ]);

        return response()->json($unit, 200);
    }

    // DELETE /api/units/{id}
    public function destroy(string $id)
    {
        $unit = Unit::find($id);

        if (!$unit) {
            return response()->json([
                'success' => false,
                'message' => 'Unit not found',
            ], 404);
        }

        $unit->delete();

        return response()->json([
            'success' => true,
            'message' => 'Unit deleted successfully',
        ], 200);
    }
}