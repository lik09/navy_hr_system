<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RolePermissionController extends Controller
{
    /**
     * Get all permissions of a role.
     */
    public function index(Role $role): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Role permissions retrieved successfully.',
            'data'    => [
                'role'        => $role,
                'permissions' => $role->permissions,
            ],
        ]);
    }

    /**
     * Sync permissions to a role (replace all).
     */
    public function sync(Request $request, Role $role): JsonResponse
    {
        $validated = $request->validate([
            'permission_ids'   => ['required', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        $role->permissions()->sync($validated['permission_ids']);

        return response()->json([
            'success' => true,
            'message' => 'Permissions synced to role successfully.',
            'data'    => $role->fresh('permissions'),
        ]);
    }

    /**
     * Attach permissions to a role (add without removing).
     */
    public function attach(Request $request, Role $role): JsonResponse
    {
        $validated = $request->validate([
            'permission_ids'   => ['required', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        // syncWithoutDetaching = attach only new ones, skip duplicates
        $role->permissions()->syncWithoutDetaching($validated['permission_ids']);

        return response()->json([
            'success' => true,
            'message' => 'Permissions attached to role successfully.',
            'data'    => $role->fresh('permissions'),
        ]);
    }

    /**
     * Detach permissions from a role.
     */
    public function detach(Request $request, Role $role): JsonResponse
    {
        $validated = $request->validate([
            'permission_ids'   => ['required', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ]);

        $role->permissions()->detach($validated['permission_ids']);

        return response()->json([
            'success' => true,
            'message' => 'Permissions detached from role successfully.',
            'data'    => $role->fresh('permissions'),
        ]);
    }

    /**
     * Detach all permissions from a role.
     */
    public function detachAll(Role $role): JsonResponse
    {
        $role->permissions()->detach();

        return response()->json([
            'success' => true,
            'message' => 'All permissions detached from role successfully.',
        ]);
    }

    /**
     * Check if a role has a specific permission.
     */
    public function check(Role $role, Permission $permission): JsonResponse
    {
        $hasPermission = $role->permissions()->where('permissions.id', $permission->id)->exists();

        return response()->json([
            'success' => true,
            'data'    => [
                'role'           => $role->name,
                'permission'     => $permission->name,
                'has_permission' => $hasPermission,
            ],
        ]);
    }
}