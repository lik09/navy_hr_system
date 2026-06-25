<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class PermissionController extends Controller
{
    /**
     * Display a listing of permissions.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Permission::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('key', 'like', "%{$search}%")
                  ->orWhere('group', 'like', "%{$search}%");
            });
        }

        if ($request->filled('group')) {
            $query->where('group', $request->input('group'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $permissions = $query->latest()->paginate($request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'message' => 'Permissions retrieved successfully.',
            'data'    => $permissions,
        ]);
    }

    /**
     * Get all permissions grouped by group field.
     */
    public function grouped(): JsonResponse
    {
        $permissions = Permission::where('status', true)
            ->get()
            ->groupBy('group');

        return response()->json([
            'success' => true,
            'message' => 'Grouped permissions retrieved successfully.',
            'data'    => $permissions,
        ]);
    }

    /**
     * Store a newly created permission.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255', 'unique:permissions,name'],
            'name_kh'     => ['nullable', 'string', 'max:255', 'unique:permissions,name_kh'],
            'key'         => ['required', 'string', 'max:255', 'unique:permissions,key'],
            'description' => ['nullable', 'string', 'max:500'],
            'group'       => ['nullable', 'string', 'max:255'],
            'status'      => ['nullable', 'boolean'],
        ]);

        $permission = Permission::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Permission created successfully.',
            'data'    => $permission,
        ], 201);
    }

    /**
     * Display the specified permission.
     */
    public function show(Permission $permission): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Permission retrieved successfully.',
            'data'    => $permission->load('roles'),
        ]);
    }

    /**
     * Update the specified permission.
     */
    public function update(Request $request, Permission $permission): JsonResponse
    {
        $validated = $request->validate([
            'name'        => ['sometimes', 'required', 'string', 'max:255', Rule::unique('permissions', 'name')->ignore($permission->id)],
            'name_kh'     => ['nullable', 'string', 'max:255', Rule::unique('permissions', 'name_kh')->ignore($permission->id)],
            'key'         => ['sometimes', 'required', 'string', 'max:255', Rule::unique('permissions', 'key')->ignore($permission->id)],
            'description' => ['nullable', 'string', 'max:500'],
            'group'       => ['nullable', 'string', 'max:255'],
            'status'      => ['nullable', 'boolean'],
        ]);

        $permission->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Permission updated successfully.',
            'data'    => $permission->fresh(),
        ]);
    }

    /**
     * Remove the specified permission.
     */
    public function destroy(Permission $permission): JsonResponse
    {
        // Detach from all roles before deleting
        $permission->roles()->detach();
        $permission->delete();

        return response()->json([
            'success' => true,
            'message' => 'Permission deleted successfully.',
        ]);
    }

    /**
     * Toggle status of the specified permission.
     */
    public function toggleStatus(Permission $permission): JsonResponse
    {
        $permission->update(['status' => !$permission->status]);

        return response()->json([
            'success' => true,
            'message' => 'Permission status updated successfully.',
            'data'    => $permission->fresh(),
        ]);
    }
}