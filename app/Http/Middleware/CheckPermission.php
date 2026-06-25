<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $key): Response
    {
        $user = $request->user();

        // ✅ មិន authenticate
        if (!$user) {
            abort(401, 'Unauthenticated.');
        }

        // ✅ Admin bypass — Admin ចូលបានគ្រប់ route
        if ($user->isAdmin()) {
            return $next($request);
        }

        // ✅ Support OR logic ដោយ | separator
        // ឧ. 'VIEW_ROLE|VIEW_ROLE_PERMISSION' → user ត្រូវមានមួយក្នុងចំណោមនេះ
        $keys = array_map('trim', explode('|', $key));

        foreach ($keys as $permission) {
            if ($user->hasPermission($permission)) {
                return $next($request); // ✅ មានសិទ្ធិ — allow
            }
        }

        // ❌ គ្មានសិទ្ធិណាមួយ
        abort(403, 'You do not have permission to perform this action.');
    }
}