import React, { useState } from "react";
import { signUp } from "./api";

export default function SignUp() {
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");

  async function handleSignUp(e) {
    e.preventDefault();
    const data = await signUp(nama, nim);
    if (data.success) {
      alert("Pendaftaran berhasil!");
      setNama("");
      setNim("");
    } else {
      alert("Gagal mendaftar!");
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
