import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
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
  const [scanResult, setScanResult] = useState("");
  const [inputScan, setInputScan] = useState("");

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

  // Simulasi "scan" dengan input manual
  const handleManualScan = () => {
    if (inputScan.trim() !== "") {
      setScanResult(inputScan);

      const [nama, nim] = inputScan.split(","); // Format QR: "Nama,NIM"

      fetch(`${process.env.REACT_APP_BACKEND_URL}/absen`, {
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

      {/* Input untuk memasukkan hasil scan secara manual */}
      <div className="qr-box">
        <h2 className="qr-title">Masukkan Hasil Scan:</h2>
        <input
          type="text"
          value={inputScan}
          onChange={(e) => setInputScan(e.target.value)}
          className="border p-2 w-full"
          placeholder="Masukkan Nama,NIM"
        />
        <button
          onClick={handleManualScan}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Simpan ke Database
        </button>
      </div>

      {/* Menampilkan hasil scan */}
      {scanResult && (
        <div className="qr-box">
          <h2 className="qr-title">Hasil Scan:</h2>
          <p className="qr-text">{scanResult}</p>
        </div>
      )}
    </div>
  );
};

export default QR;
