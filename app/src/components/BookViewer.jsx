import { Suspense, lazy, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../api";
import axios from "axios";
import ReactMarkdown from "react-markdown";
function BookViewer() {
  const { id } = useParams();
  const [book, setBook] = useState(null); // Add state to store book data
  const [content, setContent] = useState(""); // Add state to store book content
  const [fontSize, setFontSize] = useState(14); // State for font size
  // State for current page
  const increaseFontSize = () => {
    setFontSize((prev) => (prev < 28 ? prev + 2 : prev));
  };
  const decreaseFontSize = () => {
    setFontSize((prev) => (prev > 14 ? prev - 2 : prev));
  };
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(page);

  // Sync currentPage with search params
  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${id}?page=${currentPage}`);
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        const data = response.data;
        setBook(data); // Store fetched book in state
        console.log(data);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };
    fetchBook();
  }, [currentPage]);
  return (
    <div className="text-black">
      <Suspense fallback={<div>Loading book details...</div>}>
        {/* Book details go here */}
        <div className="flex gap-4 items-center">
          <h3 className="text-3xl">{book ? book.title : "No book found"}</h3>{" "}
          <div>By {book ? book.author : "Unknown"}</div>
        </div>
        {/* divider */}
        <div>
          <button onClick={decreaseFontSize}>A-</button>
          <button onClick={increaseFontSize}>A+</button>
        </div>
        <div className="bg-slate-200 h-[1px] w-[calc(100%-40px)] mx-5"></div>
        <div className="mt-7">
          <div className="w-1/2 mx-auto">
            <div
              style={{ fontSize: `${fontSize}px` }}
              className="prose max-w-none"
            >
              <ReactMarkdown>
                {book ? book.content : "Content not available"}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </Suspense>
      <div>
        <button
          onClick={() => {
            if (currentPage > 1) {
              setSearchParams({ page: currentPage - 1 });
            }
          }}
        >
          Previous
        </button>
        <button
          onClick={() => {
            setSearchParams({ page: Number(currentPage) + 1 });
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BookViewer;
