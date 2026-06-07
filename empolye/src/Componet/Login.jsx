import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Loader2, Sparkles } from "lucide-react";

const API_BASE_URL = "https://staff-management-system-omega.vercel.app/api";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({ email: "", password: "" });
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

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
      {/* Left Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-600 p-16 text-white md:flex overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-blue-400/10 blur-2xl" />

        <div className="relative z-10 my-auto max-w-md">
          <div className="mb-8 inline-flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md px-5 py-2.5 border border-white/10">
            <Sparkles className="w-4 h-4 mr-2 text-blue-200" />
            <span className="text-sm font-medium tracking-wide text-blue-100">
              Payroll Automation
            </span>
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight">
           Total Salary Expenses
            <br />
           
            <span className="inline-block animate-bounce">👋</span>
          </h1>

          <p className="text-lg leading-relaxed text-blue-100/90">
            Get highly productive through payroll automation. A concept sandbox
            designed to save tons of time.
          </p>
        </div>

        <div className="relative z-10 text-sm text-white/40">
          © 2024 One-Click Salary Compiler
        </div>
      </div>

      {/* Right Panel */}
      <div className="relative flex w-full items-center justify-center p-8 md:w-1/2 lg:p-16 bg-[radial-gradient(at_top_left,#f8fafc_0%,#f1f5f9_40%,#fae8ff_100%)] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 bg-[linear-gradient(to_right,#ffffff_2px,transparent_2px),linear-gradient(to_bottom,#ffffff_2px,transparent_2px)] bg-[size:3rem_3rem]" />
        <div className="absolute -bottom-20 -right-20 z-0 h-80 w-80 rounded-full bg-gradient-to-br from-fuchsia-200/40 to-indigo-200/40 blur-3xl" />
        <div className="absolute top-10 left-10 z-0 h-48 w-48 rounded-full bg-gradient-to-br from-blue-200/30 to-cyan-200/30 blur-2xl" />

        <div className="relative z-10 w-full max-w-md space-y-10">
          <div className="space-y-2">
            <div className="text-2xl font-bold tracking-tight text-gray-950">
              One-Click Salary Compiler
            </div>
            <p className="text-sm text-gray-500">Admin Salary Management</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500 animate-pulse" />
              <span>
                {error === "เข้าสู่ระบบไม่สำเร็จ" || error === "เกิดข้อผิดพลาด"
                  ? "รหัสผ่านไม่ถูกต้อง"
                  : error}
              </span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="relative">
              <label
                htmlFor="email"
                className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                  focusedField === "email" || values.email
                    ? "-top-5 text-xs text-indigo-600 font-medium"
                    : "top-3 text-sm text-gray-500"
                }`}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={values.email}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent border-b-2 border-gray-200 pb-2.5 pt-1 text-base text-gray-950 placeholder-transparent focus:outline-none focus:border-indigo-600 transition-colors"
                placeholder="Email Address"
                required
              />
              <div
                className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${
                  focusedField === "email" ? "w-full" : "w-0"
                }`}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                  focusedField === "password" || values.password
                    ? "-top-5 text-xs text-indigo-600 font-medium"
                    : "top-3 text-sm text-gray-500"
                }`}
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent border-b-2 border-gray-200 pb-2.5 pt-1 pr-10 text-base text-gray-950 placeholder-transparent focus:outline-none focus:border-indigo-600 transition-colors"
                placeholder="Password"
                required
              />
              <div
                className={`absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${
                  focusedField === "password" ? "w-full" : "w-0"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 top-1 text-gray-500 hover:text-gray-950 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-gray-950 py-3.5 text-center text-sm font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none shadow-lg shadow-gray-950/10"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  "Login Now"
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </form>

          <p className="text-center text-xs text-gray-500">
            อนุญาตเฉพาะผู้ดูแลระบบที่มีรหัสผ่านที่ปลอดภัยเท่านั้น ห้ามใช้งานโดยไม่ได้รับอนุญาต
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
