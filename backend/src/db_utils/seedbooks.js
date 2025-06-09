// seedBooks.js
const pool = require("./db");

const seedBooks = async () => {
  try {
    // Check if there are any books already
    const result = await pool.query("SELECT COUNT(*) FROM books");
    const count = parseInt(result.rows[0].count);

    if (count === 0) {
      console.log("Seeding books table with demo data...");

      const demoBooks = [
        {
          title: "The Great Adventure",
          author: "John Doe",
          description: "A thrilling adventure story.",
          content: "# Chapter 1\n\nIt begins...",
          cover_url:
            "https://dommy-library.vercel.app/_next/image?url=%2Fimages%2Fthings-fall-apart.jpg&w=384&q=75",
        },
        {
          title: "Mystery of the Night",
          author: "Jane Smith",
          description: "A mysterious tale under the stars.",
          content: "# Chapter 1\n\nThe night was dark...",
          cover_url:
            "https://dommy-library.vercel.app/_next/image?url=%2Fimages%2Ffairy-tales.jpg&w=384&q=75",
        },
        {
          title: "Learn React in 24 Hours",
          author: "React Master",
          description: "A quick and easy guide to React.",
          content: "# Introduction\n\nReact is a library...",
          cover_url:
            "https://dommy-library.vercel.app/_next/image?url=%2Fimages%2Fthe-divine-comedy.jpg&w=384&q=75",
        },
        // Add more books here as needed...
      ];

      // Insert demo data
      for (const book of demoBooks) {
        await pool.query(
          `INSERT INTO books (title, author, description, content, cover_url)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            book.title,
            book.author,
            book.description,
            book.content,
            book.cover_url,
          ]
        );
      }

      console.log("Demo data inserted into books table.");
    } else {
      console.log("Books table already has data. Skipping seeding.");
    }
  } catch (error) {
    console.error("Error seeding books table:", error);
  }
};

module.exports = seedBooks;
