import express from "express";
import pool from "./db_utils/db.js";
import initializeTables from "./db_utils/initialize_tables.js";
import booksRoutes from "./routes/books.js";
import cors from "cors";
import seedBooks from "./db_utils/seedbooks.js";
import seedTags from "./db_utils/seedTags.js";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/api/test", (req, res) => {
  res.send("API is running");
});

app.use(express.json());

// Use books routes
app.use("/api/books", booksRoutes);

const startServer = async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to the database");
    await initializeTables();
    await seedBooks();
    await seedTags();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
