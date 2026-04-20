import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <nav className="header__nav">
        <Link to="/" className="header__logo">
          <span className="header__logo-accent">on</span>Shift
        </Link>
        <button className="header__login-btn btn btn--primary">Logga in</button>
      </nav>
    </header>
  );
}

export default Header;
