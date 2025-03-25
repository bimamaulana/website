import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./QR.css";

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
    </div>
  );
};

export default QR;
