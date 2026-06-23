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

// Public auth routes
Route::prefix('auth')->group(function () {
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Section I — Personal Info (single record per user)
    Route::get('/personnel-info',        [PersonalInfoController::class, 'index']);
    Route::post('/personnel-info',       [PersonalInfoController::class, 'store']);
    Route::post('/personnel-info/{id}',  [PersonalInfoController::class, 'update']);
    Route::delete('/personnel-info/{id}', [PersonalInfoController::class, 'destroy']);
    Route::get('/personnel-info/{id}/export/pdf',   [PersonnelExportController::class, 'pdf']);
    Route::get('/personnel-info/{id}/export/excel', [PersonnelExportController::class, 'excel']);

    // Section I — Military Info (single record per personal_info)
    Route::get('/military-info',         [MilitaryInfoController::class, 'index']);
    Route::post('/military-info',        [MilitaryInfoController::class, 'store']);
    Route::put('/military-info/{id}',    [MilitaryInfoController::class, 'update']);

    // Section I — Family Info (single record per personal_info)
    Route::get('/family-info',           [FamilyInfoController::class, 'index']);
    Route::post('/family-info',          [FamilyInfoController::class, 'store']);
    Route::put('/family-info/{id}',      [FamilyInfoController::class, 'update']);

    // Section I — Children (multi-record table under family_info)
    Route::apiResource('children', ChildController::class);

    // Section II — Military Service Histories (multi-record table)
    Route::apiResource('military-service-histories', MilitaryServiceHistoryController::class);

    // Section III — Education (multi-record table)
    Route::apiResource('education', EducationController::class);

    // Section IV — Specialized Trainings (multi-record table)
    Route::apiResource('specialized-trainings', SpecializedTrainingController::class);

    // Section V — Missions (multi-record table)
    Route::apiResource('missions', MissionController::class);

    // Section VI — Health (multi-record table)
    Route::apiResource('health', HealthController::class);

    // setup
    Route::apiResource('military-rank', MilitaryRankController::class);
    Route::apiResource('position', PositionController::class);
    Route::apiResource('unit', UnitController::class);
    Route::apiResource('military-unit', MilitaryUnitController::class);
    Route::apiResource('education-level', EducationLevelController::class);
    Route::apiResource('military-specialty', MilitarySpecialtyController::class);



    // Settings
    Route::get('/settings', [AuthController::class, 'me']);
    Route::put('/settings', [AuthController::class, 'updateSettings']);
});
