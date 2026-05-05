
"use client"; // ✅ ต้องมีบรรทัดนี้เพราะมีการใช้ Hook (useState, useEffect)

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link'; // ✅ เปลี่ยนจาก react-router-dom
import { usePathname, useRouter } from 'next/navigation'; // ✅ Hooks ของ Next.js
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

const layout = () => {
    const pathname = usePathname(); // ✅ ใช้เช็ค Active Link แทน location.pathname
    const router = useRouter(); // ✅ ใช้เปลี่ยนหน้าแทน navigate
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [collapsed, setCollapsed] = useState(false);
    const [adminAvatar, setAdminAvatar] = useState(""); // เริ่มต้นเป็นค่าว่างก่อน เพื่อเลี่ยง Hydration error
    const [showPicker, setShowPicker] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // 1. ดึงข้อมูลรูปจาก Database และ LocalStorage (Client-side only)
    useEffect(() => {
        const savedAvatar = localStorage.getItem("adminAvatar") || "";
        setAdminAvatar(savedAvatar);

        const fetchAdminData = async () => {
            try {
                const res = await axios.get('http://localhost:4000/user/admin_details/1', { withCredentials: true });
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
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // 1. เช็คว่ามีไฟล์จริงไหม
        const file = e.target.files?.[0];
        if (!file) return;

        // 2. ดึง Admin ID จากที่ไหนซักแห่ง (สมมติว่าเก็บไว้ใน LocalStorage หรือดึงจาก State)
        // ถ้ายังไม่มีระบบ Login ใช้ค่าชั่วคราวไปก่อนได้ แต่แนะนำให้ประกาศเป็นตัวแปรครับ
        const adminId = 2;

        setIsUploading(true);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('id', adminId.toString()); // ส่งเป็น String เพื่อความชัวร์

        try {
            const res = await axios.post('http://localhost:4000/user/upload_avatar', formData, { withCredentials: true });
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
            Swal.fire({ icon: 'error', title: 'อัปโหลดไม่สำเร็จ' });
        } finally {
            setIsUploading(false);
        }
    };

    // 3. ฟังก์ชันลบรูป
    const removeAvatar = async () => {
        const result = await Swal.fire({
            title: 'คุณเเน่ใจ?',
            text: "รูปนี้จะหายไปจากระบบทันที!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ใช่, ลบเลย!',
        });

        if (result.isConfirmed) {
        try {
            // ส่งไปแค่ ID ผ่าน URL (เพราะ Backend ใช้ req.params.id)
            const res = await axios.delete('http://localhost:4000/user/delete_avatar/1', { 
                withCredentials: true 
            });

            console.log("Response from server:", res.data); // 👈 ลอง Log ดูว่ามาไหม

            if (res.data.Status) {
                setAdminAvatar("");
                localStorage.removeItem("adminAvatar");
                setShowPicker(false);
                Swal.fire('ลบแล้ว!', 'รูปโปรไฟล์ถูกลบเรียบร้อย', 'success');
            }
        } catch (err) {
            console.error("Axios Error:", err); // 👈 ดูว่ามันติด Error อะไร (เช่น CORS หรือ Network)
            Swal.fire('Error!', 'ติดต่อ Server ไม่ได้ครับพี่', 'error');
        }
    }
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'ออกจากระบบ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ใช่, ออกเลย',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("adminAvatar");
                router.push('/'); // ✅ ใช้ push แทน navigate
            }
        });
    };

    const menuItems = [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/manage", label: "Manage Employees", icon: Users },
        { to: "/profile", label: "Profile", icon: UserCircle },
    ];


    return (
        <aside className={`${collapsed ? "w-20" : "w-64"} min-h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 relative shadow-2xl`}>

            {/* Header / Avatar */}
            <div className="relative p-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowPicker(true)}
                        className="relative w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center overflow-hidden ring-2 ring-white/10 group transition-all"
                    >
                        {isUploading ? (
                            <div className="w-5 h-5 border-2 border-t-white rounded-full animate-spin" />
                        ) : adminAvatar ? (
                            <img src={adminAvatar} alt="Admin" className="w-full h-full object-cover" />
                        ) : (
                            <Shield className="w-5 h-5" />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Camera className="w-4 h-4 text-white" />
                        </div>
                    </button>

                    {!collapsed && (
                        <div className="overflow-hidden">
                            <h2 className="text-sm font-bold truncate">Admin</h2>
                            <p className="text-[10px] text-slate-400 truncate">Management System</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg transition-all"
                >
                    <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
                </button>
            </div>

            {/* เมนูนำทาง */}
            <nav className="flex-1 px-3 py-5 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.to; // ✅ เช็ค Active ด้วย pathname ของ Next.js
                    return (
                        <Link
                            key={item.to}
                            href={item.to} // ✅ ใช้ href แทน to
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${active ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span className="text-sm font-medium">Logout</span>}
                </button>
            </div>

            {/* Modal เลือกรูป (Logic เดิม) */}
            {showPicker && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPicker(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
                            <h3 className="font-bold">เปลี่ยนรูปโปรไฟล์</h3>
                            <button onClick={() => setShowPicker(false)}><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-center">
                                <div className="w-24 h-24 rounded-2xl bg-indigo-500 flex items-center justify-center overflow-hidden ring-4 ring-indigo-50 shadow-lg">
                                    {isUploading ? (
                                        <div className="w-8 h-8 border-4 border-t-white rounded-full animate-spin" />
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
                                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl hover:bg-indigo-50 transition font-medium"
                            >
                                <Upload className="w-5 h-5" />
                                {isUploading ? "กำลังอัปโหลด..." : "เลือกไฟล์รูปภาพ"}
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            {adminAvatar && !isUploading && (
                                <button onClick={removeAvatar} className="w-full py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition rounded-xl">
                                    ลบรูปโปรไฟล์
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </aside>
    )
}

export default layout