import { useState } from "react";
import { Building2, HeartPulse, ClipboardList, HandCoins } from "lucide-react";

const tabs = [
  {
       id: "benefits",
    label: "Company Benefits",
    icon: Building2,
    desc: "Company-provided benefits per employee",
  },
  {
    id: "plans",
    label: "HMO Plans",
    icon: HeartPulse,
    desc: "Available HMO plans, coverage, and premiums",
  },
  {
    id: "enrollments",
    label: "Enrollments",
    icon: ClipboardList,
    desc: "Employee enrollments to HMO plans and dependents",
  },
  {
    id: "loans",
    label: "Loans & Advances",
    icon: HandCoins,
    desc: "Employee loans, cash advances, and repayment schedules",
  },
];

export default function HmoBenefits() {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active);

  return (
    <div>
      <div className="flex flex-wrap gap-1 border-b border-[#e3e7ef]">
        {tabs.map(({ id, label, icon: Icon }) => {
          const on = id === active;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                on
                  ? "border-[#2f6b86] text-[#2f6b86]"
                  : "border-transparent text-[#6b7794] hover:text-slate-800"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <h2 className="m-0 text-[18px] font-semibold">{current.label}</h2>
        <p className="mt-1 text-[12.5px] text-[#6b7794]">{current.desc}</p>

        <div className="mt-4 rounded-2xl border border-[#e3e7ef] bg-white p-5">
          <div className="rounded-xl border border-[#e3e7ef] px-4 py-10 text-center text-[13px] text-[#6b7794]">
            No records yet.
          </div>
        </div>
      </div>
    </div>
  );
}