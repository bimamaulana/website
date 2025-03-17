import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [pesan, setPesan] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        { nama, nim }
      );
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Simpan data user di localStorage
      navigate("/dashboard"); // Redirect ke dashboard setelah login sukses
    } catch (error) {
      setPesan(error.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleLogin} className="mt-4">
        <input
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          placeholder="NIM"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          className="border p-2 mr-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Masuk
        </button>
      </form>
      {pesan && <p className="mt-2 text-red-500">{pesan}</p>}
    </div>
  );
};

export default Login;
