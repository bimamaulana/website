import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import QrScanner from "qr-scanner"; // Library untuk scan QR Code
import "./styles/QR.css";

const QR = () => {
  const getFormattedTime = () => {
    const now = new Date();
    const tanggal = String(now.getDate()).padStart(2, "0");
    const bulan = String(now.getMonth() + 1).padStart(2, "0");
    const tahun = now.getFullYear();
    const jam = String(now.getHours()).padStart(2, "0");
    const menit = String(now.getMinutes()).padStart(2, "0");

    return `${tanggal}/${bulan}/${tahun}, ${jam}:${menit}`;
  };

  const [qrValue, setQrValue] = useState(
    `Laboratorium - ${getFormattedTime()}`
  );
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const updateTimestamp = () => {
      setQrValue(`Laboratorium - ${getFormattedTime()}`);

      const now = new Date();
      const secondsUntilNextMinute = 60 - now.getSeconds();

      setTimeout(() => {
        setQrValue(`Laboratorium - ${getFormattedTime()}`);

        setInterval(() => {
          setQrValue(`Laboratorium - ${getFormattedTime()}`);
        }, 60000);
      }, secondsUntilNextMinute * 1000);
    };

    updateTimestamp();

    return () => clearInterval(updateTimestamp);
  }, []);

  // Fungsi untuk menangani scan QR Code
  const handleScan = (data) => {
    if (data) {
      setScanResult(data); // Simpan hasil scan

      const [nama, nim] = data.split(","); // Format QR: "Nama,NIM"

      fetch("https://backendmu.railway.app/absen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, nim }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.success) {
            alert("✅ Absen berhasil!");
          } else {
            alert("❌ Gagal absen!");
          }
        })
        .catch((err) => console.error("Error:", err));
    }
  };

  // Fungsi untuk memulai scanner QR
  useEffect(() => {
    const videoElement = document.createElement("video");
    const qrScanner = new QrScanner(videoElement, (result) => {
      handleScan(result.data);
    });

    qrScanner.start(); // Mulai scanner

    return () => qrScanner.stop(); // Hentikan scanner saat komponen di-unmount
  }, []);

  return (
    <div className="qr-container">
      <div className="qr-box">
        <h1 className="qr-title">QR Code Generator</h1>
        <p className="qr-text">QR Code akan diperbarui setiap menit</p>
        <div className="qr-code">
          <QRCodeCanvas value={qrValue} size={200} />
        </div>
        <p className="qr-text">Isi QR Code: {qrValue}</p>
      </div>

      {/* Hasil scan ditampilkan */}
      {scanResult && (
        <div className="qr-box">
          <h2 className="qr-title">Hasil Scan:</h2>
          <p className="qr-text">{scanResult}</p>
        </div>
      )}

      {/* Video untuk scanning QR Code */}
      <video className="qr-scanner-video" />
    </div>
  );
};

export default QR;
