import { useState, useEffect } from "react";
import QRCode from "qrcode.react";

const QR = () => {
  const [timestamp, setTimestamp] = useState(Date.now().toString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Date.now().toString());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center p-4">
      <h1 className="text-2xl font-bold">QR Code Generator</h1>
      <p className="my-4">QR Code akan diperbarui setiap menit</p>
      <div className="flex justify-center">
        <QRCode value={timestamp} size={200} />
      </div>
    </div>
  );
};

export default QR;
