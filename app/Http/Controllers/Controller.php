<?php

namespace App\Http\Controllers;

use App\Models\FamilyInfo;
use App\Models\PersonalInfo;
use Illuminate\Http\Request;

abstract class Controller
{
    protected function authPersonalInfoId(Request $request): ?int
    {
        return PersonalInfo::where('user_id', $request->user()->id)->value('id');
    }

    protected function authFamilyInfoId(Request $request): ?int
    {
        $personalInfoId = $this->authPersonalInfoId($request);

        return $personalInfoId ? FamilyInfo::where('personal_info_id', $personalInfoId)->value('id') : null;
    }

    protected function ownedPersonalInfoId(Request $request): int
    {
        $id = $request->input('personal_info_id');
        abort_if(!$id, 422, 'personal_info_id is required.');

        $owned = PersonalInfo::where('id', $id)->where('user_id', $request->user()->id)->exists();
        abort_unless($owned, 403, 'Not your personal info record.');

        return (int) $id;
    }

    protected function ownedFamilyInfoIdForCreate(Request $request): int
    {
        $familyInfoId = FamilyInfo::where('personal_info_id', $this->ownedPersonalInfoId($request))->value('id');
        abort_if(!$familyInfoId, 422, 'Family info must be created first.');

        return $familyInfoId;
    }
}
