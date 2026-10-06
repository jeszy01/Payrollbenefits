import { useState } from "react";
import { BadgeDollarSign, FileEdit, Gift, Scale, Plus, Pencil, Trash2 } from "lucide-react";
import { DEFAULT_RATES, RATE_FIELDS, read, peso, n } from "./Payroll";

const write = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

const INPUT = "w-full rounded-lg border border-[#e3e7ef] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#2f6b86] disabled:bg-[#f6f8fb]";
const BTN = "inline-flex items-center gap-2 rounded-lg bg-[#2f6b86] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50";
const GHOST = "inline-flex items-center gap-2 rounded-lg border border-[#e3e7ef] px-4 py-2 text-[13px] font-semibold text-[#6b7794] hover:text-slate-800";

const getRates = () => ({ ...DEFAULT_RATES, ...read("payroll:rates", {}) });

function Crud({ storeKey, fields, extra, approval }) {
  const [items, setItems] = useState(() => read(storeKey, []));
  const extras = extra ? [].concat(extra) : [];
  const [form, setForm] = useState(null);
  const commit = (next) => {
    setItems(next);
    write(storeKey, next);
  };
  const blank = Object.fromEntries(fields.map(([k, , , opts]) => [k, opts ? opts[0] : ""]));
  const save = () => {
    const rec = form.id ? form : { ...form, id: Date.now(), ...(approval ? { status: "Pending" } : {}) };
    commit(form.id ? items.map((i) => (i.id === rec.id ? rec : i)) : [...items, rec]);
    setForm(null);
  };
  const setStatus = (id, status) => commit(items.map((i) => (i.id === id ? { ...i, status } : i)));
  const remove = (id) => {
    if (window.confirm("Delete this record?")) commit(items.filter((i) => i.id !== id));
  };
  const show = (type, v) => (type === "number" ? peso(v) : v);
  const head = [...fields.map(([, l]) => l), ...extras.map((e) => e.label), ...(approval ? ["Status"] : []), ""];

  return (
    <div>
      <div className="flex justify-end">
        <button onClick={() => setForm(blank)} className={BTN}>
          <Plus size={15} /> Add
        </button>
      </div>

      {form && (
        <div className="mt-4 rounded-2xl border border-[#e3e7ef] bg-white p-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {fields.map(([k, label, type, opts]) => (
              <label key={k} className="block text-[12px] font-medium text-[#6b7794]">
                {label}
                {opts ? (
                  <select value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={`mt-1 ${INPUT}`}>
                    {opts.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={type}
                    min="0"
                    step="any"
                    value={form[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    className={`mt-1 ${INPUT}`}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setForm(null)} className={GHOST}>Cancel</button>
            <button onClick={save} disabled={fields.some(([k, , t]) => t !== "textarea" && !String(form[k]).trim())} className={BTN}>Save</button>
          </div>
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-2xl border border-[#e3e7ef] bg-white">
        <table className="w-full min-w-[640px] text-[13px]">
          <thead>
            <tr className="border-b border-[#e3e7ef] text-left text-[11px] uppercase tracking-wide text-[#6b7794]">
              {head.map((h, i) => <th key={i} className="px-4 py-3 font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={head.length} className="px-4 py-10 text-center text-[#6b7794]">No records yet.</td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it.id} className="border-b border-[#e3e7ef] last:border-0">
                  {fields.map(([k, , type]) => (
                    <td key={k} className="px-4 py-3">{show(type, it[k])}</td>
                  ))}
                                   {extras.map((e) => (
                    <td key={e.label} className="px-4 py-3">{e.fn(it)}</td>
                  ))}
                  {approval && (
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        it.status === "Approved" ? "bg-green-100 text-green-700" : it.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>{it.status}</span>
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-[#6b7794]">
                      {approval && it.status === "Pending" && (
                        <>
                          <button onClick={() => setStatus(it.id, "Approved")} className="text-[12px] font-semibold text-green-700">Approve</button>
                          <button onClick={() => setStatus(it.id, "Rejected")} className="text-[12px] font-semibold text-red-600">Reject</button>
                        </>
                      )}
                      <button title="Edit" onClick={() => setForm(it)} className="hover:text-slate-800"><Pencil size={16} /></button>
                      <button title="Delete" onClick={() => remove(it.id)} className="hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Statutory() {
  const [rates, setRates] = useState(getRates);
  const [f, setF] = useState(rates);
  const [edit, setEdit] = useState(false);
  const save = () => {
    const next = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, n(v)]));
    setRates(next);
    setF(next);
    write("payroll:rates", next);
    setEdit(false);
  };
  const cancel = () => {
    setF(rates);
    setEdit(false);
  };
  return (
    <div className="rounded-2xl border border-[#e3e7ef] bg-white p-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {RATE_FIELDS.map(([k, label]) => (
          <label key={k} className="block text-[12px] font-medium text-[#6b7794]">
            {label}
            <input type="number" min="0" step="any" disabled={!edit} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={`mt-1 ${INPUT}`} />
          </label>
        ))}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        {edit ? (
          <>
            <button onClick={() => setF(DEFAULT_RATES)} className={GHOST}>Reset</button>
            <button onClick={cancel} className={GHOST}>Cancel</button>
            <button onClick={save} className={BTN}>Save</button>
          </>
        ) : (
          <button onClick={() => setEdit(true)} className={BTN}>Edit</button>
        )}
      </div>
    </div>
  );
}

const TABS = [
  { id: "grades", label: "Salary Grades", icon: BadgeDollarSign },
  { id: "adjustments", label: "Adjustment Requests", icon: FileEdit },
  { id: "allowances", label: "Allowances", icon: Gift },
  { id: "statutory", label: "Statutory Rates", icon: Scale },
];

export default function Compensation() {
  const [active, setActive] = useState("grades");
  return (
    <div>
      <div className="flex flex-wrap gap-1 border-b border-[#e3e7ef]">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-[13px] font-semibold transition-colors ${
              id === active ? "border-[#2f6b86] text-[#2f6b86]" : "border-transparent text-[#6b7794] hover:text-slate-800"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {active === "grades" && (
          <Crud
            storeKey="comp:grades"
            fields={[["grade", "Grade", "text"], ["position", "Position", "text"], ["monthly", "Monthly Salary", "number"]]}
            extra={[
              { label: "Semi-Monthly Salary", fn: (it) => peso(n(it.monthly) / 2) },
              { label: "Daily Rate", fn: (it) => peso(n(it.monthly) / 2 / (getRates().daysPerMonth / 2)) },
            ]}
          />
        )}
        {active === "adjustments" && (
          <Crud
            storeKey="comp:adjustments"
            approval
            fields={[
              ["employee", "Employee", "text"],
              ["type", "Type", "text", ["Salary Increase", "Allowance", "Deduction Correction", "Other"]],
              ["amount", "Amount", "number"],
              ["reason", "Reason", "text"],
            ]}
          />
        )}
        {active === "allowances" && (
          <Crud
            storeKey="comp:allowances"
            fields={[
              ["name", "Allowance", "text"],
              ["amount", "Amount", "number"],
              ["frequency", "Frequency", "text", ["Per Cutoff", "Monthly", "Daily"]],
              ["taxable", "Taxable", "text", ["No", "Yes"]],
            ]}
          />
        )}
        {active === "statutory" && <Statutory />}
      </div>
    </div>
  );
}