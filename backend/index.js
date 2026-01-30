const express = require("express");
const cors = require("cors");
const pool = require("./db");   // ← DB connection

const app = express();

/* CORS */
app.use(cors({
  origin: "http://65.0.12.25:5173"
}));

app.use(express.json());

/* GET users */
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* 🔴 CHANGE THIS PART */
app.post("/users", async (req, res) => {
  const { name, email, age } = req.body;

  console.log("REQUEST BODY 👉", req.body);

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, age) VALUES ($1,$2,$3) RETURNING *",
      [name, email, age]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("POST /users ERROR 👉", err);
    res.status(500).json({
      error: err.message,
      code: err.code
    });
  }
});

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
