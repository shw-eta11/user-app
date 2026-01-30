const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

/* ✅ Allow frontend */
app.use(cors({
  origin: 
          "http://165.0.12.25:5173/users"
}));

app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.post("/users", async (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email || !age) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, age) VALUES ($1,$2,$3) RETURNING *",
      [name, email, age]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});


const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
