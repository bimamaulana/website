import { useState, useEffect } from "react";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/history`)
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error("Gagal mengambil data:", err));
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Riwayat Absen</h1>
      <table className="table-auto border-collapse border border-gray-500 mx-auto mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-500 px-4 py-2">Nama</th>
            <th className="border border-gray-500 px-4 py-2">NIM</th>
            <th className="border border-gray-500 px-4 py-2">Waktu Absen</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border border-gray-500 px-4 py-2">{item.nama}</td>
              <td className="border border-gray-500 px-4 py-2">{item.nim}</td>
              <td className="border border-gray-500 px-4 py-2">
                {new Date(item.waktu).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
