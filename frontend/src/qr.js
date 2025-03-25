import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QR = () => {
  const getFormattedTime = () =>
    new Date().toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  const [timestamp, setTimestamp] = useState(getFormattedTime());

  useEffect(() => {
    const updateTimestamp = () => {
      setTimestamp(getFormattedTime());

      const now = new Date();
      const secondsUntilNextMinute = 60 - now.getSeconds(); // Hitung sisa detik menuju menit berikutnya

      setTimeout(() => {
        setTimestamp(getFormattedTime());
        setInterval(() => {
          setTimestamp(getFormattedTime());
        }, 60000);
      }, secondsUntilNextMinute * 1000);
    };

    updateTimestamp();

    return () => clearInterval(updateTimestamp);
  }, []);

  return (
    <div className="text-center p-4">
      <h1 className="text-2xl font-bold">QR Code Generator</h1>
      <p className="my-4">QR Code akan diperbarui setiap menit</p>
      <div className="flex justify-center">
        <QRCodeCanvas value={timestamp} size={200} />
      </div>
      <p className="mt-4">Isi QR Code: {timestamp}</p>
    </div>
  );
};

export default QR;
