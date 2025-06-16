// controllers/booksController.js
const pool = require("../db_utils/db");
// Get all books (with optional search query)
exports.getAllBooks = async (req, res) => {
  const { q, tags, page = 1, limit = 10 } = req.query;
  console.log("Query Parameters:", req.query);

  // Parse tags if provided
  let tagArray = [];
  if (tags) {
    tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  // Pagination calculation
  const pageNum = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  const pageLimit = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
  const offset = (pageNum - 1) * pageLimit;

  try {
    let result;
    let countResult;
    let baseQuery = `
      SELECT b.*, array_remove(array_agg(t.name),NULL) as tags
      FROM books b
      LEFT JOIN book_tags bt ON b.id = bt.book_id
      LEFT JOIN tags t ON t.id = bt.tag_id
    `;
    let whereClauses = [];
    let values = [];
    let valueIdx = 1;

    // Full-text search
    if (q) {
      whereClauses.push(
        `to_tsvector('english', b.title) @@ plainto_tsquery('english', $${valueIdx++})`
      );
      values.push(q);
    }
    console.log("Tag Array:", tagArray);
    // Tag filter
    if (tagArray.length > 0) {
      // Only select books that have ALL the requested tags
      baseQuery += `
        JOIN (
          SELECT bt2.book_id
          FROM book_tags bt2
          JOIN tags t2 ON t2.id = bt2.tag_id
          WHERE t2.name = ANY($${valueIdx++})
          GROUP BY bt2.book_id
          HAVING COUNT(DISTINCT t2.name) = $${valueIdx++}
        ) tag_filter ON tag_filter.book_id = b.id
      `;
      values.push(tagArray);
      values.push(tagArray.length);
    }

    let whereSQL =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // Final query with pagination
    let finalQuery = `
      ${baseQuery}
      ${whereSQL}
      GROUP BY b.id
      ORDER BY b.id ASC
      LIMIT $${valueIdx++} OFFSET $${valueIdx++}
    `;
    values.push(pageLimit, offset);

    // Count query for total results (for pagination)
    let countQuery = `
      SELECT COUNT(DISTINCT b.id) AS total
      FROM books b
      LEFT JOIN book_tags bt ON b.id = bt.book_id
      LEFT JOIN tags t ON t.id = bt.tag_id
    `;
    if (tagArray.length > 0) {
      countQuery += `
        JOIN (
          SELECT bt2.book_id
          FROM book_tags bt2
          JOIN tags t2 ON t2.id = bt2.tag_id
          WHERE t2.name = ANY($1)
          GROUP BY bt2.book_id
          HAVING COUNT(DISTINCT t2.name) = $2
        ) tag_filter ON tag_filter.book_id = b.id
      `;
    }
    let countWhereSQL =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
    countQuery += ` ${countWhereSQL}`;

    // Run queries
    result = await pool.query(finalQuery, values);
    if (tagArray.length > 0) {
      countResult = await pool.query(countQuery, [
        tagArray,
        tagArray.length,
        ...(q ? [q] : []),
      ]);
    } else {
      countResult = await pool.query(countQuery, q ? [q] : []);
    }
    const total = countResult.rows[0]
      ? parseInt(countResult.rows[0].total, 10)
      : 0;

    res.json({
      books: result.rows,
      page: pageNum,
      limit: pageLimit,
      total,
      totalPages: Math.ceil(total / pageLimit),
    });
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
    const tagResult = await pool.query(
      `SELECT t.name FROM tags t
       JOIN book_tags bt ON t.id = bt.tag_id
       WHERE bt.book_id = $1`,
      [id]
    );
    const book = result.rows[0];
    book.tags = tagResult.rows.map((row) => row.name);
    res.json(book);
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
    const pageUrl = `${baseUrl}${paddedPageNumber}.md`;
    console.log(pageUrl);

    const response = await fetch(pageUrl);
    if (!response.ok) {
      return res.status(404).json({ error: "Book Page not found" });
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

// Get all tags
exports.getAllTags = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tags ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tags:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
