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
          title: "Confessions",
          author: "St. Augustine",
          description:
            "A classic spiritual autobiography, reflecting on his life and conversion.",
          content_base_url:
            "https://kjloelfkmztbcwblcngd.supabase.co/storage/v1/object/public/demobucket/Books/4/",
          cover_url:
            "https://www.monergism.com/sites/default/files/content_images2/2015/confessoins800_0.jpg",
        },
      ];

      // Insert demo data
      for (const book of demoBooks) {
        await pool.query(
          `INSERT INTO books (title, author, description, content_base_url, cover_url)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            book.title,
            book.author,
            book.description,
            book.content_base_url,
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
