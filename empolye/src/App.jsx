import { useState } from 'react'
import Login from './Componet/Login'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Manage from './Componet/Page/Manage';
import Category from './Componet/Page/Category';
import Profile from './Componet/Page/Profile';
import Admin from './Componet/Page/Admin';
import Layout from './Componet/Layout';


function App() {    
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        {/* 🔥 ใช้ Layout ครอบ */}
        <Route element={<Layout />}>

          <Route path="/admin" element={<Admin />} />
          <Route path="/manage-employee" element={<Manage />} />
          <Route path="/category" element={<Category />} />
          <Route path="/profile" element={<Profile />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}


export default App
