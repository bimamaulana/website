import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [data, setData] = useState([]);
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/data`);
      setData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("aksesAdmin");
    navigate("/admin"); // Kembali ke halaman login admin
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/data/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Gagal menghapus data", error);
    }
  };

  const handleUpdate = async (id) => {
    const namaBaru = prompt("Masukkan nama baru:");
    const nimBaru = prompt("Masukkan NIM baru:");
    if (namaBaru && nimBaru) {
      try {
        await axios.put(`${backendUrl}/data/${id}`, {
          nama: namaBaru,
          nim: nimBaru,
        });
        fetchData();
      } catch (error) {
        console.error("Gagal memperbarui data", error);
      }
    }
  };

  const handleCreate = async () => {
    if (nama && nim) {
      try {
        await axios.post(`${backendUrl}/data`, { nama, nim });
        setNama("");
        setNim("");
        fetchData();
      } catch (error) {
        console.error("Gagal menambahkan data", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-center">Daftar Mahasiswa</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        Logout
      </button>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="NIM"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleCreate}
        >
          Tambah
        </button>
      </div>

      <table className="table-auto border-collapse border border-gray-400 w-full text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2">Nama</th>
            <th className="border border-gray-400 p-2">NIM</th>
            <th className="border border-gray-400 p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-400 p-2">{item.nama}</td>
              <td className="border border-gray-400 p-2">{item.nim}</td>
              <td className="border border-gray-400 p-2 space-x-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(item.id)}
                >
                  Hapus
                </button>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => handleUpdate(item.id)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
