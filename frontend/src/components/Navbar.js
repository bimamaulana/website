import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
    </nav>
  );
}
