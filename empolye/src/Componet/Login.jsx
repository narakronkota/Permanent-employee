import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // ใช้ไอคอนลูกตาสำหรับซ่อน/แสดงรหัสผ่าน

//  Centralized Endpoint Configurations
const API_BASE_URL = "https://staff-management-system-omega.vercel.app/api";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({ email: "", password: "" });

  //  Dynamic Form Inputs Handler (Safe State Management)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //  Authentication Request Submission
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    axios
      .post(`${API_BASE_URL}/auth/adminlogin`, values, {
        withCredentials: true,
      })
      .then((result) => {
        if (result.data.loginStatus) {
          navigate("/admin");
        } else {
          setError(result.data.Error || "เข้าสู่ระบบไม่สำเร็จ");
        }
      })
      .catch(() => setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-600 p-16 text-white md:flex">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="relative z-10 my-auto max-w-md">
          <div className="mb-6 text-6xl">＊</div>

          <h1 className="mb-6 text-5xl font-bold leading-tight">
            Hello <br />
            One-Click Salary Compiler.{" "}
            <span className="inline-block animate-bounce">👋</span>
          </h1>

          <p className="text-lg leading-relaxed text-blue-100">
            Get highly productive through payroll automation. A concept sandbox
            designed to save tons of time
          </p>
        </div>
      </div>

      <div className="relative flex w-full items-center justify-center p-8 md:w-1/2 lg:p-16 bg-[radial-gradient(at_top_left,#f8fafc_0%,#f1f5f9_40%,#fae8ff_100%)] overflow-hidden">
        {/* ลายตารางกริดสีขาว */}
        <div className="absolute inset-0 z-0 opacity-40 bg-[linear-gradient(to_right,#ffffff_2px,transparent_2px),linear-gradient(to_bottom,#ffffff_2px,transparent_2px)] bg-[size:3rem_3rem]"></div>

        <div className="absolute -bottom-20 -right-20 z-0 h-80 w-80 rounded-full bg-gradient-to-br from-fuchsia-200/40 to-indigo-200/40 blur-3xl"></div>

        <div className="relative z-10 w-full max-w-md space-y-12">
          <div>
            <div className="text-2xl font-bold tracking-tight text-black mb-2">
              One-Click Salary Compiler
            </div>
            <p className="text-sm text-slate-500">Admin Salary Management</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>

              
              {error === "เข้าสู่ระบบไม่สำเร็จ" || error === "Wrong password"
                ? "รหัสผ่านไม่ถูก."
                : error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Input Email */}
            <div className="relative border-b border-gray-900 pb-2">
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleInputChange}
                className="w-full bg-transparent text-base text-gray-900 placeholder-gray-400 focus:outline-none"
                placeholder="Email Address"
                required
              />
            </div>

            <div className="relative border-b border-gray-300 pb-2 focus-within:border-gray-900 transition-colors flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={handleInputChange}
                className="w-full bg-transparent text-base text-gray-900 placeholder-gray-400 focus:outline-none pr-10"
                placeholder="Password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#18181b] py-3.5 text-center text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "Login Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
