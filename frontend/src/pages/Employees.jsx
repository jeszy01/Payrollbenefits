import { Download, Plus } from "lucide-react";

export default function Employees() {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="m-0 text-[22px] font-semibold">Employees</h1>
        <p className="mt-1 max-w-[360px] text-[12.5px] text-[#6b7794]">
          Employee master list — ID, department, position, position rate & basic salary
        </p>
      </div>
      <div className="flex gap-2.5">
        <button className="inline-flex items-center gap-2 rounded-lg border border-[#e3e7ef] bg-white px-3.5 py-2 text-[13px] font-semibold">
          <Download size={15} /> Export CSV
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg border border-[#2f6b86] bg-[#2f6b86] px-3.5 py-2 text-[13px] font-semibold text-white">
          <Plus size={15} /> Add Employee
        </button>
      </div>
    </div>
  );
}