const express = require("express");
const mysql = require("mysql");

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "mahasiswa",
  password: "",
  database: "coba",
});

db.connect((err) => {
  if (err) throw err;
  console.log("database terhubung");
  app.get("/", (req, res) => {
    res.send("OK ROUTE TERBUKA");
  });
});

app.listen(8000, () => {
  console.log("server nyala...");
});
