<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $t) {
            $t->id();
            $t->string('employee_no')->unique();
            $t->string('name');
            $t->string('email')->nullable();
            $t->string('position');
            $t->string('department');
            $t->date('date_hired');
            $t->decimal('basic_salary', 12, 2);
            $t->decimal('position_rate', 12, 2);
            $t->string('status')->default('Active');
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
