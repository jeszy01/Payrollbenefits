<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        if (! env('ADMIN_EMAIL') || ! env('ADMIN_PASSWORD')) {
            return;
        }

        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL')],
            [
                'employee_id' => 'ADMIN001',
                'name' => 'Admin',
                'role' => 'admin',
                'password' => env('ADMIN_PASSWORD'),
            ]
        );
    }
}
