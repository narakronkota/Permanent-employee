import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  Users,
  Search,
  Pencil,
  Trash2,
  Mail,
  MapPin,
  Wallet,
  Tag,
  X,
  Save,
  Filter,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import Swal from 'sweetalert2';

//  Centralized API Endpoint Config
const API_BASE_URL = "https://staff-management-system-omega.vercel.app/auth";

//  Pure Helper Functions & Static Assets (Declared outside to prevent re-allocation)
const AVATAR_COLORS = [
  "from-pink-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-fuchsia-500 to-pink-500",
];

const getAvatarColor = (name = "?") => {
  const charCode = name.charCodeAt(0) || 0;
  return AVATAR_COLORS[charCode % AVATAR_COLORS.length];
};

const Profile = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("table"); // "table" | "grid"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState({
    id: "", name: "", email: "", address: "", salary: "", category: "",
  });

  //  Core Service Data Fetcher
  const fetchEmployees = useCallback(() => {
    axios.get(`${API_BASE_URL}/employee`, { withCredentials: true })
      .then((res) => {
        if (res.data.Status) {
          setEmployees(res.data.Result);
        } else {
          Swal.fire("Error", res.data.Error || "Failed to fetch data.", "error");
        }
      })
      .catch((err) => console.error("Fetch Employees Error:", err));
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // 🛠️ Event Handlers
  const handleEditClick = (emp) => {
    setEditingEmp(emp);
    setIsModalOpen(true);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEmp(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`${API_BASE_URL}/edit_employee/${editingEmp.id}`, editingEmp, { withCredentials: true })
      .then((res) => {
        if (res.data.Status) {
          Swal.fire({
            icon: 'success',
            title: 'Updated successfully!',
            showConfirmButton: false,
            timer: 1500
          });
          setIsModalOpen(false);
          fetchEmployees();
        } else {
          Swal.fire("Error", res.data.Error || "Update operation failed.", "error");
        }
      })
      .catch((err) => console.error("Update Employee Error:", err));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${API_BASE_URL}/delete_employee/${id}`, { withCredentials: true })
          .then((res) => {
            if (res.data.Status) {
              fetchEmployees();
              Swal.fire('Deleted!', 'Employee has been removed from system.', 'success');
            } else {
              Swal.fire('Failed!', res.data.Error, 'error');
            }
          })
          .catch((err) => {
            console.error("Delete Employee Error:", err);
            Swal.fire('Network Error', 'Could not establish connection with server.', 'error');
          });
      }
    });
  };

  //  Optimized Computations (Memoized Metrics)
  const filteredEmployees = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return employees;
    return employees.filter(
      (e) =>
        e.name?.toLowerCase().includes(query) ||
        e.email?.toLowerCase().includes(query) ||
        e.category?.toLowerCase().includes(query)
    );
  }, [employees, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 relative overflow-hidden">
      {/* Visual Canvas Blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse" />

      <div className="relative max-w-7xl mx-auto space-y-6">
        
        {/* === TOOLBAR CONTROLS === */}
        <div className="bg-white rounded-2xl p-4 shadow-lg flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อ, อีเมล, แผนก..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition text-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setView("table")}
                className={`p-2 rounded-lg transition ${view === "table" ? "bg-white shadow text-indigo-600" : "text-gray-500"}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-lg transition ${view === "grid" ? "bg-white shadow text-indigo-600" : "text-gray-500"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* === TABLE VIEW LAYOUT === */}
        {view === "table" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Salary</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-indigo-50/50 transition group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {emp.image ? (
                            <img
                              src={emp.image}
                              alt="profile"
                              className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-md group-hover:scale-110 transition"
                            />
                          ) : (
                            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getAvatarColor(emp.name)} flex items-center justify-center text-white font-bold ring-2 ring-white shadow-md group-hover:scale-110 transition`}>
                              {emp.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-800">{emp.name}</p>
                            <p className="text-xs text-gray-400">ID: {emp.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{emp.email}</td>
                      <td className="py-4 px-6 text-gray-600">{emp.address}</td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-emerald-600">
                          ฿{Number(emp.salary).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          {emp.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(emp)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition shadow-sm"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        ไม่พบข้อมูลพนักงาน
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === GRID VIEW LAYOUT === */}
        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden"
              >
                <div className="h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                  <div className="absolute -bottom-8 left-5">
                    {emp.image ? (
                      <img
                        src={emp.image}
                        alt="profile"
                        className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getAvatarColor(emp.name)} flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-lg`}>
                        {emp.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-10 px-5 pb-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{emp.name}</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                      {emp.category}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" /> <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" /> <span className="truncate">{emp.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-emerald-600">
                        ฿{Number(emp.salary).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEditClick(emp)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition text-sm font-medium"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredEmployees.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400 bg-white rounded-2xl shadow">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                ไม่พบข้อมูลพนักงาน
              </div>
            )}
          </div>
        )}
      </div>

      {/* === 🛠 EDIT MODAL CONTAINER === */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">แก้ไขข้อมูลพนักงาน</h2>
                  <p className="text-white/80 text-sm">อัปเดตรายละเอียดของ {editingEmp.name}</p>
                </div>
              </div>
            </div>

            {/* Input Form Payload */}
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingEmp.name}
                  onChange={handleModalInputChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingEmp.email}
                  onChange={handleModalInputChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <input
                    type="number"
                    name="salary"
                    value={editingEmp.salary}
                    onChange={handleModalInputChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={editingEmp.category}
                    onChange={handleModalInputChange}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={editingEmp.address}
                  onChange={handleModalInputChange}
                  rows={3}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;