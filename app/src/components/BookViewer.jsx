import { Suspense, lazy, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../api";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { use } from "react";
function BookViewer() {
  const { id } = useParams();
  const [book, setBook] = useState(null); // Add state to store book data
  const [content, setContent] = useState(""); // Add state to store book content
  const [fontSize, setFontSize] = useState(14); // State for font size
  const [pageContent, setPageContent] = useState(""); // State for page content
  // State for current page
  const increaseFontSize = () => {
    setFontSize((prev) => (prev < 28 ? prev + 2 : prev));
  };
  const decreaseFontSize = () => {
    setFontSize((prev) => (prev > 14 ? prev - 2 : prev));
  };
  const [searchParams, setSearchParams] = useSearchParams();

  // Always derive page from searchParams
  const page =
    parseInt(searchParams.get("page")) ||
    localStorage.getItem(`book-${id}`) ||
    1;

  // Synchronize localStorage with page param
  // useEffect(() => {
  //   if (id && page) {
  //     localStorage.setItem(`book-${id}`, page);
  //   }
  // }, [id, page]);

  // On mount, check localStorage for saved page and set search params accordingly
  useEffect(() => {
    const locallySavedPage = localStorage.getItem(`book-${id}`);
    if (locallySavedPage && parseInt(locallySavedPage) !== page) {
      setSearchParams({ page: locallySavedPage });
    }
    // Only run on mount or when id changes
    // eslint-disable-next-line
  }, [id]);

  // Fetch content when page changes
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get(`/books/${id}/page/${page}`);
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        const data = response.data;
        setContent(data); // Store fetched content in state
      } catch (error) {
        console.error("Error fetching book content:", error);
      }
    };
    fetchContent();
  }, [id, page]);

  // Fetch book details when page changes
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${id}?page=${page}`);
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
  }, [id, page]);
  return (
    <div className="text-black">
      <Suspense fallback={<div>Loading book details...</div>}>
        {/* Book details go here */}
        <div className="flex gap-4 items-center">
          <h3 className="text-3xl">{book ? book.title : "No book found"}</h3>{" "}
          <div>By {book ? book.author : "Unknown"}</div>
        </div>
        <div>
          <p>
            Page {page} of {book ? book.total_pages : "NA"}
          </p>
          <p>
            {book ? Math.round((page / book.total_pages) * 100) : "NA"}%
            Complete
          </p>
        </div>
        {/* divider */}
        <div className="my-4 flex gap-2">
          <button
            onClick={decreaseFontSize}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-lg font-semibold transition"
          >
            A-
          </button>
          <button
            onClick={increaseFontSize}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-lg font-semibold transition"
          >
            A+
          </button>
        </div>
        <div className="bg-slate-200 h-[1px] w-[calc(100%-40px)] mx-5"></div>
        <div className="mt-7">
          <div className="w-1/2 mx-auto">
            <div
              style={{ fontSize: `${fontSize}px` }}
              className="prose max-w-none"
            >
              <ReactMarkdown>
                {content ? content.content : "Content Loading"}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </Suspense>
      <div className="flex gap-4 justify-center mt-8">
        <button
          onClick={() => {
            if (page > 1) {
              localStorage.setItem(`book-${id}`, page - 1);
              setSearchParams({ page: page - 1 });
            }
          }}
          className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold transition disabled:bg-gray-300 disabled:text-gray-500"
          disabled={page <= 1}
        >
          Previous
        </button>
        <button
          onClick={() => {
            localStorage.setItem(`book-${id}`, Number(page) + 1);
            setSearchParams({ page: Number(page) + 1 });
          }}
          disabled={page >= (book ? book.total_pages : 0) - 1}
          className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BookViewer;
