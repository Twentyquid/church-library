import { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Catalog from "./components/Catalog";
import About from "./components/About";
import NavBar from "./components/NavBar";
import BookViewer from "./components/BookViewer";
import "remixicon/fonts/remixicon.css";
import SearchBar from "./components/SearchBar";
import SingInButton from "./components/SingInButton";
import AuthModal from "./components/AuthModal";
import Footer from "./components/Footer";

function App() {
  const [modal, setModal] = useState(false);
  const handleClick = () => {
    console.log("Sign In button clicked");
    setModal(true);
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center p-4 bg-white text-gray-800">
          <h3>Divine Reading Oasis</h3>
          <NavBar />
          <div className="flex items-center space-x-4">
            <SearchBar />
            <SingInButton onClick={handleClick} />
          </div>
        </div>

        {modal && <AuthModal setModal={setModal} />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/about" element={<About />} />
          <Route path="/books/:id" element={<BookViewer />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
