import express from "express";
import pool from "./db_utils/db.js";
import initializeTables from "./db_utils/initialize_tables.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

const startServer = async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to the database");
    await initializeTables();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
