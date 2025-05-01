import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-orange-500 text-white px-4 sm:px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo or Brand */}
        <div className="text-xl font-bold">Buddhist Heritage</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-lg w-[70%] justify-center">
          <Link
            to="/"
            className="hover:bg-orange-600 hover:text-orange-100 px-3 py-1 rounded"
          >
            Home
          </Link>
          <Link
            to="/gallery"
            className="hover:bg-orange-600 hover:text-orange-100 px-3 py-1 rounded"
          >
            Gallery
          </Link>
          <Link
            to="/official-links"
            className="hover:bg-orange-600 hover:text-orange-100 px-3 py-1 rounded"
          >
            Official Links
          </Link>
          <a
            href="https://docs.google.com/document/d/1P00ehqc1z3YaVzi3X3r5kTIxHsloYdxr2iTKgk6dRvk/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-orange-600 hover:text-orange-100 px-3 py-1 rounded"
          >
            More
          </a>
          <Link
            to="/contact-us"
            className="hover:bg-orange-600 hover:text-orange-100 px-3 py-1 rounded"
          >
            Contact Us
          </Link>
        </div>

        {/* Desktop Sign-in button */}
        <div className="hidden md:block">
          <Link
            to="/signin"
            className="bg-white text-orange-600 font-semibold px-4 py-2 rounded hover:bg-orange-100 transition-all duration-200"
          >
            Sign-in
          </Link>
        </div>

        {/* Mobile/Tablet Hamburger Icon */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white hover:text-orange-200 transition-colors duration-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-2 text-center">
          <Link
            to="/"
            className="block hover:bg-orange-600 px-3 py-2 rounded"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/gallery"
            className="block hover:bg-orange-600 px-3 py-2 rounded"
            onClick={toggleMenu}
          >
            Gallery
          </Link>
          <Link
            to="/official-links"
            className="block hover:bg-orange-600 px-3 py-2 rounded"
            onClick={toggleMenu}
          >
            Official Links
          </Link>
          <a
            href="https://docs.google.com/document/d/1P00ehqc1z3YaVzi3X3r5kTIxHsloYdxr2iTKgk6dRvk/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:bg-orange-600 px-3 py-2 rounded"
            onClick={toggleMenu}
          >
            More
          </a>
          <Link
            to="/contact-us"
            className="block hover:bg-orange-600 px-3 py-2 rounded"
            onClick={toggleMenu}
          >
            Contact Us
          </Link>
          <Link
            to="/signin"
            className="block bg-white text-orange-600 font-semibold px-4 py-2 rounded mx-auto w-max hover:bg-orange-100"
            onClick={toggleMenu}
          >
            Sign-in
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
