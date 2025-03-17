import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [data, setData] = useState([]);
  const [nama, setNama] = useState("");
  const [nim, setNim] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [editNim, setEditNim] = useState("");

  useEffect(() => {
    ambilData();
  }, []);

  const ambilData = async () => {
    const res = await fetch(`${API_URL}/data`);
    const result = await res.json();
    setData(result);
  };

  const tambahData = async () => {
    await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, nim }),
    });
    setNama("");
    setNim("");
    ambilData();
  };

  const mulaiEdit = (id, nama, nim) => {
    setEditId(id);
    setEditNama(nama);
    setEditNim(nim);
  };

  const simpanEdit = async () => {
    await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama: editNama, nim: editNim }),
    });
    setEditId(null);
    ambilData();
  };

  const hapusData = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    ambilData();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>CRUD Mahasiswa</h2>
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
      <button onClick={tambahData}>Tambah</button>

      <table
        border="1"
        cellPadding="8"
        style={{ marginTop: "20px", width: "100%" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>NIM</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>
                {editId === row.id ? (
                  <input
                    type="text"
                    value={editNama}
                    onChange={(e) => setEditNama(e.target.value)}
                  />
                ) : (
                  row.nama
                )}
              </td>
              <td>
                {editId === row.id ? (
                  <input
                    type="text"
                    value={editNim}
                    onChange={(e) => setEditNim(e.target.value)}
                  />
                ) : (
                  row.nim
                )}
              </td>
              <td>
                {editId === row.id ? (
                  <button onClick={simpanEdit}>Simpan</button>
                ) : (
                  <button onClick={() => mulaiEdit(row.id, row.nama, row.nim)}>
                    Edit
                  </button>
                )}
                <button onClick={() => hapusData(row.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
