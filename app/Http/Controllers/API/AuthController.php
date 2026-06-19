<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|string|unique:users,username|max:100',
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'nullable|string',
        ]);

        $user = User::create([
            'username' => $data['username'],
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => $data['role'] ?? 'user',
        ]);

        $token = $user->createToken('rcn-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)
                    ->orWhere('email', $request->username)
                    ->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('rcn-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateSettings(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'             => 'sometimes|string|max:255',
            'email'            => 'sometimes|email|unique:users,email,' . $user->id,
            'username'         => 'sometimes|string|unique:users,username,' . $user->id,
            'current_password' => 'required_with:password|string',
            'password'         => 'nullable|string|min:6|confirmed',
        ]);

        if (isset($data['password'])) {
            if (! Hash::check($data['current_password'], $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['Current password is incorrect.'],
                ]);
            }
            $data['password'] = Hash::make($data['password']);
        }

        $user->update(collect($data)->except(['current_password'])->toArray());

        return response()->json($user);
    }
}
