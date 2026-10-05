<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class CreateEmployee extends Command
{
    protected $signature = 'employee:create {employee_id} {name} {--role=admin} {--password=} {--skip-existing}';

    protected $description = 'Create an employee account (password from --password, ADMIN_PASSWORD env, or prompt)';

    public function handle(): int
    {
        $id = $this->argument('employee_id');

        if (User::where('employee_id', $id)->exists()) {
            $this->line("Employee {$id} already exists.");

            return $this->option('skip-existing') ? self::SUCCESS : self::FAILURE;
        }

        $password = $this->option('password') ?: getenv('ADMIN_PASSWORD') ?: $this->secret('Password');

        if (! $password || strlen($password) < 8) {
            $this->error('A password of at least 8 characters is required.');

            return self::FAILURE;
        }

        User::create([
            'employee_id' => $id,
            'name' => $this->argument('name'),
            'role' => $this->option('role'),
            'password' => $password,
        ]);

        $this->info("Created {$id}.");

        return self::SUCCESS;
    }
}
