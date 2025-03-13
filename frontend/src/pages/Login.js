import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export default function Login() {
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const data = await login(nama, nim);
    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/login/qr");
    } else {
      alert("Login gagal! Periksa Nama dan NIM.");
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <input
          type="text"
          placeholder="NIM"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
