import { useState } from "react";
import { Plus } from "lucide-react";
import { read, n } from "./Payroll";

const write = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

const INPUT = "w-full rounded-lg border border-[#e3e7ef] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#2f6b86] disabled:bg-[#f6f8fb]";
const BTN = "inline-flex items-center gap-2 rounded-lg bg-[#2f6b86] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50";
const GHOST = "inline-flex items-center gap-2 rounded-lg border border-[#e3e7ef] px-4 py-2 text-[13px] font-semibold text-[#6b7794] hover:text-slate-800";

const STATUSES = ["Present", "Absent", "On Leave", "Day Off"];
const DEFAULT_SCHEDULE = { start: "08:00", end: "17:00", otMin: 5 };
const HEAD = ["Date", "Employee", "Time In", "Time Out", "Late (min)", "Undertime (min)", "OT (min)", "Status"];

const mins = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

function calc(r, S) {
  const z = { late: 0, under: 0, ot: 0 };
  if (r.status !== "Present" || !r.timeIn) return z;
  const late = Math.max(0, mins(r.timeIn) - mins(S.start));
  if (!r.timeOut) return { ...z, late };
  const out = mins(r.timeOut);
  const extra = Math.max(0, out - mins(S.end));
  return { late, under: Math.max(0, mins(S.end) - out), ot: extra >= n(S.otMin) ? extra : 0 };
}

const BADGE = {
  Present: "bg-green-100 text-green-700",
  Late: "bg-amber-100 text-amber-700",
  Absent: "bg-red-100 text-red-700",
  "On Leave": "bg-blue-100 text-blue-700",
  "Day Off": "bg-slate-100 text-slate-600",
};

export default function TimeAttendance() {
  const t = new Date();
  const todayStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  const [records, setRecords] = useState(() => read("attendance:records", []));
  const [sched, setSched] = useState(() => ({ ...DEFAULT_SCHEDULE, ...read("attendance:schedule", {}) }));
  const [date, setDate] = useState(todayStr);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(null);

  const setSchedule = (k, v) => {
    const next = { ...sched, [k]: v };
    setSched(next);
    write("attendance:schedule", next);
  };

  const save = () => {
    if (records.some((r) => r.empId === form.empId && r.date === form.date)) {
      window.alert("Attendance for this employee and date already exists.");
      return;
    }
    const next = [...records, { ...form, id: Date.now() }];
    setRecords(next);
    write("attendance:records", next);
    setForm(null);
  };

  const present = form?.status === "Present";
  const canSave = form && form.empId.trim() && form.name.trim() && form.date && (!present || form.timeIn);

  const shown = records
    .filter((r) => (!date || r.date === date) && (!q || `${r.empId} ${r.name}`.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => b.date.localeCompare(a.date) || a.name.localeCompare(b.name));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${INPUT} !w-auto`} />
        <input placeholder="Search employee" value={q} onChange={(e) => setQ(e.target.value)} className={`${INPUT} !w-56`} />
        <button
          onClick={() => setForm({ empId: "", name: "", date: date || todayStr, status: "Present", timeIn: "", timeOut: "" })}
          className={`${BTN} ml-auto`}
        >
          <Plus size={15} /> Add Record
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 sm:max-w-md">
        <label className="block text-[12px] font-medium text-[#6b7794]">
          Shift Start
          <input type="time" value={sched.start} onChange={(e) => setSchedule("start", e.target.value)} className={`mt-1 ${INPUT}`} />
        </label>
        <label className="block text-[12px] font-medium text-[#6b7794]">
          Shift End
          <input type="time" value={sched.end} onChange={(e) => setSchedule("end", e.target.value)} className={`mt-1 ${INPUT}`} />
        </label>
        <label className="block text-[12px] font-medium text-[#6b7794]">
          OT Threshold (min)
          <input type="number" min="0" value={sched.otMin} onChange={(e) => setSchedule("otMin", e.target.value)} className={`mt-1 ${INPUT}`} />
        </label>
      </div>

      {form && (
        <div className="mt-4 rounded-2xl border border-[#e3e7ef] bg-white p-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <label className="block text-[12px] font-medium text-[#6b7794]">
              Employee ID
              <input value={form.empId} onChange={(e) => setForm({ ...form, empId: e.target.value })} className={`mt-1 ${INPUT}`} />
            </label>
            <label className="block text-[12px] font-medium text-[#6b7794]">
              Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`mt-1 ${INPUT}`} />
            </label>
            <label className="block text-[12px] font-medium text-[#6b7794]">
              Date
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={`mt-1 ${INPUT}`} />
            </label>
            <label className="block text-[12px] font-medium text-[#6b7794]">
              Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={`mt-1 ${INPUT}`}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="block text-[12px] font-medium text-[#6b7794]">
              Time In
              <input type="time" disabled={!present} value={form.timeIn} onChange={(e) => setForm({ ...form, timeIn: e.target.value })} className={`mt-1 ${INPUT}`} />
            </label>
            <label className="block text-[12px] font-medium text-[#6b7794]">
              Time Out
              <input type="time" disabled={!present} value={form.timeOut} onChange={(e) => setForm({ ...form, timeOut: e.target.value })} className={`mt-1 ${INPUT}`} />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setForm(null)} className={GHOST}>Cancel</button>
            <button onClick={save} disabled={!canSave} className={BTN}>Save</button>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-2xl border border-[#e3e7ef] bg-white">
        <table className="w-full min-w-[820px] text-[13px]">
          <thead>
            <tr className="border-b border-[#e3e7ef] text-left text-[11px] uppercase tracking-wide text-[#6b7794]">
              {HEAD.map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 ? (
              <tr>
                <td colSpan={HEAD.length} className="px-4 py-10 text-center text-[#6b7794]">No records yet.</td>
              </tr>
            ) : (
              shown.map((r) => {
                const c = calc(r, sched);
                const status = r.status === "Present" && c.late > 0 ? "Late" : r.status;
                return (
                  <tr key={r.id} className="border-b border-[#e3e7ef] last:border-0">
                    <td className="px-4 py-3">{r.date}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-[11px] text-[#6b7794]">{r.empId}</div>
                    </td>
                    <td className="px-4 py-3">{r.timeIn || "—"}</td>
                    <td className="px-4 py-3">{r.timeOut || "—"}</td>
                    <td className="px-4 py-3">{c.late}</td>
                    <td className="px-4 py-3">{c.under}</td>
                    <td className="px-4 py-3">{c.ot}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${BADGE[status]}`}>{status}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}