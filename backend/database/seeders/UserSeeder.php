<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['employee_id' => 'ADMIN001'],
            [
                'name' => 'Admin',
                'email' => env('RESEND_EMAIL_1'),
                'role' => 'admin',
                'password' => Hash::make(env('SEED_ADMIN_PASSWORD')),
            ]
        );

        User::updateOrCreate(
            ['employee_id' => 'HR001'],
            [
                'name' => 'HR',
                'email' => env('RESEND_EMAIL_2'),
                'role' => 'hr',
                'password' => Hash::make(env('SEED_HR_PASSWORD')),
            ]
        );
    }
}
