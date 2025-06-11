import React from "react";

function SignInButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
    >
      Sign In
    </button>
  );
}

export default SignInButton;
