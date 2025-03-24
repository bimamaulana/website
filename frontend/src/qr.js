import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default function QR() {
  const [qrCode, setQrCode] = useState("");
  const [timestamp, setTimestamp] = useState("");

  const fetchQRCode = async () => {
    try {
      const response = await axios.get(`${API_URL}/qrcode`);
      setQrCode(`${API_URL}/qrcode/qr/`);
      setTimestamp(response.data.timestamp);
    } catch (error) {
      console.error("Gagal mengambil QR Code", error);
    }
  };

  useEffect(() => {
    fetchQRCode();
    const interval = setInterval(fetchQRCode, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>QR Code</h1>
      <p>{timestamp ? `Updated: ${timestamp}` : "Loading..."}</p>
      {qrCode && (
        <p style={{ fontSize: "20px", fontWeight: "bold" }}>{qrCode}</p>
      )}
      <button
        onClick={() => window.location.reload()}
        style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}
      >
        Refresh
      </button>
    </div>
  );
}
