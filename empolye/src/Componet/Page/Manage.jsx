import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const Manage = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    salary: "",
    address: "",
    category: ""
  });

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  const handleImage = (e) => {
    const selectedFile = e.target.files?.[0]; // **แก้ไขตรงนี้: เก็บไฟล์ลงตัวแปรไว้ก่อน**
    if (selectedFile) {
      setFile(selectedFile); // **เพิ่มตรงนี้: บันทึกไฟล์ภาพลง State**
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('salary', values.salary);
    formData.append('address', values.address);
    formData.append('category', values.category);
    formData.append('image', file);

    axios.post('http://localhost:3000/auth/add_employee', formData)
      .then(res => {
        setLoading(false); // 2. หยุดหมุนเมื่อได้รับคำตอบ
        if (res.data.Status) {
          Swal.fire({
            icon: 'success',
            title: 'เพิ่มพนักงานสำเร็จ!',
            text: 'ระบบได้บันทึกข้อมูลเรียบร้อยแล้ว',
            showConfirmButton: false,
            timer: 1500 // แสดง 1.5 วินาทีแล้วจะปิดเอง
          }).then(() => {
            navigate('/profile'); // ย้ายไปหน้าจัดการพนักงาน (หรือ path ที่พี่ต้องการ)
          });
        } else {
          // ❌ แสดง Error กรณี Backend ส่งข้อความผิดพลาดมา
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: res.data.Error || 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
            confirmButtonColor: '#4f46e5',
          });
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'ล้มเหลว',
          text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
        });
      });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 overflow-hidden border border-white">

        {/* Header gradient */}
        <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-500 p-8 text-white overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">

            <div>
              <h2 className="text-3xl font-Kanit tracking-tight">เพิ่มพนักงานใหม่</h2>
              <p className="text-white/80 text-sm mt-1">กรอกเงินเดือนพนักงาน</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">

          {/* Avatar Upload */}
          <div className="flex justify-center -mt-16 mb-2">
            <label htmlFor="image" className="relative w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg cursor-pointer overflow-hidden group hover:scale-105 transition-transform">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-3xl text-indigo-400">
                  📷
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                เปลี่ยนรูป
              </div>
              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </div>

          {/* Name + Email */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Name</label>
              <input
                type="text"
                name="name"
                placeholder="ชื่อ-นามสกุล"
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>

          {/* Password + Salary */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Salary</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">฿</span>
                <input
                  type="number"
                  name="salary"
                  placeholder="25,000"
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Category</label>
            <select
              name="category"
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
            >
              <option value="">เลือกแผนก</option>
              <option value="IT"> IT</option>
              <option value="HR"> HR</option>
              <option value="Finance"> Finance</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Address</label>
            <textarea
              name="address"
              placeholder="ที่อยู่..."
              rows={3}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 pt-3">

            <button
              type="submit"
              disabled={loading} // ป้องกันการกดซ้ำขณะโหลด
              className={`px-8 py-5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-Kanit shadow-lg shadow-indigo-300/50 hover:shadow-xl hover:shadow-indigo-400/50 hover:-translate-y-0.5 transition-all flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  {/* นี่คือโค้ดไอคอนหมุนๆ (SVG) */}
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังบันทึก...
                </>
              ) : (
                "＋ เพิ่มพนักงานใหม่"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Manage;
