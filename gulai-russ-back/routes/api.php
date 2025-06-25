<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use App\Http\Controllers\TourController;
use App\Http\Controllers\FeedbackController; 

// === Публичные маршруты ===
Route::get('/tours', [TourController::class, 'index']);
Route::get('/tours/{id}', [TourController::class, 'show']);

Route::post('/feedback', [FeedbackController::class, 'send']);

// === Отладочный маршрут для проверки авторизации ===
Route::middleware('auth:sanctum')->get('/debug-user', function (Request $request) {
    return response()->json([
        'auth' => Auth::check(),
        'user' => Auth::user(),
        'session_id' => Session::getId(),
        'cookies' => $_COOKIE,
    ]);
});
