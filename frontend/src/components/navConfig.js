import {
  LayoutGrid, Users, Wallet, Landmark, BarChart3, FileText, HeartPulse,
} from "lucide-react";

export const overview = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutGrid },
  { label: "Employees", to: "/employees", icon: Users },
];

export const modules = [
  {
    label: "Payroll Management",
    icon: Wallet,
    children: [
      { label: "Payroll", to: "/payroll" },
      { label: "Time / Attendance", to: "/time-attendance" },
      { label: "Timesheet", to: "/timesheet" },
      { label: "Deductions", to: "/deductions" },
      { label: "Payslip", to: "/payslip" },
    ],
  },
  { label: "Payment", to: "/payment", icon: Landmark },
  { label: "Compensation", to: "/compensation", icon: BarChart3 },
  { label: "Claims & Reimbursement", to: "/claims", icon: FileText },
  { label: "HMO & Benefits", to: "/hmo-benefits", icon: HeartPulse },
];

export const titles = Object.fromEntries(
  [...overview, ...modules.flatMap((m) => m.children ?? [m])].map((i) => [i.to, i.label])
);