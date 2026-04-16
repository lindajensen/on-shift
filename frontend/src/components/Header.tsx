import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <nav className="header__nav">
        <p className="header__logo">onShift</p>
        <button className="header__login-btn btn--primary">Logga in</button>
      </nav>
    </header>
  );
}

export default Header;
