import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// 🌐 Centralized Endpoint Configurations
const API_BASE_URL = "https://staff-management-system-omega.vercel.app";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState({ email: '', password: '' });

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
    setError('');

    axios.post(`${API_BASE_URL}/adminlogin`, values, { withCredentials: true })
      .then((result) => {
        if (result.data.loginStatus) {
          navigate('/admin');
        } else {
          setError(result.data.Error || 'เข้าสู่ระบบไม่สำเร็จ');
        }
      })
      .catch(() => setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Column - Graphic Banner (Visible on Large Screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-purple-100 items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1632406898177-95f7acd8854f?q=80&w=1170&auto=format&fit=crop" 
          alt="Cover Art" 
          className="w-full h-full object-cover shadow-2xl" 
        />
      </div>

      {/* Right Column - Unified Login Credentials Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-light text-slate-900 mb-2">เข้าสู่ระบบ</h2>
          <p className="text-slate-500 mb-8">Admin Salary Management</p>

          {/* Conditional Error Notification Toast */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 text-red-700 text-sm animate-in fade-in duration-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field Container */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                required
              />
            </div>

            {/* Password Field Container */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={values.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="w-full pl-11 pr-11 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Form Submit Action Trigger Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 active:scale-[0.98] transition disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;