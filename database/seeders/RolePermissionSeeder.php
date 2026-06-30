<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Single source of truth for every permission key in the system.
     * Uses firstOrCreate so re-running on an existing database is safe.
     */
    public function run(): void
    {
        $permissions = [
            // ── General Information ──────────────────────────────────
            ['VIEW_GENERAL_INFORMATION',   'View General Information',   'General Information'],
            ['ADD_GENERAL_INFORMATION',    'Add General Information',    'General Information'],
            ['EDIT_GENERAL_INFORMATION',   'Edit General Information',   'General Information'],
            ['DELETE_GENERAL_INFORMATION', 'Delete General Information', 'General Information'],

            // ── Military Service History ─────────────────────────────
            ['VIEW_MILITARY_SERVICE_HISTORY',   'View Military Service History',   'Military Service History'],
            ['ADD_MILITARY_SERVICE_HISTORY',    'Add Military Service History',    'Military Service History'],
            ['EDIT_MILITARY_SERVICE_HISTORY',   'Edit Military Service History',   'Military Service History'],
            ['DELETE_MILITARY_SERVICE_HISTORY', 'Delete Military Service History', 'Military Service History'],

            // ── Education History ────────────────────────────────────
            ['VIEW_EDUCATION_HISTORY',   'View Education History',   'Education History'],
            ['ADD_EDUCATION_HISTORY',    'Add Education History',    'Education History'],
            ['EDIT_EDUCATION_HISTORY',   'Edit Education History',   'Education History'],
            ['DELETE_EDUCATION_HISTORY', 'Delete Education History', 'Education History'],

            // ── Specialized Training ─────────────────────────────────
            ['VIEW_SPECIALIZED_TRAINING',   'View Specialized Training',   'Specialized Training'],
            ['ADD_SPECIALIZED_TRAINING',    'Add Specialized Training',    'Specialized Training'],
            ['EDIT_SPECIALIZED_TRAINING',   'Edit Specialized Training',   'Specialized Training'],
            ['DELETE_SPECIALIZED_TRAINING', 'Delete Specialized Training', 'Specialized Training'],

            // ── Mission History ──────────────────────────────────────
            ['VIEW_MISSION_HISTORY',   'View Mission History',   'Mission History'],
            ['ADD_MISSION_HISTORY',    'Add Mission History',    'Mission History'],
            ['EDIT_MISSION_HISTORY',   'Edit Mission History',   'Mission History'],
            ['DELETE_MISSION_HISTORY', 'Delete Mission History', 'Mission History'],

            // ── Health Information ───────────────────────────────────
            ['VIEW_HEALTH_INFORMATION',   'View Health Information',   'Health Information'],
            ['ADD_HEALTH_INFORMATION',    'Add Health Information',    'Health Information'],
            ['EDIT_HEALTH_INFORMATION',   'Edit Health Information',   'Health Information'],
            ['DELETE_HEALTH_INFORMATION', 'Delete Health Information', 'Health Information'],

            // ── Military Rank ────────────────────────────────────────
            ['VIEW_MILITARY_RANK',   'View Military Rank',   'Military Rank'],
            ['ADD_MILITARY_RANK',    'Add Military Rank',    'Military Rank'],
            ['EDIT_MILITARY_RANK',   'Edit Military Rank',   'Military Rank'],
            ['DELETE_MILITARY_RANK', 'Delete Military Rank', 'Military Rank'],

            // ── Position ─────────────────────────────────────────────
            ['VIEW_POSITION',   'View Position',   'Position'],
            ['ADD_POSITION',    'Add Position',    'Position'],
            ['EDIT_POSITION',   'Edit Position',   'Position'],
            ['DELETE_POSITION', 'Delete Position', 'Position'],

            // ── Unit ─────────────────────────────────────────────────
            ['VIEW_UNIT',   'View Unit',   'Unit'],
            ['ADD_UNIT',    'Add Unit',    'Unit'],
            ['EDIT_UNIT',   'Edit Unit',   'Unit'],
            ['DELETE_UNIT', 'Delete Unit', 'Unit'],

            // ── Military Unit ────────────────────────────────────────
            ['VIEW_MILITARY_UNIT',   'View Military Unit',   'Military Unit'],
            ['ADD_MILITARY_UNIT',    'Add Military Unit',    'Military Unit'],
            ['EDIT_MILITARY_UNIT',   'Edit Military Unit',   'Military Unit'],
            ['DELETE_MILITARY_UNIT', 'Delete Military Unit', 'Military Unit'],

            // ── Education Level ──────────────────────────────────────
            ['VIEW_EDUCATION_LEVEL',   'View Education Level',   'Education Level'],
            ['ADD_EDUCATION_LEVEL',    'Add Education Level',    'Education Level'],
            ['EDIT_EDUCATION_LEVEL',   'Edit Education Level',   'Education Level'],
            ['DELETE_EDUCATION_LEVEL', 'Delete Education Level', 'Education Level'],

            // ── Military Specialty ───────────────────────────────────
            ['VIEW_MILITARY_SPECIALTY',   'View Military Specialty',   'Military Specialty'],
            ['ADD_MILITARY_SPECIALTY',    'Add Military Specialty',    'Military Specialty'],
            ['EDIT_MILITARY_SPECIALTY',   'Edit Military Specialty',   'Military Specialty'],
            ['DELETE_MILITARY_SPECIALTY', 'Delete Military Specialty', 'Military Specialty'],

            // ── User ─────────────────────────────────────────────────
            ['VIEW_USER',   'View User',   'User'],
            ['ADD_USER',    'Add User',    'User'],
            ['EDIT_USER',   'Edit User',   'User'],
            ['DELETE_USER', 'Delete User', 'User'],

            // ── Role ─────────────────────────────────────────────────
            ['VIEW_ROLE',   'View Role',   'Role'],
            ['ADD_ROLE',    'Add Role',    'Role'],
            ['EDIT_ROLE',   'Edit Role',   'Role'],
            ['DELETE_ROLE', 'Delete Role', 'Role'],

            // ── Permission ───────────────────────────────────────────
            ['VIEW_PERMISSION',   'View Permission',   'Permission'],
            ['ADD_PERMISSION',    'Add Permission',    'Permission'],
            ['EDIT_PERMISSION',   'Edit Permission',   'Permission'],
            ['DELETE_PERMISSION', 'Delete Permission', 'Permission'],

            // ── Role Permission ──────────────────────────────────────
            ['VIEW_ROLE_PERMISSION', 'View Role Permission', 'Role Permission'],
            ['EDIT_ROLE_PERMISSION', 'Edit Role Permission', 'Role Permission'],

            // ── Settings ─────────────────────────────────────────────
            ['VIEW_PROFILE',    'View Profile',    'Settings'],
            ['EDIT_PROFILE',    'Edit Profile',    'Settings'],
            ['CHANGE_PASSWORD', 'Change Password', 'Settings'],

            // ── Dashboard ────────────────────────────────────────────
            ['VIEW_DASHBOARD', 'View Dashboard', 'Dashboard'],

            // ── Export ───────────────────────────────────────────────
            ['DOWNLOAD_EXCEL', 'Download Excel', 'Export'],
            ['DOWNLOAD_PDF',   'Download PDF',   'Export'],
        ];

        foreach ($permissions as [$key, $name, $group]) {
            Permission::firstOrCreate(
                ['key' => $key],
                ['name' => $name, 'group' => $group, 'status' => true]
            );
        }
    }
}
