// routes/books.js
const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");

// GET /api/books - List all books (with optional search)
router.get("/", booksController.getAllBooks);

// GET /api/books/:id/page/:pageNumber - Get a specific page of a book
router.get(
  "/:id/page/:pageNumber",
  (req, res, next) => {
    console.log("Matched /:id/page/:pageNumber", req.params);
    next();
  },
  booksController.getBookPage
);
router.get("/tags", booksController.getAllTags);
// GET /api/books/:id - Get a single book by ID
router.get("/:id", booksController.getBookById);

// POST /api/books - Add a new book
router.post("/", booksController.addBook);

// PUT /api/books/:id - Update a book
router.put("/:id", booksController.updateBook);

// DELETE /api/books/:id - Delete a book
router.delete("/:id", booksController.deleteBook);

module.exports = router;
