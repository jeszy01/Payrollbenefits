<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'employee_no', 'name', 'email', 'position', 'department',
        'date_hired', 'basic_salary', 'position_rate', 'status',
    ];

    protected $casts = [
        'date_hired' => 'date:Y-m-d',
        'basic_salary' => 'float',
        'position_rate' => 'float',
    ];
}
