// controllers/booksController.js
const pool = require("../db_utils/db");
// Get all books (with optional search query)
exports.getAllBooks = async (req, res) => {
  const { q } = req.query;

  try {
    let result;
    if (q) {
      // Full-text search in Postgres
      result = await pool.query(
        `SELECT * FROM books WHERE to_tsvector('english', title) @@ plainto_tsquery('english', $1) ORDER BY id ASC`,
        [q]
      );
    } else {
      result = await pool.query("SELECT * FROM books ORDER BY id ASC");
    }
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get book by ID
exports.getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching book:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch individual book page content
exports.getBookPage = async (req, res) => {
  const { id, pageNumber } = req.params;

  if (!pageNumber) {
    return res.status(400).json({ error: "Page number is required" });
  }

  try {
    const result = await pool.query(
      "SELECT content_base_url FROM books WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    const baseUrl = result.rows[0].content_base_url;
    // Assuming pages are stored as {baseUrl}/{pageNumber}.md
    const paddedPageNumber = String(pageNumber).padStart(5, "0");
    const pageUrl = `${baseUrl}/${paddedPageNumber}.md`;
    console.log(pageUrl);

    const response = await fetch(pageUrl);
    if (!response.ok) {
      return res.status(404).json({ error: "Page not found" });
    }
    const pageContent = await response.text();
    res.json({ page: parseInt(pageNumber, 10), content: pageContent });
  } catch (err) {
    console.error("Error fetching book page:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a new book
exports.addBook = async (req, res) => {
  const { title, author, description, content } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO books (title, author, description, content)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, author, description, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding book:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update book
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, description, content } = req.body;

  try {
    const result = await pool.query(
      `UPDATE books
       SET title = $1, author = $2, description = $3, content = $4
       WHERE id = $5
       RETURNING *`,
      [title, author, description, content, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book deleted" });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
