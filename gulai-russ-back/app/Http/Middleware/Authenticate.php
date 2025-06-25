<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    protected function redirectTo($request)
    {
        // Возвращаем JSON вместо редиректа на /login
        if (! $request->expectsJson()) {
            abort(response()->json([
                'message' => 'Unauthenticated.',
            ], 401));
        }
    }
}
