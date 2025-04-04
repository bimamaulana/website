const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const QRCode = require("qrcode");
const moment = require("moment-timezone");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: ["https://pacific-cat-production.up.railway.app", "localhost:3000"], //"*", // Mengizinkan semua origin (gunakan domain spesifik untuk produksi)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
); // Pastikan CORS diaktifkan
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Konfigurasi koneksi ke database MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
});

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error("Koneksi gagal:", err);
    process.exit(1); // Keluar dari proses jika koneksi gagal
    return;
  }
  console.log("Terhubung ke database");
});

// Koneksi ke database kedua
const db2 = mysql.createConnection({
  host: process.env.DB2_HOST,
  user: process.env.DB2_USER,
  password: process.env.DB2_PASSWORD,
  database: process.env.DB2_DBNAME,
});

db2.connect((err) => {
  if (err) {
    console.error("Koneksi ke database 2 gagal:", err);
    process.exit(1);
  }
  console.log("Terhubung ke database 2");
});

app.get("/", (req, res) => {
  res.send("Server berjalan!");
});

// Endpoint untuk mengambil data
app.get("/data", (req, res) => {
  const sql = "SELECT * FROM mahasiswa";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send("Gagal mengambil data");
      return;
    }
    res.json(results);
  });
});
//cara jalankan di terminal:
//curl -X GET http://localhost:8000/data

//endpoint db kedua
app.get("/data2", (req, res) => {
  const sql2 = "SELECT * FROM history";
  db2.query(sql2, (err, results) => {
    if (err) {
      res.status(500).send("Gagal mengambil data dari DB2");
      return;
    }
    res.json(results);
  });
});
//cara jalankan di terminal:
//curl -X GET http://localhost:8000/data2

//endpoint menambah data
app.post("/data", (req, res) => {
  const { nama, nim } = req.body; // Sesuaikan dengan nama kolom di database
  const sql = "INSERT INTO mahasiswa (nama, nim) VALUES (?, ?)";
  db.query(sql, [nama, nim], (err, result) => {
    if (err) {
      res.status(500).send("Gagal menambahkan data");
      return;
    }
    res.json({ id: result.insertId, nama, nim });
  });
});
//cara jalankan di terminal :
// curl -X POST http://localhost:8000/data -H "Content-Type: application/json" -d '{"nama": "John Doe", "nim": "12345678"}'

// Endpoint untuk menyimpan data absen
app.post("/data2", (req, res) => {
  const { nama, nim } = req.body;

  const sql = "INSERT IGNORE INTO history (nama, nim) VALUES (?, ?)"; // Sesuaikan dengan tabel yang digunakan

  db2.query(sql, [nama, nim], (err, result) => {
    if (err) {
      console.error("Error di backend:", err);
      return res.status(500).json({ message: "Terjadi kesalahan di server" });
    }
    console.log("Data berhasil disimpan, ID:", result.insertId);
    res
      .status(201)
      .json({ message: "Data berhasil disimpan", id: result.insertId });
  });
});

//delete
app.delete("/data/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM mahasiswa WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error MySQL:", err);
      res.status(500).json({ error: "Gagal menghapus data", details: err });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Data tidak ditemukan" });
      return;
    }
    res.json({ message: "Data berhasil dihapus", id });
  });
});
//cara jalankan di terminal :
//curl -X DELETE http://localhost:3000/data/(nomor id)

//update
app.put("/data/:id", (req, res) => {
  const { id } = req.params;
  const { nama, nim } = req.body;
  const sql = "UPDATE mahasiswa SET nama = ?, nim = ? WHERE id = ?";
  db.query(sql, [nama, nim, id], (err, result) => {
    if (err) {
      console.error("Error MySQL:", err);
      res.status(500).json({ error: "Gagal memperbarui data", details: err });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Data tidak ditemukan" });
      return;
    }
    res.json({ message: "Data berhasil diperbarui", id, nama, nim });
  });
});
//cara jalankan di terminal :
//curl -X PUT http://localhost:8000/data/1 -H "Content-Type: application/json" -d '{"nama": "Jane Doe", "nim": "87654321"}'

app.post("/login", (req, res) => {
  const { nama, nim } = req.body;
  db.query(
    "SELECT * FROM mahasiswa WHERE nama = ? AND nim = ?",
    [nama, nim],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
      if (result.length > 0) {
        res.json({ success: true, user: result[0] });
      } else {
        res.json({ success: false, message: "Nama atau NIM salah" });
      }
    }
  );
});

app.post("/signup", (req, res) => {
  const { nama, nim } = req.body;
  db.query(
    "INSERT INTO mahasiswa (nama, nim) VALUES (?, ?)",
    [nama, nim],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: "Pendaftaran berhasil" });
    }
  );
});

//qr code
app.get("/qrcode", (req, res) => {
  res.json({ qr: "Generated QR Code", timestamp: new Date().toISOString() });
});

//history
app.get("/history", (req, res) => {
  const sql = "SELECT * FROM history ORDER BY waktu DESC";
  db2.query(sql, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Gagal mengambil data history" });
    }
    res.json(results);
  });
});

setInterval(() => {
  console.log("Restarting server...");
  process.exit(1); // Matikan proses agar Railway otomatis restart
}, 300000); // 5 menit (300.000 ms)

app.listen(port, "0.0.0.0", () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
