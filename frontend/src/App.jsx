import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import AppLayout from "./layouts/AppLayout";
import Employees from "./pages/Employees";
import Placeholder from "./pages/Placeholder";

const pages = [
  ["dashboard", "Dashboard"],
  ["payroll", "Payroll"],
  ["time-attendance", "Time / Attendance"],
  ["timesheet", "Timesheet"],
  ["deductions", "Deductions"],
  ["payslip", "Payslip"],
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
        <Route path="/" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/employees" element={<Employees />} />
          {pages.map(([path, title]) => (
            <Route key={path} path={`/${path}`} element={<Placeholder title={title} />} />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
