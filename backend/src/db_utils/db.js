// db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "myuser",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "mydb",
  password: process.env.DB_PASSWORD || "mypassword",
  port: process.env.DB_PORT || 5432,
});

pool.on("connect", () => {
  console.log("✅ Connected to Postgres DB");
});

module.exports = pool;
