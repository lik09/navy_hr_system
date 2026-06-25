<?php

namespace App\Http\Controllers;

use App\Models\FamilyInfo;
use App\Models\PersonalInfo;
use Illuminate\Http\Request;

abstract class Controller
{
    /**
     * Validate that the posted personal_info_id refers to an existing roster record.
     * Ownership is not checked here — any authenticated user holding the relevant
     * permission may operate on any personnel record (created_by is audit-only).
     */
    protected function existingPersonalInfoId(Request $request): int
    {
        $id = $request->input('personal_info_id');
        abort_if(!$id, 422, 'personal_info_id is required.');

        $exists = PersonalInfo::where('id', $id)->exists();
        abort_unless($exists, 404, 'Personal info record not found.');

        return (int) $id;
    }

    protected function familyInfoIdForCreate(Request $request): int
    {
        $familyInfoId = FamilyInfo::where('personal_info_id', $this->existingPersonalInfoId($request))->value('id');
        abort_if(!$familyInfoId, 422, 'Family info must be created first.');

        return $familyInfoId;
    }
}
