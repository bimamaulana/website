import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Admin from "./pages/Admin";
import QR from "./pages/qr";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="login/qr" element={<QR />} />
      </Routes>
    </Router>
  );
}
