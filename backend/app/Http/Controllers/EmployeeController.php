<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        return Employee::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'employee_no'   => 'required|string|max:50|unique:employees,employee_no',
            'name'          => 'required|string|max:255',
            'email'         => 'nullable|email|max:255',
            'position'      => 'required|string|max:255',
            'department'    => 'required|string|max:255',
            'date_hired'    => 'required|date',
            'basic_salary'  => 'required|numeric|min:0',
            'position_rate' => 'required|numeric|min:0',
            'status'        => 'required|in:Active,Inactive,On Leave',
        ]);

        return response()->json(Employee::create($data), 201);
    }
}
