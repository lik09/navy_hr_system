<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MilitaryUnit;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MilitaryUnitController extends Controller
{
    // GET /api/military-units
    public function index()
    {
        $units = MilitaryUnit::all();

        return response()->json($units, 200);
    }

    // POST /api/military-units
    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:military_units,name',
            ],
            'name_kh' => [
                'nullable',
                'string',
                'max:255',
                'unique:military_units,name_kh',
            ],
            'status' => 'boolean',
        ]);

        $unit = MilitaryUnit::create([
            'name' => $request->name,
            'name_kh' => $request->name_kh,
            'status' => $request->status ?? 1,
        ]);

        return response()->json( $unit, 201);
    }

    // GET /api/military-units/{id}
    public function show(string $id)
    {
        $unit = MilitaryUnit::find($id);

        if (!$unit) {
            return response()->json([
                'success' => false,
                'message' => 'Military Unit not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $unit,
        ], 200);
    }

    // PUT /api/military-units/{id}
    public function update(Request $request, string $id)
    {
        $unit = MilitaryUnit::find($id);

        if (!$unit) {
            return response()->json([
                'success' => false,
                'message' => 'Military Unit not found.',
            ], 404);
        }

        $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('military_units', 'name')
                    ->ignore($unit->id),
            ],
            'name_kh' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('military_units', 'name_kh')
                    ->ignore($unit->id),
            ],
            'status' => 'boolean',
        ]);

        $unit->update([
            'name' => $request->has('name')
                ? $request->name
                : $unit->name,

            'name_kh' => $request->has('name_kh')
                ? $request->name_kh
                : $unit->name_kh,

            'status' => $request->has('status')
                ? $request->status
                : $unit->status,
        ]);

        return response()->json($unit, 200);
    }

    // DELETE /api/military-units/{id}
    public function destroy(string $id)
    {
        $unit = MilitaryUnit::find($id);

        if (!$unit) {
            return response()->json([
                'success' => false,
                'message' => 'Military Unit not found.',
            ], 404);
        }

        $unit->delete();

        return response()->json([
            'success' => true,
            'message' => 'Military Unit deleted successfully.',
        ], 200);
    }
}