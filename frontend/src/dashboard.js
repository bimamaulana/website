import { useEffect, useRef, useState, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const Dashboard = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [scanResult, setScanResult] = useState("");
  const scannerRef = useRef(null);

  const getCurrentTimeString = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Januari = 0
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  const startScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current
        .clear()
        .catch((err) => console.warn("Scanner sudah dihentikan:", err));
    }

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        const regex = /^Laboratorium - (\d{2}\/\d{2}\/\d{4}), (\d{2}:\d{2})$/;
        const match = decodedText.match(regex);

        if (match) {
          const scannedDateTime = `${match[1]}, ${match[2]}`;
          const currentTime = getCurrentTimeString();

          console.log("QR Code Time:", scannedDateTime);
          console.log("Device Time:", currentTime);

          if (scannedDateTime === currentTime) {
            setScanResult("Berhasil");
          } else {
            setScanResult("Waktu QR Code tidak valid");
          }
        } else {
          setScanResult("QR Code tidak valid");
        }

        scanner
          .clear()
          .catch((err) =>
            console.warn("Error saat menghentikan scanner:", err)
          );
      },
      (errorMessage) => {
        console.warn(errorMessage);
      }
    );

    scannerRef.current = scanner;
  }, []);

  useEffect(() => {
    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .catch((err) => console.warn("Scanner sudah dihentikan:", err));
      }
    };
  }, [startScanner]);

  const handleRescan = () => {
    setScanResult("");
    startScanner();
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
