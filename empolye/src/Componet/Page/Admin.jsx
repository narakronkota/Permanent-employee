import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Users, Wallet, TrendingUp, Clock, Sparkles } from "lucide-react"; // ✅ Import only icons used

// 🌐 Centralized API Endpoint Config
const API_BASE_URL = "https://emolyee-contact.onrender.com/auth";

const Admin = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [summary, setSummary] = useState({
    adminCount: 0,
    employeeCount: 0,
    totalSalary: 0
  });

  // --------------------------------------------------------
  // Effects: Authentication, Data Fetching, & System Clock
  // --------------------------------------------------------
  useEffect(() => {
    // 🔐 Auth session validation
    axios.get(`${API_BASE_URL}/verify`, { withCredentials: true })
      .then(res => {
        if (!res.data.Status) {
          navigate('/');
        } else {
          fetchSummary();
          fetchAdmins();
        }
      })
      .catch(err => console.error("Auth Session Error:", err));

    // ⏰ Live dashboard system clock
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  // --------------------------------------------------------
  // API Core Requests
  // --------------------------------------------------------
  const fetchSummary = () => {
    axios.get(`${API_BASE_URL}/dashboard_summary`, { withCredentials: true })
      .then(res => {
        if (res.data.Status) {
          const data = res.data.Result;
          setSummary({
            adminCount: data.adminCount || 0,
            employeeCount: data.totalEmployee || 0,
            totalSalary: data.totalSalary || 0
          });
        }
      })
      .catch(err => console.error("Metrics Fetch Error:", err));
  };

  const fetchAdmins = () => {
    axios.get(`${API_BASE_URL}/admin_records`, { withCredentials: true })
      .then(res => {
        if (res.data.Status) setAdmins(res.data.Result);
      })
      .catch(err => console.error("Admin Records Fetch Error:", err));
  };

  // --------------------------------------------------------
  // UI Presentation Metrics Mapping
  // --------------------------------------------------------
  const stats = [
    {
      label: "Total Employees",
      value: summary.employeeCount,
      icon: Users,
      gradient: "from-orange-500 via-pink-500 to-rose-600",
      glow: "shadow-pink-500/40",
      change: "+8.2%",
      sparkline: [4, 6, 5, 7, 6, 8, 9],
    },
    {
      label: "Total Salary",
      value: `฿${(summary.totalSalary).toLocaleString()}`,
      icon: Wallet,
      gradient: "from-emerald-500 via-teal-500 to-cyan-600",
      glow: "shadow-emerald-500/40",
      change: "+24%",
      sparkline: [5, 4, 6, 5, 7, 8, 10],
    },
  ];

  const formatTime = (timeData) =>
    timeData.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-100/30">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-violet-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Grid Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Top Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 bg-clip-text text-transparent tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(currentTime)} · จัดการเงินเดือนพนักงาน
            </p>
          </div>
        </div>

        {/* Dynamic Metric Display Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            const max = Math.max(...s.sparkline);
            return (
              <div
                key={i}
                className={`group relative bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-sm hover:shadow-2xl ${s.glow} hover:-translate-y-1.5 transition-all duration-500 border border-white/60 overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.gradient}`} />
                <div className={`absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br ${s.gradient} rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-700`} />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg ${s.glow}`}>
                      <Icon className="w-6 h-6 text-white" />
                      <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
                      <TrendingUp className="w-3 h-3" />
                      {s.change}
                    </div>
                  </div>

                  <p className="text-sm font-medium text-slate-500 mb-1">{s.label}</p>
                  <p className="text-3xl font-bold bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tight">
                    {s.value}
                  </p>

                  {/* Sparkline Visual Component */}
                  <div className="flex items-end gap-1 mt-4 h-8">
                    {s.sparkline.map((v, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 bg-gradient-to-t ${s.gradient} rounded-sm opacity-70 group-hover:opacity-100 transition-all duration-300`}
                        style={{
                          height: `${(v / max) * 100}%`,
                          transitionDelay: `${idx * 50}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Placeholder for Additional Layout Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6" />
        </div>
      </div>
    </div>
  );
};

export default Admin;