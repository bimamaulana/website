import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

const Dashboard = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [scanResult, setScanResult] = useState("");
  const [isScanSuccessful, setIsScanSuccessful] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scannerRef = useRef(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const getCurrentTimeString = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  const startScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
    }

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render((decodedText) => {
      const regex = /^Laboratorium - (\d{2}\/\d{2}\/\d{4}), (\d{2}:\d{2})$/;
      const match = decodedText.match(regex);

      if (match) {
        const scannedDateTime = `${match[1]}, ${match[2]}`;
        const currentTime = getCurrentTimeString();

        if (scannedDateTime === currentTime) {
          setScanResult("Berhasil");
          setIsScanSuccessful(true);
        } else {
          setScanResult("Waktu QR Code tidak valid");
          setIsScanSuccessful(false);
        }
      } else {
        setScanResult("QR Code tidak valid");
        setIsScanSuccessful(false);
      }

      scanner.clear().catch(() => {});
    });

    scannerRef.current = scanner;
  }, []);

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, [startScanner]);

  const handleRescan = () => {
    setScanResult("");
    setIsScanSuccessful(false);
    startScanner();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleSaveToDatabase = async () => {
    if (!user) return alert("User tidak ditemukan!");

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${backendUrl}/api/save`, {
        nama: user.nama,
        nim: user.nim,
      });

      if (response.data.message) {
        alert("Data berhasil disimpan!");
        setIsScanSuccessful(false);
      } else {
        alert("Gagal menyimpan data: " + response.data.error);
      }
    } catch (error) {
      alert(
        "Terjadi kesalahan: " + (error.response?.data?.error || error.message)
      );
    } finally {
      setIsSubmitting(false);
    }
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
      {isScanSuccessful && (
        <button
          onClick={handleSaveToDatabase}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Mengirim..." : "Kirim Data"}
        </button>
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
