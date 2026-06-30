<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PersonalInfoController;
use App\Http\Controllers\API\MilitaryInfoController;
use App\Http\Controllers\API\FamilyInfoController;
use App\Http\Controllers\API\ChildController;
use App\Http\Controllers\API\MilitaryServiceHistoryController;
use App\Http\Controllers\API\EducationController;
use App\Http\Controllers\API\SpecializedTrainingController;
use App\Http\Controllers\API\MissionController;
use App\Http\Controllers\API\HealthController;
use App\Http\Controllers\API\PersonnelExportController;
use App\Http\Controllers\API\EducationLevelController;
use App\Http\Controllers\API\MilitaryRankController;
use App\Http\Controllers\API\MilitarySpecialtyController;
use App\Http\Controllers\API\MilitaryUnitController;
use App\Http\Controllers\API\PositionController;
use App\Http\Controllers\API\UnitController;
use App\Http\Controllers\API\PermissionController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\RolePermissionController;
use App\Http\Controllers\API\UserController;

// ── Public auth routes ────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Public reference data
Route::get('/roles/public', [RoleController::class, 'publicRoles']);

// ── Protected routes ──────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // ── Section I: General Information ───────────────────────
    // ✅ GET open to all authenticated — Dashboard needs these
    Route::get('/personnel-info',                   [PersonalInfoController::class, 'index']);
    Route::get('/military-info',                    [MilitaryInfoController::class, 'index']);
    Route::get('/family-info',                      [FamilyInfoController::class, 'index']);
    Route::apiResource('children', ChildController::class)->only(['index', 'show']);

    // Write operations gated
    Route::middleware('permission:ADD_GENERAL_INFORMATION')->group(function () {
        Route::post('/personnel-info', [PersonalInfoController::class, 'store']);
        Route::post('/military-info',  [MilitaryInfoController::class, 'store']);
        Route::post('/family-info',    [FamilyInfoController::class,   'store']);
        Route::apiResource('children', ChildController::class)->only(['store']);
    });
    Route::middleware('permission:EDIT_GENERAL_INFORMATION')->group(function () {
        Route::post('/personnel-info/{id}', [PersonalInfoController::class, 'update']);
        Route::put('/military-info/{id}',   [MilitaryInfoController::class, 'update']);
        Route::put('/family-info/{id}',     [FamilyInfoController::class,   'update']);
        Route::apiResource('children', ChildController::class)->only(['update']);
    });
    Route::middleware('permission:DELETE_GENERAL_INFORMATION')->group(function () {
        Route::delete('/personnel-info/{id}', [PersonalInfoController::class, 'destroy']);
        Route::apiResource('children', ChildController::class)->only(['destroy']);
    });
    Route::middleware('permission:DOWNLOAD_EXCEL')->group(function () {
        Route::get('/personnel-info/export/roster', [PersonnelExportController::class, 'roster']);
    });
    Route::middleware('permission:DOWNLOAD_PDF')->group(function () {
        Route::get('/personnel-info/{id}/export/pdf', [PersonnelExportController::class, 'pdf']);
    });

    // ── Section II: Military Service History ─────────────────
    // ✅ GET open to all authenticated
    Route::apiResource('military-service-histories', MilitaryServiceHistoryController::class)->only(['index', 'show']);

    // Write operations gated
    Route::middleware('permission:ADD_MILITARY_SERVICE_HISTORY')->group(function () {
        Route::apiResource('military-service-histories', MilitaryServiceHistoryController::class)->only(['store']);
    });
    Route::middleware('permission:EDIT_MILITARY_SERVICE_HISTORY')->group(function () {
        Route::apiResource('military-service-histories', MilitaryServiceHistoryController::class)->only(['update']);
    });
    Route::middleware('permission:DELETE_MILITARY_SERVICE_HISTORY')->group(function () {
        Route::apiResource('military-service-histories', MilitaryServiceHistoryController::class)->only(['destroy']);
    });

    // ── Section III: Education ────────────────────────────────
    // ✅ GET open to all authenticated
    Route::apiResource('education', EducationController::class)->only(['index', 'show']);

    // Write operations gated
    Route::middleware('permission:ADD_EDUCATION_HISTORY')->group(function () {
        Route::apiResource('education', EducationController::class)->only(['store']);
    });
    Route::middleware('permission:EDIT_EDUCATION_HISTORY')->group(function () {
        Route::apiResource('education', EducationController::class)->only(['update']);
    });
    Route::middleware('permission:DELETE_EDUCATION_HISTORY')->group(function () {
        Route::apiResource('education', EducationController::class)->only(['destroy']);
    });

    // ── Section IV: Specialized Training ─────────────────────
    // ✅ GET open to all authenticated
    Route::apiResource('specialized-trainings', SpecializedTrainingController::class)->only(['index', 'show']);

    // Write operations gated
    Route::middleware('permission:ADD_SPECIALIZED_TRAINING')->group(function () {
        Route::apiResource('specialized-trainings', SpecializedTrainingController::class)->only(['store']);
    });
    Route::middleware('permission:EDIT_SPECIALIZED_TRAINING')->group(function () {
        Route::apiResource('specialized-trainings', SpecializedTrainingController::class)->only(['update']);
    });
    Route::middleware('permission:DELETE_SPECIALIZED_TRAINING')->group(function () {
        Route::apiResource('specialized-trainings', SpecializedTrainingController::class)->only(['destroy']);
    });

    // ── Section V: Mission History ────────────────────────────
    // ✅ GET open to all authenticated
    Route::apiResource('missions', MissionController::class)->only(['index', 'show']);

    // Write operations gated
    Route::middleware('permission:ADD_MISSION_HISTORY')->group(function () {
        Route::apiResource('missions', MissionController::class)->only(['store']);
    });
    Route::middleware('permission:EDIT_MISSION_HISTORY')->group(function () {
        Route::apiResource('missions', MissionController::class)->only(['update']);
    });
    Route::middleware('permission:DELETE_MISSION_HISTORY')->group(function () {
        Route::apiResource('missions', MissionController::class)->only(['destroy']);
    });

    // ── Section VI: Health ────────────────────────────────────
    // ✅ GET open to all authenticated
    Route::apiResource('health', HealthController::class)->only(['index', 'show']);

    // Write operations gated
    Route::middleware('permission:ADD_HEALTH_INFORMATION')->group(function () {
        Route::apiResource('health', HealthController::class)->only(['store']);
    });
    Route::middleware('permission:EDIT_HEALTH_INFORMATION')->group(function () {
        Route::apiResource('health', HealthController::class)->only(['update']);
    });
    Route::middleware('permission:DELETE_HEALTH_INFORMATION')->group(function () {
        Route::apiResource('health', HealthController::class)->only(['destroy']);
    });

    // ── Setup: lookup data (reads open, writes gated) ─────────

    // Military Rank
    Route::apiResource('military-rank', MilitaryRankController::class)->only(['index', 'show']);
    Route::middleware('permission:ADD_MILITARY_RANK')->group(function () {
        Route::apiResource('military-rank', MilitaryRankController::class)->only(['store']);
    });
    Route::middleware('permission:EDIT_MILITARY_RANK')->group(function () {
        Route::apiResource('military-rank', MilitaryRankController::class)->only(['update']);
    });
    Route::middleware('permission:DELETE_MILITARY_RANK')->group(function () {
        Route::apiResource('military-rank', MilitaryRankController::class)->only(['destroy']);
    });

    // Position
    Route::apiResource('position', PositionController::class)->only(['index', 'show']);
    Route::middleware('permission:ADD_POSITION')->group(function () {
        Route::apiResource('position', PositionController::class)->only(['store']);
    });
    Route::middleware('permission:EDIT_POSITION')->group(function () {
        Route::apiResource('position', PositionController::class)->only(['update']);
    });
    Route::middleware('permission:DELETE_POSITION')->group(function () {
        Route::apiResource('position', PositionController::class)->only(['destroy']);
    });

    // Unit
    Route::apiResource('unit', UnitController::class)->only(['index', 'show']);
    Route::middleware('permission:ADD_UNIT')->group(function () {
        Route::apiResource('unit', UnitController::class)->only(['store']);
    });
    Route::middleware('permission:EDIT_UNIT')->group(function () {
        Route::apiResource('unit', UnitController::class)->only(['update']);
    });
    Route::middleware('permission:DELETE_UNIT')->group(function () {
        Route::apiResource('unit', UnitController::class)->only(['destroy']);
    });

    // Military Unit
    Route::apiResource('military-unit', MilitaryUnitController::class)->only(['index', 'show']);
    Route::middleware('permission:ADD_MILITARY_UNIT')->group(function () {
        Route::apiResource('military-unit', MilitaryUnitController::class)->only(['store']);
    });
    Route::middleware('permission:EDIT_MILITARY_UNIT')->group(function () {
        Route::apiResource('military-unit', MilitaryUnitController::class)->only(['update']);
    });
    Route::middleware('permission:DELETE_MILITARY_UNIT')->group(function () {
        Route::apiResource('military-unit', MilitaryUnitController::class)->only(['destroy']);
    });

    // Education Level
    Route::apiResource('education-level', EducationLevelController::class)->only(['index', 'show']);
    Route::middleware('permission:ADD_EDUCATION_LEVEL')->group(function () {
        Route::apiResource('education-level', EducationLevelController::class)->only(['store']);
    });
    Route::middleware('permission:EDIT_EDUCATION_LEVEL')->group(function () {
        Route::apiResource('education-level', EducationLevelController::class)->only(['update']);
    });
    Route::middleware('permission:DELETE_EDUCATION_LEVEL')->group(function () {
        Route::apiResource('education-level', EducationLevelController::class)->only(['destroy']);
    });

    // Military Specialty
    Route::apiResource('military-specialty', MilitarySpecialtyController::class)->only(['index', 'show']);
    Route::middleware('permission:ADD_MILITARY_SPECIALTY')->group(function () {
        Route::apiResource('military-specialty', MilitarySpecialtyController::class)->only(['store']);
    });
    Route::middleware('permission:EDIT_MILITARY_SPECIALTY')->group(function () {
        Route::apiResource('military-specialty', MilitarySpecialtyController::class)->only(['update']);
    });
    Route::middleware('permission:DELETE_MILITARY_SPECIALTY')->group(function () {
        Route::apiResource('military-specialty', MilitarySpecialtyController::class)->only(['destroy']);
    });

    // ── Users ─────────────────────────────────────────────────
    Route::middleware('permission:VIEW_USER')->group(function () {
        Route::apiResource('users', UserController::class)->only(['index', 'show']);
    });
    Route::middleware('permission:ADD_USER')->group(function () {
        Route::apiResource('users', UserController::class)->only(['store']);
    });
    Route::middleware('permission:EDIT_USER')->group(function () {
        Route::apiResource('users', UserController::class)->only(['update']);
    });
    Route::middleware('permission:DELETE_USER')->group(function () {
        Route::apiResource('users', UserController::class)->only(['destroy']);
    });

    // ── Roles ─────────────────────────────────────────────────
    // ✅ VIEW_ROLE | VIEW_ROLE_PERMISSION ទាំងពីរ អាច list roles បាន
    Route::middleware('permission:VIEW_ROLE|VIEW_ROLE_PERMISSION')->group(function () {
        Route::apiResource('roles', RoleController::class)->only(['index', 'show']);
    });
    Route::middleware('permission:ADD_ROLE')->group(function () {
        Route::apiResource('roles', RoleController::class)->only(['store']);
    });
    Route::middleware('permission:EDIT_ROLE')->group(function () {
        Route::apiResource('roles', RoleController::class)->only(['update']);
        Route::patch('roles/{id}/toggle-status', [RoleController::class, 'toggleStatus']);
    });
    Route::middleware('permission:DELETE_ROLE')->group(function () {
        Route::apiResource('roles', RoleController::class)->only(['destroy']);
    });

    // ── Permissions ───────────────────────────────────────────
    // ✅ VIEW_PERMISSION | VIEW_ROLE_PERMISSION ទាំងពីរ អាច grouped បាន
    Route::middleware('permission:VIEW_PERMISSION|VIEW_ROLE_PERMISSION')->group(function () {
        Route::get('permissions/grouped', [PermissionController::class, 'grouped']);
    });
    Route::middleware('permission:VIEW_PERMISSION')->group(function () {
        Route::apiResource('permissions', PermissionController::class)->only(['index', 'show']);
    });
    Route::middleware('permission:ADD_PERMISSION')->group(function () {
        Route::apiResource('permissions', PermissionController::class)->only(['store']);
    });
    Route::middleware('permission:EDIT_PERMISSION')->group(function () {
        Route::apiResource('permissions', PermissionController::class)->only(['update']);
        Route::patch('permissions/{id}/toggle-status', [PermissionController::class, 'toggleStatus']);
    });
    Route::middleware('permission:DELETE_PERMISSION')->group(function () {
        Route::apiResource('permissions', PermissionController::class)->only(['destroy']);
    });

    // ── Role Permission ───────────────────────────────────────
    Route::middleware('permission:VIEW_ROLE_PERMISSION')->group(function () {
        Route::get('/roles/{role}/permissions',                    [RolePermissionController::class, 'index']);
        Route::get('/roles/{role}/permissions/{permission}/check', [RolePermissionController::class, 'check']);
    });
    Route::middleware('permission:EDIT_ROLE_PERMISSION')->group(function () {
        Route::post('/roles/{role}/permissions/sync',    [RolePermissionController::class, 'sync']);
        Route::post('/roles/{role}/permissions/attach',  [RolePermissionController::class, 'attach']);
        Route::post('/roles/{role}/permissions/detach',  [RolePermissionController::class, 'detach']);
        Route::delete('/roles/{role}/permissions',       [RolePermissionController::class, 'detachAll']);
    });

    // ── Settings ──────────────────────────────────────────────
    // GET stays ungated: only ever returns the caller's own data, and
    // PermissionRoute redirects every permission-denied user here.
    Route::get('/settings', [AuthController::class, 'me']);
    Route::middleware('permission:EDIT_PROFILE')->group(function () {
        Route::post('/settings/profile', [AuthController::class, 'updateProfile']);
    });
    Route::middleware('permission:CHANGE_PASSWORD')->group(function () {
        Route::put('/settings/password', [AuthController::class, 'changePassword']);
    });
});