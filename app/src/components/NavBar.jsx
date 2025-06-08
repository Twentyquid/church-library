import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/catalog">Catalog</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}

export default NavBar;
