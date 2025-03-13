import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function QR() {
  const [qrCode, setQrCode] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login");
    } else if (window.location.pathname === "/qr") {
      navigate("/login/qr");
    }
  }, [navigate]);

  const fetchQRCode = async () => {
    try {
      const response = await axios.get("http://localhost:8000/qrcode");
      setQrCode(response.data.qr);
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>QR Code</h1>
      {user && <h3>Login sebagai: {user.nama}</h3>}
      {qrCode && <img src={qrCode} alt="QR Code" />}
      <p>{timestamp ? `Updated: ${timestamp}` : "Loading..."}</p>
      <button
        onClick={handleLogout}
        style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}
      >
        Logout
      </button>
      <button
        onClick={handleRefresh}
        style={{
          marginTop: "20px",
          marginLeft: "10px",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Refresh
      </button>
    </div>
  );
}
