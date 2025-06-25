<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AdminController;

Route::middleware('web')->group(function () {
    // === Аутентификация ===
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/register', [AuthController::class, 'register']);

    // === Получение текущего пользователя (user + is_admin) ===
    Route::get('/user', [AuthController::class, 'me']);

    // === Защищённые маршруты (авторизованные пользователи) ===
    Route::middleware('auth')->group(function () {
        // Бронирования
        Route::get('/bookings', [BookingController::class, 'index']);
        Route::middleware('auth:sanctum')->post('/bookings', [BookingController::class, 'store']);
        Route::get('/admin/schema', [AdminController::class, 'dumpSchema']);

        // === Админка: вручную через Route::group (чтобы обойти ошибку с Closure)
        Route::group([
            'middleware' => function ($request, $next) {
                if (!session('is_admin')) {
                    return response()->json(['message' => 'Forbidden'], 403);
                }
                return $next($request);
            }
        ], function () {
            // Таблицы
            Route::get('/api/admin/tables', [AdminController::class, 'listTables']);
            Route::get('/api/admin/tables/{table}', [AdminController::class, 'getTableData']);
            Route::post('/api/admin/tables/{table}', [AdminController::class, 'createRecord']);
            Route::put('/api/admin/tables/{table}/{id}', [AdminController::class, 'updateRecord']);
            Route::delete('/api/admin/tables/{table}/{id}', [AdminController::class, 'deleteRecord']);

            // Представления
            Route::get('/api/admin/views', [AdminController::class, 'listViews']);
            Route::get('/api/admin/views/{view}', [AdminController::class, 'getViewData']);
        });
    });

    

    // === Debug route: отладка сессии, пользователя и куки ===
    Route::get('/debug-session', function (Request $request) {
        $user = Auth::user();
        $sessionId = Session::getId();
        $cookies = $request->cookies->all();

        Log::info('Session Debug', [
            'session_id' => $sessionId,
            'user_id'    => $user?->id,
            'user_email' => $user?->email,
            'cookies'    => $cookies,
        ]);

        return response()->json([
            'message'    => 'Отладочная информация о сессии',
            'session_id' => $sessionId,
            'user'       => $user,
            'cookies'    => $cookies,
        ]);
    });
});
