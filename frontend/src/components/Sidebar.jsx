import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { overview, modules } from "./navConfig";

function Group({ item }) {
  const { pathname } = useLocation();
  const hasActiveChild = item.children.some((c) => pathname.startsWith(c.to));
  const [open, setOpen] = useState(hasActiveChild || item.label === "Payroll Management");
  const Icon = item.icon;

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] font-semibold text-white hover:bg-white/5"
      >
        <Icon size={18} className="shrink-0" />
        <span className="flex-1 leading-tight">{item.label}</span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {open && item.children.length > 0 && (
        <div className="mt-1 mb-2 flex flex-col">
          {item.children.map((c) => (
            <NavLink
              key={c.to}
              to={c.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md py-2 pl-9 pr-3 text-sm ${
                  isActive ? "text-white" : "text-slate-300 hover:text-white"
                }`
              }
            >
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              {c.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-[230px] shrink-0 flex-col bg-[#12214a] text-white md:flex">
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white">
          <img src="/logo.png" alt="" className="h-8 w-8 object-contain" />
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-bold">ARCHON NELL INC.</div>
          <div className="text-[11px] text-slate-300">PAYROLL &amp; BENEFITS</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        <div className="px-3 pb-2 pt-3 text-xs tracking-wide text-slate-400">OVERVIEW</div>
        {overview.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-semibold ${
                isActive
                  ? "bg-[#1e3a64] ring-1 ring-sky-400/40"
                  : "text-white hover:bg-white/5"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        <div className="px-3 pb-2 pt-5 text-xs tracking-wide text-slate-400">MODULES</div>
        {modules.map((m) => (
          <Group key={m.label} item={m} />
        ))}
      </nav>
    </aside>
  );
}
