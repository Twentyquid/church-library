const pool = require("./db");

const seedTags = async () => {
  try {
    // Check if there are any tags already
    const result = await pool.query("SELECT COUNT(*) FROM tags");
    const count = parseInt(result.rows[0].count);

    if (count === 0) {
      console.log("Seeding tags table with demo data...");

      const demoTags = [{ name: "Philosophy" }, { name: "Classical" }];

      // Insert demo tags
      for (const tag of demoTags) {
        await pool.query(`INSERT INTO tags (name) VALUES ($1)`, [tag.name]);
      }

      console.log("Demo tags inserted into tags table.");
    } else {
      console.log("Tags table already has data. Skipping seeding.");
    }

    // Assign tags to book with id 1
    // Get tag ids
    const tagRows = await pool.query(
      `SELECT id, name FROM tags WHERE name = ANY($1)`,
      [["Philosophy", "Classical"]]
    );
    const tagIds = tagRows.rows.map((row) => row.id);

    // Check if assignments already exist
    const assignments = await pool.query(
      `SELECT * FROM book_tags WHERE book_id = $1 AND tag_id = ANY($2)`,
      [1, tagIds]
    );
    if (assignments.rows.length < tagIds.length) {
      for (const tagId of tagIds) {
        await pool.query(
          `INSERT INTO book_tags (book_id, tag_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [1, tagId]
        );
      }
      console.log("Tags assigned to book with id 1.");
    } else {
      console.log("Book 1 already has these tags. Skipping assignment.");
    }
  } catch (error) {
    console.error("Error seeding tags table or assigning tags:", error);
  }
};

module.exports = seedTags;
