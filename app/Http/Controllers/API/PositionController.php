<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PositionController extends Controller
{
    // GET /api/positions
    public function index()
    {
        $positions = Position::all();
        return response()->json($positions, 200);
    }

    // POST /api/positions
    public function store(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255|unique:positions,name',
            'name_kh' => 'nullable|string|max:255|unique:positions,name_kh',
            'status'  => 'boolean',
        ]);

        $position = Position::create([
            'name'    => $request->name,
            'name_kh' => $request->name_kh,
            'status'  => $request->status ?? 1,
        ]);

        return response()->json($position, 201);
    }

    // GET /api/positions/{id}
    public function show(string $id)
    {
        $position = Position::find($id);

        if (!$position) {
            return response()->json([
                'success' => false,
                'message' => 'Position not found',
            ], 404);
        }

        return response()->json($position, 200);
    }

    // PUT /api/positions/{id}
    public function update(Request $request, string $id)
    {
        $position = Position::find($id);

        if (!$position) {
            return response()->json([
                'success' => false,
                'message' => 'Position not found',
            ], 404);
        }

        $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('positions', 'name')
                    ->ignore($position->id),
            ],
            'name_kh' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('positions', 'name_kh')
                    ->ignore($position->id),
            ],
            'status' => 'boolean',
        ]);

        $position->update([
            'name'    => $request->name    ?? $position->name,
            'name_kh' => $request->name_kh ?? $position->name_kh,
            'status'  => $request->status  ?? $position->status,
        ]);

        return response()->json($position, 200);
    }

    // DELETE /api/positions/{id}
    public function destroy(string $id)
    {
        $position = Position::find($id);

        if (!$position) {
            return response()->json([
                'success' => false,
                'message' => 'Position not found',
            ], 404);
        }

        $position->delete();

        return response()->json([
            'success' => true,
            'message' => 'Position deleted successfully',
        ], 200);
    }
}