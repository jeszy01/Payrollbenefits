import { useLocation } from "react-router-dom";
import { Bell, ChevronDown, Search } from "lucide-react";
import { titles } from "./navConfig";

export default function Topbar() {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? "";
  return (
    <header className="flex items-center justify-between border-b border-[#e3e7ef] bg-white px-6 py-3">
      <div>
        <div className="text-[15px] font-bold">{title}</div>
        <div className="text-[11px] text-[#6b7794]">Home / {title}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex w-60 items-center gap-2 rounded-lg bg-[#e9edf5] px-3 py-2 text-[#6b7794]">
          <Search size={15} />
          <input
            placeholder="Search employees, claims..."
            className="w-full bg-transparent text-[12.5px] outline-none"
          />
        </div>
        <button className="relative grid h-[34px] w-[34px] place-items-center rounded-lg border border-[#e3e7ef] bg-white">
          <Bell size={16} />
          <span className="absolute right-[7px] top-1.5 h-[7px] w-[7px] rounded-full bg-[#e5484d]" />
        </button>
        <button className="flex items-center gap-2 rounded-full border border-[#e3e7ef] bg-white py-1 pl-1 pr-3 text-[12.5px] font-semibold">
          <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-[#2a4a8d] text-xs text-white">A</span>
          Admin <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}