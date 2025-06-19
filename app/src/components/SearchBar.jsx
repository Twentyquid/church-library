import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
function SearchBar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.length > 1) {
        api
          .get(`/books?q=${searchTerm}`)
          .then((res) => {
            setSuggestions(res.data.books || []);
            // If suggestions are found, show the dropdown
            setShowDropdown(true);
          })
          .catch((err) => {
            console.error("Search error:", err);
            setSuggestions([]);
          });
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300); // debounce time

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);
  const handleSelect = (bookId) => {
    navigate(`/books/${bookId}`);
    setSearchTerm("");
    setSuggestions([]);
    setShowDropdown(false);
  };
  return (
    <div className="flex h-12 relative">
      <input
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        onFocus={() => searchTerm && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        value={searchTerm}
        className="block h-full w-full focus:outline-none active:outline-none text-white"
        type="text"
        placeholder="Search books..."
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        <i className="ri-search-line"></i>
      </button>
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 top-12 bg-white border border-gray-200 rounded mt-1 w-full shadow-lg max-h-60 overflow-auto">
          {suggestions.map((book) => (
            <li
              key={book.id}
              onClick={() => handleSelect(book.id)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            >
              {book.cover_url && (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-8 h-10 object-cover rounded mr-2"
                />
              )}
              <span>{book.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
