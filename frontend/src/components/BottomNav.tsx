import { NavLink, Link } from "react-router-dom";
import { Home, Search, ClipboardList, User2 } from "lucide-react";

import "../styles/BottomNav.css";

interface BottomNavProps {
  role: string;
}

function BottomNav({ role }: BottomNavProps) {
  return (
    <section>
      <div className="section__inner">
        {role === "worker" ? (
          <>
            <nav className="bottom-nav">
              <Link to="/" className="bottom-nav__logo">
                <span>on</span>Shift
              </Link>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <Home size={22} aria-hidden="true" />
                <span>Hem</span>
              </NavLink>

              <NavLink
                to="/jobb"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <Search size={22} aria-hidden="true" />
                <span>Hitta pass</span>
              </NavLink>

              <NavLink
                to="/ansokningar"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <ClipboardList size={22} aria-hidden="true" />
                <span>Ansökningar</span>
              </NavLink>

              <NavLink
                to="/min-profil"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <User2 size={22} aria-hidden="true" />
                <span>Profil</span>
              </NavLink>
            </nav>
          </>
        ) : (
          <>
            <nav className="bottom-nav">
              <Link to="/" className="bottom-nav__logo">
                <span>on</span>Shift
              </Link>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <Home size={22} aria-hidden="true" />
                <span>Hem</span>
              </NavLink>

              <NavLink
                to="/personal"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <Search size={22} aria-hidden="true" />
                <span>Hitta personal</span>
              </NavLink>
              <NavLink
                to="/mina-annonser"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <ClipboardList size={22} aria-hidden="true" />
                <span>Annonser</span>
              </NavLink>
              <NavLink
                to="/min-profil"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <User2 size={22} aria-hidden="true" />
                <span>Profil</span>
              </NavLink>
            </nav>
          </>
        )}
      </div>
    </section>
  );
}

export default BottomNav;
