<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\OtpMailer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'employee_id' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('employee_id', $data['employee_id'])->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        $code = (string) random_int(100000, 999999);
        Cache::put("otp:{$user->id}", Hash::make($code), now()->addMinutes(5));
        OtpMailer::send($user->email, $code);

        return response()->json(['message' => 'Code sent']);
    }

    public function verify(Request $request)
    {
        $data = $request->validate([
            'employee_id' => 'required|string',
            'code' => 'required|string',
        ]);

        $user = User::where('employee_id', $data['employee_id'])->first();
        $hash = $user ? Cache::get("otp:{$user->id}") : null;

        if (!$hash || !Hash::check($data['code'], $hash)) {
            return response()->json(['message' => 'Invalid or expired code'], 422);
        }

        Cache::forget("otp:{$user->id}");

        return response()->json([
            'token' => $user->createToken('web')->plainTextToken,
            'user' => $user->only('id', 'name', 'email', 'role'),
        ]);
    }
}
