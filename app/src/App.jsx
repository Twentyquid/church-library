import { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Catalog from "./components/Catalog";
import About from "./components/About";
import NavBar from "./components/NavBar";
import "remixicon/fonts/remixicon.css";
import SearchBar from "./components/SearchBar";
import SingInButton from "./components/SingInButton";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
          <h3>Divine Reading Oasis</h3>
          <NavBar />
          <div className="flex items-center space-x-4">
            <SearchBar />
            <SingInButton />
          </div>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
