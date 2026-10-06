import { useState } from "react";
import { DEFAULT_RATES, compute, read, peso, n } from "./Payroll";

const HEAD = ["Employee", "SSS", "PhilHealth", "Pag-IBIG", "Tax", "SSS Loan", "Pag-IBIG Loan", "Company Loan", "Cash Advance", "Late / UT", "Other", "Total"];

const INPUT = "rounded-lg border border-[#e3e7ef] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#2f6b86]";

const cells = (r, c) => [
  c.sss, c.phil, c.pagibig, c.tax,
  n(r.sssLoan), n(r.pagibigLoan), n(r.companyLoan), n(r.cashAdvance),
  c.lateUt, n(r.otherDeductions), c.deductions,
];

export default function Deductions() {
  const today = new Date();
  const [month, setMonth] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);
  const [cutoff, setCutoff] = useState(today.getDate() <= 15 ? "1" : "2");

  const rates = { ...DEFAULT_RATES, ...read("payroll:rates", {}) };
  const rows = read(`payroll:${month}:${cutoff}`, []).map((r) => ({ r, row: cells(r, compute(r, rates)) }));
  const totals = HEAD.slice(1).map((_, i) => rows.reduce((a, x) => a + x.row[i], 0));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input type="month" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} className={INPUT} />
        <select value={cutoff} onChange={(e) => setCutoff(e.target.value)} className={INPUT}>
          <option value="1">1st Cutoff (1–15)</option>
          <option value="2">2nd Cutoff (16–end)</option>
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-[#e3e7ef] bg-white">
        <table className="w-full min-w-[1100px] text-[13px]">
          <thead>
            <tr className="border-b border-[#e3e7ef] text-left text-[11px] uppercase tracking-wide text-[#6b7794]">
              {HEAD.map((h) => (
                <th key={h} className="px-3 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={HEAD.length} className="px-4 py-10 text-center text-[#6b7794]">No records yet.</td>
              </tr>
            ) : (
              <>
                {rows.map(({ r, row }) => (
                  <tr key={r.id} className="border-b border-[#e3e7ef]">
                    <td className="px-3 py-3">
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-[11px] text-[#6b7794]">{r.empId}</div>
                    </td>
                    {row.map((v, i) => (
                      <td key={i} className={`px-3 py-3 ${i === row.length - 1 ? "font-semibold" : ""}`}>{peso(v)}</td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-[#f6f8fb] font-semibold">
                  <td className="px-3 py-3">Total</td>
                  {totals.map((v, i) => (
                    <td key={i} className="px-3 py-3">{peso(v)}</td>
                  ))}
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}