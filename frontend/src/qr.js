import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold">QR Code Generator</h1>
        <p className="my-4">QR Code akan diperbarui setiap menit</p>
        <div className="flex justify-center">
          <QRCodeCanvas value={qrValue} size={200} />
        </div>
        <p className="mt-4">Isi QR Code: {qrValue}</p>
      </div>
    </div>
  );
};

export default QR;
