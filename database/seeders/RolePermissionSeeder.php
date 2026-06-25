<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Every other permission group (General Information, Military Rank, Role, etc.)
     * already exists from the Permission admin screen. The "users" page is the
     * only one with no matching permission yet, so this just fills that gap.
     */
    public function run(): void
    {
        $userPermissions = [
            ['key' => 'VIEW_USER',   'name' => 'View User'],
            ['key' => 'ADD_USER',    'name' => 'Add User'],
            ['key' => 'EDIT_USER',   'name' => 'Edit User'],
            ['key' => 'DELETE_USER', 'name' => 'Delete User'],
        ];

        foreach ($userPermissions as $permission) {
            Permission::firstOrCreate(
                ['key' => $permission['key']],
                ['name' => $permission['name'], 'group' => 'User', 'status' => true]
            );
        }
    }
}
