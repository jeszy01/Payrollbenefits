import { useState } from "react";
import { Pencil, FileText, Trash2, X } from "lucide-react";

export const DEFAULT_RATES = {
  hoursPerDay: 8,
  daysPerMonth: 22,
  otMultiplier: 1.25,
otRestMultiplier: 1.69,
  sssRate: 5,
  sssMin: 5000,
  sssMax: 35000,
  philRate: 2.5,
  philMin: 10000,
  philMax: 100000,
  pagibigRate: 2,
  pagibigMax: 10000,
};

export const RATE_FIELDS = [
  ["hoursPerDay", "Paid Hours per Day"],
  ["daysPerMonth", "Working Days per Month"],
  ["otMultiplier", "OT Multiplier"],
   ["otRestMultiplier", "Rest Day / Holiday OT Multiplier"],
  ["sssRate", "SSS Employee Rate (%)"],
  ["sssMin", "SSS Minimum MSC"],
  ["sssMax", "SSS Maximum MSC"],
  ["philRate", "PhilHealth Employee Rate (%)"],
  ["philMin", "PhilHealth Salary Floor"],
  ["philMax", "PhilHealth Salary Ceiling"],
  ["pagibigRate", "Pag-IBIG Employee Rate (%)"],
  ["pagibigMax", "Pag-IBIG Max Fund Salary"],
];

const SECTIONS = [
  ["Employee", [["empId", "Employee ID", "text"], ["name", "Name", "text"], ["dailyRate", "Daily Rate"]]],
  ["Attendance", [["daysWorked", "Days Worked"], ["absentDays", "Absent Days"], ["lateMin", "Late (min)"], ["undertimeMin", "Undertime (min)"], ["otHours", "Regular OT (hrs)"], ["otRestHours", "Rest Day / Holiday OT (hrs)"]]],
  ["Leave", [["vlDays", "Vacation Leave (paid days)"], ["slDays", "Sick Leave (paid days)"], ["lwopDays", "Leave Without Pay (days)"]]],
  ["Earnings", [["holidayPay", "Holiday Pay"], ["slConversion", "SL Cash Conversion"], ["transportation", "Transportation Allowance"], ["riceSubsidy", "Rice Subsidy"], ["otherEarnings", "Other Earnings"]]],
  ["Deductions", [["withholdingTax", "Withholding Tax"], ["sssLoan", "SSS Loan"], ["pagibigLoan", "Pag-IBIG Loan"], ["companyLoan", "Company Loan"], ["cashAdvance", "Cash Advance"], ["otherDeductions", "Other Deductions"]]],
];

const HEAD = ["Employee", "Daily Rate", "Days", "Late / UT", "Overtime", "Leave Pay", "Basic Pay", "Earnings", "Gross Pay", "SSS", "PhilHealth", "Pag-IBIG", "Tax", "Loans & Adv.", "Total Deductions", "Net Pay", ""];

const INPUT = "w-full rounded-lg border border-[#e3e7ef] px-3 py-2 text-[13px] outline-none focus:border-[#2f6b86]";
const BTN = "inline-flex items-center gap-2 rounded-lg bg-[#2f6b86] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50";
const GHOST = "inline-flex items-center gap-2 rounded-lg border border-[#e3e7ef] px-4 py-2 text-[13px] font-semibold text-[#6b7794] hover:text-slate-800";

export const n = (v) => Number(v) || 0;
const r2 = (v) => Math.round(v * 100) / 100;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const peso = (v) => "₱" + Number(v || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

function periodLabel(month, cutoff) {
  const [y, m] = month.split("-").map(Number);
  const last = new Date(y, m, 0).getDate();
  const mon = new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short" });
  return cutoff === "1" ? `${mon} 1–15, ${y}` : `${mon} 16–${last}, ${y}`;
}

export function compute(r, R) {
  const rate = n(r.dailyRate);
  const hourly = rate / R.hoursPerDay;
  const monthly = rate * R.daysPerMonth;
  const basic = r2(rate * n(r.daysWorked));
  const overtime = r2(hourly * (R.otMultiplier * n(r.otHours) + R.otRestMultiplier * n(r.otRestHours)));
  const leavePay = r2(rate * (n(r.vlDays) + n(r.slDays)));
  const earnings = r2(overtime + leavePay + n(r.holidayPay) + n(r.slConversion) + n(r.transportation) + n(r.riceSubsidy) + n(r.otherEarnings));
  const gross = r2(basic + earnings);
  const late = r2((hourly / 60) * n(r.lateMin));
  const undertime = r2((hourly / 60) * n(r.undertimeMin));
  const has = rate > 0;
  const sss = has ? r2((clamp(Math.round(monthly / 500) * 500, R.sssMin, R.sssMax) * R.sssRate) / 100 / 2) : 0;
  const phil = has ? r2((clamp(monthly, R.philMin, R.philMax) * R.philRate) / 100 / 2) : 0;
  const pagibig = has ? r2((Math.min(monthly, R.pagibigMax) * R.pagibigRate) / 100 / 2) : 0;
  const tax = n(r.withholdingTax);
  const loans = r2(n(r.sssLoan) + n(r.pagibigLoan) + n(r.companyLoan) + n(r.cashAdvance));
  const deductions = r2(late + undertime + sss + phil + pagibig + tax + loans + n(r.otherDeductions));
    return { basic, overtime, leavePay, earnings, gross, late, undertime, lateUt: r2(late + undertime), sss, phil, pagibig, tax, loans, deductions, net: r2(gross - deductions) };
}

function Modal({ title, onClose, wide, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 ${wide ? "max-w-2xl" : "max-w-md"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="m-0 text-[16px] font-semibold">{title}</h3>
          <button onClick={onClose} className="text-[#6b7794] hover:text-slate-800">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Editor({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const ok = f.empId && f.name && n(f.dailyRate) > 0;
  return (
    <Modal title="Edit Record" onClose={onClose} wide>
      {SECTIONS.map(([title, fields]) => (
        <div key={title} className="mb-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#6b7794]">{title}</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {fields.map(([k, label, type]) => (
              <label key={k} className="block text-[12px] font-medium text-[#6b7794]">
                {label}
                <input
                  type={type || "number"}
                  min="0"
                  step="any"
                  value={f[k] ?? ""}
                  onChange={(e) => set(k, e.target.value)}
                  className={`mt-1 ${INPUT}`}
                />
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className={GHOST}>Cancel</button>
        <button disabled={!ok} onClick={() => onSave(f)} className={BTN}>Save</button>
      </div>
    </Modal>
  );
}

function Line({ label, value, bold }) {
  return (
    <div className={`flex justify-between py-1 text-[13px] ${bold ? "border-t border-[#e3e7ef] pt-2 font-semibold" : ""}`}>
      <span>{label}</span>
      <span>{peso(value)}</span>
    </div>
  );
}

function Shell({ bare, onClose, children }) {
  return bare ? (
    <div className="rounded-xl border border-[#e3e7ef] p-5">{children}</div>
  ) : (
    <Modal title="Payslip" onClose={onClose}>{children}</Modal>
  );
}

function Payslip({ r, c, period, onClose, bare }) {
  const earn = [
    ["Basic Pay", c.basic, 1],
    ["Overtime Pay", c.overtime],
    ["Leave Pay (VL/SL)", c.leavePay],
    ["Holiday Pay", n(r.holidayPay)],
    ["SL Cash Conversion", n(r.slConversion)],
    ["Transportation Allowance", n(r.transportation)],
    ["Rice Subsidy", n(r.riceSubsidy)],
    ["Other Earnings", n(r.otherEarnings)],
  ];
  const ded = [
    ["Late", c.late],
    ["Undertime", c.undertime],
    ["SSS", c.sss, 1],
    ["PhilHealth", c.phil, 1],
    ["Pag-IBIG", c.pagibig, 1],
    ["Withholding Tax", c.tax, 1],
    ["SSS Loan", n(r.sssLoan)],
    ["Pag-IBIG Loan", n(r.pagibigLoan)],
    ["Company Loan", n(r.companyLoan)],
    ["Cash Advance", n(r.cashAdvance)],
    ["Other Deductions", n(r.otherDeductions)],
  ];
  const show = ([, v, always]) => always || v;
  return (
        <Shell bare={bare} onClose={onClose}>
      <div className="text-center">
        <div className="text-[15px] font-semibold">Archon Nell Incorporated</div>
        <div className="text-[12px] text-[#6b7794]">{period}</div>
      </div>
      <div className="my-4 rounded-xl border border-[#e3e7ef] p-3 text-[13px]">
        <div className="font-semibold">{r.name}</div>
        <div className="text-[#6b7794]">
          {r.empId} · {peso(r.dailyRate)}/day · {n(r.daysWorked)} days worked · {n(r.absentDays)} absent
        </div>
      </div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#6b7794]">Earnings</div>
      {earn.filter(show).map(([l, v]) => <Line key={l} label={l} value={v} />)}
      <Line label="Gross Pay" value={c.gross} bold />
      <div className="mb-1 mt-4 text-[11px] font-semibold uppercase tracking-wide text-[#6b7794]">Deductions</div>
      {ded.filter(show).map(([l, v]) => <Line key={l} label={l} value={v} />)}
      <Line label="Total Deductions" value={c.deductions} bold />
      <div className="mt-4 flex justify-between rounded-xl bg-[#2f6b86] px-4 py-3 text-white">
        <span className="font-semibold">Net Pay</span>
        <span className="font-semibold">{peso(c.net)}</span>
      </div>
      <div className="mt-8 border-t border-slate-400 pt-1 text-center text-[12px] text-[#6b7794]">Received by</div>
    </Shell>
  );
}

export default function Payroll() {
  const today = new Date();
  const [month, setMonth] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);
  const [cutoff, setCutoff] = useState(today.getDate() <= 15 ? "1" : "2");
  const key = `payroll:${month}:${cutoff}`;
  const [rows, setRows] = useState(() => read(key, []));
  const rates = { ...DEFAULT_RATES, ...read("payroll:rates", {}) };
  const [editing, setEditing] = useState(null);
  const [slip, setSlip] = useState(null);
  const [generated, setGenerated] = useState(false);

  const switchPeriod = (m, c) => {
    setMonth(m);
    setCutoff(c);
    setRows(read(`payroll:${m}:${c}`, []));
  };
  const commit = (next) => {
    setRows(next);
    write(key, next);
  };
  const save = (rec) => {
    commit(rows.map((r) => (r.id === rec.id ? rec : r)));
    setEditing(null);
  };
  const remove = (id) => {
    if (window.confirm("Delete this record?")) commit(rows.filter((r) => r.id !== id));
  };

  const computed = rows.map((r) => ({ r, c: compute(r, rates) }));
  const sum = (k) => r2(computed.reduce((a, x) => a + x.c[k], 0));
  const period = periodLabel(month, cutoff);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input type="month" value={month} onChange={(e) => e.target.value && switchPeriod(e.target.value, cutoff)} className={`${INPUT} !w-auto`} />
        <select value={cutoff} onChange={(e) => switchPeriod(month, e.target.value)} className={`${INPUT} !w-auto`}>
          <option value="1">1st Cutoff (1–15)</option>
          <option value="2">2nd Cutoff (16–end)</option>
        </select>
               <button onClick={() => setGenerated(true)} disabled={rows.length === 0} className={`${BTN} ml-auto`}>
          <FileText size={15} /> Generate Payslip
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Employees", rows.length, false],
          ["Gross Pay", sum("gross"), true],
          ["Total Deductions", sum("deductions"), true],
          ["Net Pay", sum("net"), true],
        ].map(([label, v, money]) => (
          <div key={label} className="rounded-2xl border border-[#e3e7ef] bg-white p-4">
            <div className="text-[12px] text-[#6b7794]">{label}</div>
            <div className="mt-1 text-[18px] font-semibold">{money ? peso(v) : v}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-[#e3e7ef] bg-white">
        <table className="w-full min-w-[1400px] text-[13px]">
          <thead>
            <tr className="border-b border-[#e3e7ef] text-left text-[11px] uppercase tracking-wide text-[#6b7794]">
              {HEAD.map((h) => (
                <th key={h} className="px-3 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {computed.length === 0 ? (
              <tr>
                <td colSpan={HEAD.length} className="px-4 py-10 text-center text-[#6b7794]">No records yet.</td>
              </tr>
            ) : (
              computed.map(({ r, c }) => (
                <tr key={r.id} className="border-b border-[#e3e7ef] last:border-0">
                  <td className="px-3 py-3">
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-[11px] text-[#6b7794]">{r.empId}</div>
                  </td>
                                   <td className="px-3 py-3">{peso(r.dailyRate)}</td>
                  <td className="px-3 py-3">{n(r.daysWorked)}</td>
                  <td className="px-3 py-3">{peso(c.lateUt)}</td>
                  <td className="px-3 py-3">{peso(c.overtime)}</td>
                  <td className="px-3 py-3">{peso(c.leavePay)}</td>
                  <td className="px-3 py-3">{peso(c.basic)}</td>
                  <td className="px-3 py-3">{peso(c.earnings)}</td>
                  <td className="px-3 py-3 font-semibold">{peso(c.gross)}</td>
                  <td className="px-3 py-3">{peso(c.sss)}</td>
                  <td className="px-3 py-3">{peso(c.phil)}</td>
                  <td className="px-3 py-3">{peso(c.pagibig)}</td>
                  <td className="px-3 py-3">{peso(c.tax)}</td>
                  <td className="px-3 py-3">{peso(c.loans)}</td>
                  <td className="px-3 py-3">{peso(c.deductions)}</td>
                  <td className="px-3 py-3 font-semibold text-[#2f6b86]">{peso(c.net)}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2 text-[#6b7794]">
                      <button title="Payslip" onClick={() => setSlip({ r, c })} className="hover:text-slate-800"><FileText size={16} /></button>
                      <button title="Edit" onClick={() => setEditing(r)} className="hover:text-slate-800"><Pencil size={16} /></button>
                      <button title="Delete" onClick={() => remove(r.id)} className="hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && <Editor initial={editing} onSave={save} onClose={() => setEditing(null)} />}
          {slip && <Payslip r={slip.r} c={slip.c} period={period} onClose={() => setSlip(null)} />}
      {generated && (
        <Modal title={`Payslips · ${period}`} onClose={() => setGenerated(false)} wide>
          <div className="space-y-6">
            {computed.map(({ r, c }) => (
              <Payslip key={r.id} r={r} c={c} period={period} bare />
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
