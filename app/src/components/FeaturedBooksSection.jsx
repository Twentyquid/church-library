import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function FeaturedBooksSection() {
  // Add state to store books
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books");
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        const data = response.data;
        setBooks(data); // Store fetched books in state
        console.log(data);
      } catch (error) {
        console.error("Error fetching featured books:", error);
      }
    };
    fetchBooks();
  }, []);
  return (
    <div>
      <h2 className="text-3xl text-center">Featured books</h2>
      <p className="text-center">
        Explore our curated selection of spiritual classics and timeless
        Christian literature.
      </p>
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/books/${book.id}`)}
            >
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <h3 className="text-xl font-semibold">{book.title}</h3>
              <p className="text-gray-600">{book.author}</p>
              <p className="text-gray-800 mt-2">{book.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-4">No featured books available.</p>
      )}
    </div>
  );
}

export default FeaturedBooksSection;
