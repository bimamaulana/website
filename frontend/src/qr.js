import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import moment from "moment-timezone";

const QR = () => {
  const getFormattedTime = () =>
    moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm");

  const [timestamp, setTimestamp] = useState(getFormattedTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(getFormattedTime());
    }, 60000);

    return () => clearInterval(interval);
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
