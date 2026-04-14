import { useState } from "react";
import { Link } from "react-router-dom";

import { Menu, X } from "lucide-react";

import "../styles/Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar__container">
          {/* Hamburger Menu */}
          <button
            className="navbar__hamburger"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <Link to="/" className="navbar__logo">
            Budget Tracker
          </Link>

          {/* Desktop Menu */}
          <ul className="navbar__menu">
            <li className="navbar__menu-item">
              <Link to="/features" className="navbar__link">
                Features
              </Link>
            </li>
            <li className="navbar__menu-item">
              <Link to="/about" className="navbar__link">
                About
              </Link>
            </li>
            <li className="navbar__menu-item">
              <button className="navbar__button navbar__button--login">
                Log In
              </button>
            </li>
            <li className="navbar__menu-item">
              <button className="navbar__button navbar__button--signup">
                Sign Up
              </button>
            </li>
          </ul>

          {/* Mobile Button */}
          <button className="navbar__button navbar__button--mobile">
            Sign Up
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`navbar__mobile-menu ${
            isMenuOpen ? "navbar__mobile-menu--open" : ""
          }`}
        >
          <ul className="navbar__mobile-list">
            <li className="navbar__mobile-item">
              <Link
                to="/features"
                onClick={toggleMenu}
                className="navbar__mobile-link"
              >
                Features
              </Link>
            </li>
            <li className="navbar__mobile-item">
              <Link
                to="/about"
                onClick={toggleMenu}
                className="navbar__mobile-link"
              >
                About
              </Link>
            </li>
            <li className="navbar__mobile-item">
              <Link
                to="/login"
                onClick={toggleMenu}
                className="navbar__mobile-link"
              >
                Log In
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
