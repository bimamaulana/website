import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [qrData, setQrData] = useState("");
  const [latestTimestamp, setLatestTimestamp] = useState({
    tanggal: "",
    waktu: "",
  });

  const formatTime24Hour = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const generateQRCode = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    const formattedDate = now.toLocaleDateString("id-ID");
    const formattedTime = formatTime24Hour(now);

    setQrData(
      JSON.stringify({
        nama: user?.nama,
        nim: user?.nim,
        waktu: now.toISOString(),
      })
    );

    setLatestTimestamp({ tanggal: formattedDate, waktu: formattedTime });
  };

  useEffect(() => {
    generateQRCode();

    const interval = setInterval(() => {
      generateQRCode();
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>
        Selamat datang, <span className="font-semibold">{user?.nama}</span> (
        {user?.nim})
      </p>
      <p>QR Code ini akan diperbarui setiap menit.</p>

      <div className="flex justify-center mt-4">
        <QRCodeCanvas value={qrData} size={200} />
      </div>

      <h2 className="text-lg font-semibold mt-6">Waktu Terakhir QR Code</h2>
      <div className="flex justify-center mt-4">
        <table className="border border-gray-800 w-1/2 text-center">
          <thead>
            <tr className="bg-gray-300 border border-gray-800">
              <th className="border border-gray-800 p-2">Tanggal</th>
              <th className="border border-gray-800 p-2">Waktu</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border border-gray-800">
              <td className="border border-gray-800 p-2">
                {latestTimestamp.tanggal}
              </td>
              <td className="border border-gray-800 p-2">
                {latestTimestamp.waktu}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
