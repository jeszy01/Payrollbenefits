import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createEmployee } from "../api.js";

const empty = {
  employee_no: "", name: "", email: "", position: "", department: "",
  date_hired: "", basic_salary: "", position_rate: "", status: "Active",
};

const input =
  "w-full rounded-lg border border-[#e3e7ef] bg-white px-3 py-2.5 text-[13px] outline-none focus:border-[#2f6b86]";

function Field({ label, children }) {
  return (
    <label className="block text-[12.5px] font-semibold text-slate-700">
      {label}
      <div className="mt-1 font-normal">{children}</div>
    </label>
  );
}

export default function AddEmployeeModal({ onClose, onSaved }) {
  const [f, setF] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const saved = await createEmployee({
        ...f,
        email: f.email.trim() || null,
        basic_salary: Number(f.basic_salary),
        position_rate: Number(f.position_rate),
      });
      onSaved(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <form
        onSubmit={submit}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="m-0 text-lg font-semibold">Add Employee</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Employee #">
            <input className={input} value={f.employee_no} onChange={set("employee_no")} required />
          </Field>
          <Field label="Date Hired">
            <input type="date" className={input} value={f.date_hired} onChange={set("date_hired")} required />
          </Field>
          <Field label="Full Name">
            <input className={input} value={f.name} onChange={set("name")} required />
          </Field>
          <Field label="Email (optional)">
            <input type="email" className={input} value={f.email} onChange={set("email")} />
          </Field>
          <Field label="Position">
            <input className={input} value={f.position} onChange={set("position")} required />
          </Field>
          <Field label="Department">
            <input className={input} value={f.department} onChange={set("department")} required />
          </Field>
          <Field label="Basic Salary">
            <input type="number" min="0" step="0.01" className={input} value={f.basic_salary} onChange={set("basic_salary")} required />
          </Field>
          <Field label="Position Rate">
            <input type="number" min="0" step="0.01" className={input} value={f.position_rate} onChange={set("position_rate")} required />
          </Field>
          <Field label="Status">
            <select className={input} value={f.status} onChange={set("status")}>
              <option>Active</option>
              <option>Inactive</option>
              <option>On Leave</option>
            </select>
          </Field>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#e3e7ef] bg-white px-4 py-2 text-[13px] font-semibold"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2f6b86] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? "Saving…" : "Save Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}