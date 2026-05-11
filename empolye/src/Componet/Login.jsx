import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';


const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState({ email: '', password: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    axios.post('https://emolyee-contact.onrender.com/admin/adminlogin', values, { withCredentials: true })
      .then(result => {
        if (result.data.loginStatus) {
          navigate('/admin');
        } else {
          setError(result.data.Error || 'เข้าสู่ระบบไม่สำเร็จ');
        }
      })
      .catch(() => setError('เกิดข้อผิดพลาด กรุณาลองใหม่'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left - Image */}
     <div className="hidden lg:flex lg:w-1/2 bg-purple-100 items-center justify-center overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1632406898177-95f7acd8854f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        alt="Cover" 
        className="w-full h-full object-cover shadow-2xl" 
       
      />
</div>

      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-light text-slate-900 mb-2">เข้าสู่ระบบ</h2>
          <p className="text-slate-500 mb-8">Admin Salary Management</p>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                className="w-full pl-11 pr-11 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 active:scale-[0.98] transition disabled:opacity-60"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
