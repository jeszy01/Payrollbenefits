import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Atom, ChevronDown, ChevronRight } from "lucide-react";
import { overview, modules } from "./navConfig";

const base =
  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-semibold text-[#dbe2f5] hover:bg-white/5";
const active = "bg-[#1d3566] text-white shadow-[inset_3px_0_0_#4aa3d6]";

const Label = ({ children }) => (
  <div className="mx-2 mb-1.5 mt-3.5 text-[10px] tracking-widest text-[#8e9bbd]">{children}</div>
);

function Link({ to, icon: Icon, label }) {
  return (
    <NavLink to={to} className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
}

function Group({ item }) {
  const [open, setOpen] = useState(true);
  const Icon = item.icon;
  return (
    <>
      <button className={`${base} cursor-pointer text-left`} onClick={() => setOpen(!open)}>
        <Icon size={18} />
        <span>{item.label}</span>
        {open ? (
          <ChevronDown size={14} className="ml-auto opacity-70" />
        ) : (
          <ChevronRight size={14} className="ml-auto opacity-70" />
        )}
      </button>
      {open && (
        <div className="pb-1.5 pl-[18px] pt-0.5">
          {item.children.map((c) => (
            <NavLink
              key={c.to}
              to={c.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-2.5 py-[7px] text-[13px] hover:text-white ${
                  isActive ? "text-white" : "text-[#aab4d0]"
                }`
              }
            >
              <i className="h-[5px] w-[5px] rounded-full bg-[#7d8bb0]" />
              {c.label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}

export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen w-[210px] shrink-0 overflow-y-auto bg-[#12224b] px-2.5 py-3.5 text-white">
      <div className="flex items-center gap-2.5 px-1.5 pb-4 pt-1">
        <div className="grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-white">
          <Atom size={22} color="#f08a24" />
        </div>
        <div>
          <div className="text-[13px] font-bold">ARCHON NELL INC.</div>
          <div className="text-[10px] tracking-wide text-[#aab4d0]">PAYROLL & BENEFITS</div>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        <Label>OVERVIEW</Label>
        {overview.map((i) => <Link key={i.to} {...i} />)}
        <Label>MODULES</Label>
        {modules.map((m) =>
          m.children ? <Group key={m.label} item={m} /> : <Link key={m.to} {...m} />
        )}
      </nav>
    </aside>
  );
}