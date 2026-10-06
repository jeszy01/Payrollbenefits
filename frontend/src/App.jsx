import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import AppLayout from "./layouts/AppLayout";
import Employees from "./pages/Employees";
import Placeholder from "./pages/Placeholder";
import HmoBenefits from "./pages/HmoBenefits";
import Payroll from "./pages/Payroll";
import Deductions from "./pages/Deductions";
import Compensation from "./pages/Compensation";
import TimeAttendance from "./pages/TimeAttendance";


const pages = [
  ["dashboard", "Dashboard"],
  ["timesheet", "Timesheet"],
  ["payslip", "Payslip"],
   ["payroll-summary", "Payroll Summary"],
  ["claims", "Claims & Reimbursement"],

];

function LoginRoute() {
  const navigate = useNavigate();
  return (
    <Login
      onSignedIn={({ token, user }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/employees");
      }}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRoute />} />
                <Route element={<AppLayout />}>
          <Route path="/employees" element={<Employees />} />
                   <Route path="/payroll" element={<Payroll />} />
                   <Route path="/deductions" element={<Deductions />} />
          <Route path="/compensation" element={<Compensation />} />
          <Route path="/time-attendance" element={<TimeAttendance />} />
          
          <Route path="/hmo-benefits" element={<HmoBenefits />} />
          
          {pages.map(([path, title]) => (
            <Route key={path} path={`/${path}`} element={<Placeholder title={title} />} />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}