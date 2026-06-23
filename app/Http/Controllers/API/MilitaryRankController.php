<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MilitaryRank;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MilitaryRankController extends Controller
{
    // GET /api/military-ranks
    public function index()
    {
        $ranks = MilitaryRank::all();

        return response()->json($ranks, 200);
    }

    // POST /api/military-ranks
    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:military_ranks,name',
            ],
            'name_kh' => [
                'nullable',
                'string',
                'max:255',
                'unique:military_ranks,name_kh',
            ],
            'status' => 'boolean',
        ]);

        $rank = MilitaryRank::create([
            'name' => $request->name,
            'name_kh' => $request->name_kh,
            'status' => $request->status ?? 1,
        ]);

        return response()->json( $rank ,201);
    }

    // GET /api/military-ranks/{id}
    public function show(string $id)
    {
        $rank = MilitaryRank::find($id);

        if (!$rank) {
            return response()->json([
                'success' => false,
                'message' => 'Military Rank not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $rank,
        ], 200);
    }

    // PUT /api/military-ranks/{id}
    public function update(Request $request, string $id)
    {
        $rank = MilitaryRank::find($id);

        if (!$rank) {
            return response()->json([
                'success' => false,
                'message' => 'Military Rank not found.',
            ], 404);
        }

        $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('military_ranks', 'name')->ignore($rank->id),
            ],
            'name_kh' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('military_ranks', 'name_kh')->ignore($rank->id),
            ],
            'status' => 'boolean',
        ]);

        $rank->update([
            'name' => $request->has('name')
                ? $request->name
                : $rank->name,

            'name_kh' => $request->has('name_kh')
                ? $request->name_kh
                : $rank->name_kh,

            'status' => $request->has('status')
                ? $request->status
                : $rank->status,
        ]);

        return response()->json( $rank, 200);
    }

    // DELETE /api/military-ranks/{id}
    public function destroy(string $id)
    {
        $rank = MilitaryRank::find($id);

        if (!$rank) {
            return response()->json([
                'success' => false,
                'message' => 'Military Rank not found.',
            ], 404);
        }

        $rank->delete();

        return response()->json([
            'success' => true,
            'message' => 'Military Rank deleted successfully.',
        ], 200);
    }
}