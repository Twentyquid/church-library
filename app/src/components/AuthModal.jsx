import React from "react";

function AuthModal({ setModal }) {
  const modalRef = React.useRef(null);
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setModal(false);
    }
  };

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>
        <form className="space-y-5">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
        <button
          className="mt-4 text-sm text-gray-500 hover:underline w-full"
          onClick={() => setModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AuthModal;
