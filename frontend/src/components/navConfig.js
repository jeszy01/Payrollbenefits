import {
  LayoutGrid, Users, Wallet, Landmark, BarChart3, FileText,
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
  { label: "Payment", icon: Landmark, children: [] },
  { label: "Compensation", icon: BarChart3, children: [] },
  { label: "Claims & Reimbursement", icon: FileText, children: [] },
];
