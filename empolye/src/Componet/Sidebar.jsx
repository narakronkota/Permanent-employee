import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom"; // ✅ ต้องมี useNavigate ตรงนี้
import axios from 'axios';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  LogOut,
  ChevronLeft,
  Shield,
  Camera,
  Upload,
  X,
} from "lucide-react";
import Swal from 'sweetalert2';

const Sidebar = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);


  const [adminAvatar, setAdminAvatar] = useState(
    () => localStorage.getItem("adminAvatar") || ""
  );
  const [showPicker, setShowPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // เช็คสถานะการอัปโหลด

  // 1. ดึงข้อมูลรูปจาก Database
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await axios.get('https://emolyee-contact.onrender.com/auth/admin_details/2', { withCredentials: true });
        if (res.data.Status && res.data.Result.length > 0) {
          const dbImage = res.data.Result[0].image;
          setAdminAvatar(dbImage);
          localStorage.setItem("adminAvatar", dbImage);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchAdminData();
  }, []);

  // 2. ฟังก์ชันอัปโหลดรูปภาพ
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true); // 🟢 เริ่มหมุน Spinner

    const formData = new FormData();
    formData.append('image', file);
    formData.append('id', 2);

    try {
      const res = await axios.post('https://emolyee-contact.onrender.com/user/upload_avatar', formData, { withCredentials: true });

      if (res.data.Status) {
        const newImageUrl = res.data.Result;
        setAdminAvatar(newImageUrl);
        localStorage.setItem("adminAvatar", newImageUrl);
        setShowPicker(false);

        Swal.fire({
          icon: 'success',
          title: 'อัปเดตเรียบร้อย!',
          text: 'รูปโปรไฟล์ของคุณถูกเปลี่ยนแล้วครับ',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'อุ๊ปส์...',
        text: 'อัปโหลดไม่สำเร็จ กรุณาลองใหม่!',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    // 1. ถามเพื่อความแน่ใจก่อน (ใช้ Swal ที่เราลงไว้)
    Swal.fire({
      title: 'ออกจากระบบ?',
      text: "คุณต้องการออกจากระบบใช่หรือไม่?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // สีแดง
      cancelButtonColor: '#64748b',
      confirmButtonText: 'ใช่, ออกเลย',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("valid"); // หรือชื่อตัวแปรที่พี่ใช้เช็คว่า Login อยู่ไหม
     

        // 3. เด้งไปหน้า Login
        navigate('/');
      }
    });
  };
  const removeAvatar = async () => {
    // 🔥 เพิ่มระบบ Confirm ก่อนลบจริง (User จะได้ไม่กดพลาด)
    const result = await Swal.fire({
      title: 'คุณเเน่ใจ?',
      text: "รูปนี้จะหายไปจากระบบทันที!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5', // สี Indigo
      cancelButtonColor: '#ef4444', // สีแดง
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete('https://emolyee-contact.onrender.com/user/delete_avatar/1', {
          data: { id: 1 }, 
          withCredentials: true
        });
        if (res.data.Status) {
          setAdminAvatar("");
          localStorage.removeItem("adminAvatar");
          setShowPicker(false);

          Swal.fire(
            'ลบแล้ว!',
            'รูปโปรไฟล์ถูกลบเรียบร้อย',
            'success'
          );
        }
      } catch (err) {
        Swal.fire('Error!', 'ติดต่อ Server ไม่ได้ครับพี่', 'error');
      }
    }
  };

  const menuItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/manage-employee", label: "Manage Employees", icon: Users },
    { to: "/profile", label: "Profile", icon: UserCircle },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-64"
        } min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-500 text-white flex flex-col transition-all duration-300 shadow-2xl shadow-black/30 relative`}
    >
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />


      <div className="relative p-5 border-b border-white/5">
        <div className="flex items-center gap-3">


          <button
            onClick={() => setShowPicker(true)}
            className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0 overflow-hidden ring-2 ring-white/10 hover:ring-indigo-400 transition-all group"
          >

            {isUploading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : adminAvatar ? (
              <img
                src={adminAvatar}
                alt="Admin"
                className="w-full h-full object-cover bg-white"
              />
            ) : (
              <Shield className="w-5 h-5 text-white" />
            )}

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-4 h-4 text-white" />
            </div>

            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
          </button>

          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="text-base font-bold tracking-tight whitespace-nowrap">Admin</h2>
              <p className="text-xs text-slate-400 whitespace-nowrap">Management System</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-indigo-800 hover:bg-indigo-500 flex items-center justify-center shadow-lg ring-2 ring-slate-900 transition-all"
        >
          <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

     
      <nav className="flex-1 px-3 py-5 space-y-1 relative">
        {!collapsed && <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Menu</p>}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${active ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30" : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />}
              <Icon className={`w-5 h-5 shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
              {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ปุ่ม Logout */}
      <div className="p-3 border-t border-white/5 space-y-2">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all group ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

     
      {showPicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPicker(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                <h3 className="font-bold">เปลี่ยนรูปโปรไฟล์</h3>
              </div>
              <button onClick={() => setShowPicker(false)} className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden ring-4 ring-indigo-100 shadow-lg relative">
                  {/* แสดง Spinner ใน Modal ด้วยถ้ากำลังอัปโหลด */}
                  {isUploading ? (
                    <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : adminAvatar ? (
                    <img src={adminAvatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Shield className="w-10 h-10 text-white" />
                  )}
                </div>
              </div>

              <button
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed rounded-xl transition font-medium ${isUploading ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-500'}`}
              >
                <Upload className="w-5 h-5" />
                {isUploading ? "กำลังอัปโหลด..." : "เลือกไฟล์รูปภาพ"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

              {adminAvatar && !isUploading && (
                <button onClick={removeAvatar} className="w-full py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  ลบรูปโปรไฟล์
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;