import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <h2 className="footer__logo">onShift</h2>
          <p className="footer__tagline">
            Bemanning för restaurangbranschen. Hitta pass eller personal på
            minuter.
          </p>
        </div>

        <nav className="footer__nav">
          <div className="footer__nav-group">
            <h3 className="footer__nav-title">För personal</h3>
            <ul className="footer__nav-list">
              <li>
                <Link to="/jobs">Hitta jobb</Link>
              </li>
              <li>
                <Link to="/register/worker">Skapa profil</Link>
              </li>
            </ul>
          </div>

          <div className="footer__nav-group">
            <h3 className="footer__nav-title">För restauranger</h3>
            <ul className="footer__nav-list">
              <li>
                <Link to="/employer/workers">Hitta personal</Link>
              </li>
              <li>
                <Link to="/register/employer">Skapa profil</Link>
              </li>
            </ul>
          </div>

          <div className="footer__nav-group">
            <h3 className="footer__nav-title">Övrigt</h3>
            <ul className="footer__nav-list">
              <li>
                <HashLink to="/#how-it-works">Hur det fungerar</HashLink>
              </li>
              <li>
                <Link to="#">Om oss</Link>
              </li>
              <li>
                <Link to="#">Kontakt</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
