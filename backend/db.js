const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

const initializeDatabase = async () => {
  try {
    // 1. Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT UNIQUE,
        age INTEGER, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Ensure "age" column exists (in case the table was created previously without it)
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER;
    `);
    console.log("✅ Tables and columns verified");

    // 3. Insert sample data with age
    await pool.query(`
      INSERT INTO users (username, email, age)
      VALUES ('admin', 'admin@example.com', 25)
      ON CONFLICT (username) DO UPDATE 
      SET age = EXCLUDED.age; 
    `);
    console.log("✅ Seed data inserted/updated");

  } catch (err) {
    console.error("❌ Database initialization failed:", err.message);
  }
};

const connectWithRetry = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ DB connected");
    await initializeDatabase();
  } catch (err) {
    console.error("❌ DB not ready, retrying in 5s...");
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

module.exports = pool;