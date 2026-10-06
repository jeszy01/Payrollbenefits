import { useEffect, useMemo, useState } from "react";
import { Download, Plus, Search } from "lucide-react";
import { getEmployees } from "../api.js";
import AddEmployeeModal from "../components/AddEmployeeModal";

const toRow = (e) => ({
  id: e.id,
  name: e.name,
  email: e.email,
  position: e.position,
  department: e.department,
  employeeNo: e.employee_no,
  dateHired: e.date_hired,
  basicSalary: e.basic_salary,
  positionRate: e.position_rate,
  status: e.status,
});

const peso = (n) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n ?? 0);

const statusStyle = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-600",
  "On Leave": "bg-amber-50 text-amber-700",
};

const columns = [
  "Employee",
  "Position / Dept",
  "Employee #",
  "Date Hired",
  "Basic Salary",
  "Position Rate",
  "Status",
];

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    getEmployees()
      .then((list) => setEmployees(list.map(toRow)))
      .catch((err) => setLoadError(err.message));
  }, []);

  const departments = useMemo(
    () => [...new Set(employees.map((e) => e.department).filter(Boolean))],
    [employees]
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return employees.filter(
      (e) =>
        (!q || [e.name, e.employeeNo, e.email].some((v) => v?.toLowerCase().includes(q))) &&
        (!dept || e.department === dept) &&
        (!status || e.status === status)
    );
  }, [employees, query, dept, status]);

  const exportCsv = () => {
    const head = ["Name", "Email", "Position", "Department", "Employee #", "Date Hired", "Basic Salary", "Position Rate", "Status"];
    const lines = rows.map((e) =>
      [e.name, e.email, e.position, e.department, e.employeeNo, e.dateHired, e.basicSalary, e.positionRate, e.status]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const blob = new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "employees.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="m-0 text-[22px] font-semibold">Employees</h1>
          <p className="mt-1 max-w-[360px] text-[12.5px] text-[#6b7794]">
            Employee master list — ID, department, position, position rate & basic salary
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-lg border border-[#e3e7ef] bg-white px-3.5 py-2 text-[13px] font-semibold"
          >
            <Download size={15} /> Export CSV
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#2f6b86] bg-[#2f6b86] px-3.5 py-2 text-[13px] font-semibold text-white"
          >
            <Plus size={15} /> Add Employee
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#e3e7ef] bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-[#e3e7ef] bg-[#f7f9fc] px-3 py-2.5 text-[#6b7794]">
            <Search size={15} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, ID, email..."
              className="w-full bg-transparent text-[13px] text-slate-800 outline-none"
            />
          </div>

          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="rounded-lg border border-[#e3e7ef] bg-white px-3 py-2.5 text-[13px]"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-[#e3e7ef] bg-white px-3 py-2.5 text-[13px]"
          >
            <option value="">All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>On Leave</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-[#e3e7ef]">
          <table className="w-full min-w-[820px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#e3e7ef] text-[11px] uppercase tracking-wide text-[#6b7794]">
                {columns.map((c) => (
                  <th key={c} className="px-4 py-3.5 font-bold">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-[#6b7794]">
                    No employees found.
                  </td>
                </tr>
              ) : (
                rows.map((e) => (
                  <tr key={e.id} className="border-b border-[#eef1f6] last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#2a4a8d] text-xs font-semibold text-white">
                          {e.name?.[0]?.toUpperCase()}
                        </span>
                        <div>
                          <div className="font-semibold">{e.name}</div>
                          <div className="text-[11.5px] text-[#6b7794]">{e.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{e.position}</div>
                      <div className="text-[11.5px] text-[#6b7794]">{e.department}</div>
                    </td>
                    <td className="px-4 py-3">{e.employeeNo}</td>
                    <td className="px-4 py-3">{e.dateHired}</td>
                    <td className="px-4 py-3">{peso(e.basicSalary)}</td>
                    <td className="px-4 py-3">{peso(e.positionRate)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
                          statusStyle[e.status] ?? "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {loadError && <p className="mt-3 text-[13px] text-red-700">{loadError}</p>}
      {showAdd && (
        <AddEmployeeModal
          onClose={() => setShowAdd(false)}
          onSaved={(saved) => {
            setEmployees((prev) => [...prev, toRow(saved)]);
            setShowAdd(false);
          }}
        />
      )}
    </>
  );
}