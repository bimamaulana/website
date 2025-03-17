import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Admin from "./Admin";
import Login from "./Login";
import SignUp from "./Signup";
import QR from "./qr";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login/qr" element={<QR />} />
      </Routes>
    </Router>
  );
}
