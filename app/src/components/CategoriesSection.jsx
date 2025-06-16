import React from "react";
import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/books/tags");
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        const data = await response.data;
        console.log(data); // Log the fetched tags
        setCategories(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div>
      <h3 className="text-center text-3xl">Explore Categories</h3>
      <p className="text-center">
        Discover books across various Christian topics and genres.
      </p>
      {categories.length > 0 && (
        <ul className="flex flex-wrap justify-center">
          {categories.map((category) => (
            <li
              key={category.id}
              className="m-2 p-2 border border-gray-300 rounded"
            >
              <Link to={`/catalog?tags=${encodeURIComponent(category.name)}`}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoriesSection;
