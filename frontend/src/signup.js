import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [pesan, setPesan] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/signup`,
        { nama, nim }
      );
      localStorage.setItem("user", JSON.stringify({ nama, nim })); // Simpan user di localStorage
      navigate("/dashboard"); // Redirect ke Dashboard setelah signup sukses
    } catch (error) {
      setPesan(error.response?.data?.message || "Pendaftaran gagal");
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <form onSubmit={handleSignup} className="mt-4">
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
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Daftar
        </button>
      </form>
      {pesan && <p className="mt-2 text-red-500">{pesan}</p>}
    </div>
  );
};

export default Signup;
