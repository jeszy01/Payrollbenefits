<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrNew(['employee_id' => env('ADMIN_EMPLOYEE_ID', 'EMP-0001')]);
        $user->forceFill([
            'name' => 'Admin',
            'email' => env('ADMIN_EMAIL'),
            'password' => Hash::make(env('ADMIN_PASSWORD')),
            'role' => 'admin',
        ])->save();
    }
}
