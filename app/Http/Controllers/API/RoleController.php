<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Role::with('permissions')->withCount('users');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('key', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $roles = $query->latest()->paginate($request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'message' => 'Roles retrieved successfully.',
            'data'    => $roles,
        ]);
    }

    /**
     * Public, minimal list of self-assignable roles (used by the public registration form).
     */
    public function publicRoles(): JsonResponse
    {
        $roles = Role::where('status', true)
            ->where('key', '!=', 'admin')
            ->orderBy('name')
            ->get(['id', 'name', 'key']);

        return response()->json($roles);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255', 'unique:roles,name'],
            'name_kh'          => ['nullable', 'string', 'max:255', 'unique:roles,name_kh'],
            'key'              => ['required', 'string', 'max:255', 'unique:roles,key'],
            'description'      => ['nullable', 'string', 'max:500'],
            'status'           => ['nullable', 'boolean'],
            'permission_ids'   => ['nullable', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        $role = Role::create($validated);

        if (!empty($validated['permission_ids'])) {
            $role->permissions()->sync($validated['permission_ids']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Role created successfully.',
            'data'    => $role->load('permissions'),
        ], 201);
    }

    /**
     * Display the specified role.
     */
    public function show(Role $role): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Role retrieved successfully.',
            'data'    => $role->load('permissions'),
        ]);
    }

    /**
     * Update the specified role.
     */
    public function update(Request $request, Role $role): JsonResponse
    {
        $validated = $request->validate([
            'name'             => ['sometimes', 'required', 'string', 'max:255', Rule::unique('roles', 'name')->ignore($role->id)],
            'name_kh'          => ['nullable', 'string', 'max:255', Rule::unique('roles', 'name_kh')->ignore($role->id)],
            'key'              => ['sometimes', 'required', 'string', 'max:255', Rule::unique('roles', 'key')->ignore($role->id)],
            'description'      => ['nullable', 'string', 'max:500'],
            'status'           => ['nullable', 'boolean'],
            'permission_ids'   => ['nullable', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        $role->update($validated);

        if (isset($validated['permission_ids'])) {
            $role->permissions()->sync($validated['permission_ids']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Role updated successfully.',
            'data'    => $role->fresh('permissions'),
        ]);
    }

    /**
     * Remove the specified role.
     */
    public function destroy(Role $role): JsonResponse
    {
        $role->permissions()->detach();
        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Role deleted successfully.',
        ]);
    }

    /**
     * Toggle status of the specified role.
     */
    public function toggleStatus(Role $role): JsonResponse
    {
        $role->update(['status' => !$role->status]);

        return response()->json([
            'success' => true,
            'message' => 'Role status updated successfully.',
            'data'    => $role->fresh(),
        ]);
    }
}