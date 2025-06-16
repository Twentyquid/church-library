import React from "react";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api";

function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = await api.get("/books", {
          params: {
            page: searchParams.get("page") || 1,
            tags: searchParams.get("tags") || "",
          },
        });
        console.log(request.data);
        setBooks(request.data.books);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setBooks([]);
      }
    };
    fetchData();
  }, [searchParams]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-black">
      {books.length > 0 &&
        books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
          >
            {book.cover_url && (
              <Link to={`/books/${book.id}`}>
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-32 h-48 object-cover mb-4 rounded"
                />
              </Link>
            )}
            <h2 className="text-lg font-semibold mb-2">{book.title}</h2>
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Author:</span> {book.author}
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {book.tags &&
                book.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
            </div>
            <p className="text-sm text-gray-600">{book.description}</p>
          </div>
        ))}
    </div>
  );
}

export default Catalog;
