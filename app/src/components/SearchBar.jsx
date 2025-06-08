import React from "react";

function SearchBar() {
  return (
    <div className="flex h-12">
      <input
        className="block h-full w-full focus:outline-none active:outline-none"
        type="text"
        placeholder="Search books..."
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        <i className="ri-search-line"></i>
      </button>
    </div>
  );
}

export default SearchBar;
