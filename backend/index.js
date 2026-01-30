const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors({
  origin: "http://65.0.12.25:5173"
}));

app.use(express.json());

/* =========================
   ROUTES
========================= */

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

/* GET users */
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, age, created_at FROM users ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /users ERROR 👉", err);
    res.status(500).json({ error: err.message });
  }
});

/* POST user */
app.post("/users", async (req, res) => {
  const { name, email, age } = req.body;

  console.log("REQUEST BODY 👉", req.body);

  // Validation
  if (!name || !email || age === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (isNaN(age)) {
    return res.status(400).json({ error: "Age must be a number" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, age)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, age, created_at`,
      [name, email, age]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("POST /users DB ERROR 👉", err);
    res.status(500).json({
      error: err.message,
      code: err.code
    });
  }
});

/* =========================
   SERVER
========================= */

const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
