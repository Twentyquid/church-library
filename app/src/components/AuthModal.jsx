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
      className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div onClick={(e) => e.stopPropagation()} ref={modalRef}>
        AuthModal
      </div>
    </div>
  );
}

export default AuthModal;
