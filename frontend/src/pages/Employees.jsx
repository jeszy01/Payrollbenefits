import { Download, Plus } from "lucide-react";
import PageShell from "../components/PageShell";

export default function Employees() {
  return (
    <PageShell
      title="Employees"
      crumbs={["Home", "Employees"]}
      subtitle="Employee master list — ID, department, position, position rate & basic salary"
      actions={
        <>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800">
            <Download size={15} /> Export CSV
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-[#34667f] px-4 py-2 text-sm font-semibold text-white">
            <Plus size={15} /> Add Employee
          </button>
        </>
      }
    >
      {/* empty for now */}
    </PageShell>
  );
}
