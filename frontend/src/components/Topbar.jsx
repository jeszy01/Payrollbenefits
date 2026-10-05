import { Bell, ChevronDown, Search } from "lucide-react";

export default function Topbar({ title, crumbs = [] }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div>
        <h1 className="text-[17px] font-bold text-slate-900">{title}</h1>
        <p className="text-xs text-slate-500">{crumbs.join(" / ")}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 sm:flex sm:w-72">
          <Search size={15} className="text-slate-500" />
          <input
            placeholder="Search employees, claims..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
          />
        </div>

        <button className="relative rounded-lg border border-slate-200 p-2 text-slate-700">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 text-sm font-semibold text-slate-800">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e3a64] text-white">
            A
          </span>
          Admin
          <ChevronDown size={14} className="text-slate-500" />
        </button>
      </div>
    </header>
  );
}
