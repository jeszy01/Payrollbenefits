import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  // TODO: replace with your real auth check
  const authed = !!localStorage.getItem("token");
  if (!authed) return <Navigate to="/" replace />;

  return (
    <div className="flex h-screen bg-[#edf0f7] font-sans">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}
