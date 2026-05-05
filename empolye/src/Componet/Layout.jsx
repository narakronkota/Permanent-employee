
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Outlet /> {/* 🔥 เปลี่ยนหน้า content ตรงนี้ */}
      </div>
    </div>
  );
};

export default Layout;