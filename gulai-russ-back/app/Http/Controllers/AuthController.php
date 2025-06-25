<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Регистрация нового пользователя
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|string|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        Auth::login($user); // автоматически логинит
        $request->session()->regenerate();
        session(['is_admin' => false]); // обычный пользователь

        Log::info('User registered and logged in', [
            'user_id' => $user->id,
            'session_id' => Session::getId(),
        ]);

        return response()->json([
            'message' => 'Пользователь зарегистрирован',
            'user' => $user,
            'is_admin' => false,
        ], 201);
    }

    /**
     * Вход пользователя
     */
    public function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');

        Log::info('Login attempt', ['email' => $email]);

        // === Админский логин напрямую ===
        if ($email === 'admin@gmail.com' && $password === 'admin') {
            $adminUser = User::where('email', 'admin')->first();

            if (!$adminUser) {
                $adminUser = User::create([
                    'name' => 'Админ',
                    'email' => 'admin',
                    'password' => bcrypt('admin'),
                ]);
            }

            Auth::login($adminUser);
            $request->session()->regenerate();
            session(['is_admin' => true]);

            Log::info('Admin login success', [
                'user_id' => $adminUser->id,
                'session_id' => Session::getId(),
            ]);

            return response()->json([
                'message' => 'Админ вошёл',
                'user' => $adminUser,
                'is_admin' => true,
            ]);
        }

        // === Обычная проверка логина ===
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            Log::warning('Login failed', ['email' => $email]);

            return response()->json(['message' => 'Неверный email или пароль'], 422);
        }

        $request->session()->regenerate();
        session(['is_admin' => false]);

        Log::info('Login success', [
            'user_id' => Auth::id(),
            'session_id' => Session::getId(),
        ]);

        return response()->json([
            'message' => 'Вход выполнен',
            'user' => Auth::user(),
            'is_admin' => false,
        ]);
    }

    /**
     * Выход пользователя
     */
    public function logout(Request $request)
    {
        Log::info('Logout initiated', [
            'user_id' => Auth::id(),
            'session_id' => Session::getId(),
        ]);

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Log::info('Logout complete');

        return response()->json(['message' => 'Выход выполнен']);
    }

    /**
     * Получение текущего пользователя
     */
    public function me(Request $request)
    {
        $user = Auth::user();
        $isAdmin = session('is_admin', false);

        Log::info('me() called', [
            'user' => $user,
            'is_admin' => $isAdmin,
            'session_id' => Session::getId(),
        ]);

        return response()->json([
            'user' => $user,
            'is_admin' => $isAdmin,
        ]);
    }
}
