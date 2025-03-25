import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const Dashboard = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [scanResult, setScanResult] = useState("");
  const [valid, setValid] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        const regex = /^Laboratorium - \d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}$/;
        if (regex.test(decodedText)) {
          setScanResult("Berhasil");
          setValid(true);
          scanner
            .clear()
            .catch((err) =>
              console.warn("Error saat menghentikan scanner:", err)
            );
        } else {
          setScanResult("QR Code tidak valid");
          setValid(false);
        }
      },
      (errorMessage) => {
        console.warn(errorMessage);
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((err) => console.warn("Scanner sudah dihentikan:", err));
      }
    };
  }, []);

  const handleRescan = () => {
    setScanResult("");
    setValid(false);
    if (scannerRef.current) {
      scannerRef.current
        .clear()
        .catch((err) => console.warn("Scanner sudah dihentikan:", err));
      scannerRef.current.render();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {user ? (
        <p>
          Selamat datang, <span className="font-semibold">{user.nama}</span> (
          {user.nim})
        </p>
      ) : (
        <p>User tidak ditemukan</p>
      )}
      <p>Arahkan kamera ke QR Code untuk memindai.</p>

      <div id="qr-reader" className="w-64 h-64 mt-4"></div>

      {scanResult && (
        <div className="mt-4 p-4 border border-gray-800">
          <h2 className="text-lg font-semibold">Hasil Scan</h2>
          <p>{scanResult}</p>
          {valid ? (
            <p className="text-green-500 font-semibold">QR Code valid!</p>
          ) : (
            <p className="text-red-500 font-semibold">QR Code tidak valid</p>
          )}
          <button
            onClick={handleRescan}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Scan Lagi
          </button>
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
