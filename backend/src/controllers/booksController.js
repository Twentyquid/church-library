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
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 50;

  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    const book = result.rows[0];
    // console.log(book);
    const response = await fetch(book.content);
    if (!response.ok) {
      throw new Error("Failed to fetch book content");
    }
    const fullContent = await response.text();
    // split the content into lines for pagination
    const lines = fullContent.split("\n");
    const startLine = (page - 1) * pageSize;
    const endLine = startLine + pageSize;
    const pageLines = lines.slice(startLine, endLine);
    const pageContent = pageLines.join("\n");
    res.json({
      ...result.rows[0],
      content: pageContent,
      totalLines: lines.length,
    });
  } catch (err) {
    console.error("Error fetching book:", err);
    res.status(500).json({ error: err.message });
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
