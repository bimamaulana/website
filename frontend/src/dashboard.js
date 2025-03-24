import { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [scanResult, setScanResult] = useState("");

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>
        Selamat datang, <span className="font-semibold">{user?.nama}</span> (
        {user?.nim})
      </p>
      <p>Arahkan kamera ke QR Code untuk memindai.</p>

      <div className="w-64 h-64 mt-4">
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (result) {
              handleScan(result?.text);
            }
            if (error) {
              handleError(error);
            }
          }}
          style={{ width: "100%" }}
        />
      </div>

      {scanResult && (
        <div className="mt-4 p-4 border border-gray-800">
          <h2 className="text-lg font-semibold">Hasil Scan</h2>
          <p>{scanResult}</p>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
