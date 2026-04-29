import { NavLink } from "react-router-dom";
import { Home, Search, ClipboardList, User2 } from "lucide-react";

import "../styles/BottomNav.css";

interface BottomNavProps {
  role: string;
}

function BottomNav({ role }: BottomNavProps) {
  //TODO: Navigation needs to move to left side on desktop
  //TODO: På sidan /jobb kolla om inloggad för då visa authheader och bottom nav antar jag
  //TODO: Check employer bottom nav

  return (
    <section>
      <div className="section__inner">
        {role === "worker" ? (
          <>
            <nav className="bottom-nav">
              <p className="bottom-nav__logo">
                <span>on</span>Shift
              </p>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <Home size={22} />
                <span>Hem</span>
              </NavLink>

              <NavLink
                to="/jobb"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <Search size={22} />
                <span>Hitta pass</span>
              </NavLink>

              <NavLink
                to="/ansokningar"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <ClipboardList size={22} />
                <span>Ansökningar</span>
              </NavLink>

              <NavLink
                to="/profil"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <User2 size={22} />
                <span>Profil</span>
              </NavLink>
            </nav>
          </>
        ) : (
          <>
            <nav className="bottom-nav">
              <p className="bottom-nav__logo">
                <span>on</span>Shift
              </p>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <Home size={22} />
                <span>Hem</span>
              </NavLink>

              <NavLink
                to="/personal"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <Search size={22} />
                <span>Hitta personal</span>
              </NavLink>
              <NavLink
                to="/mina-annonser"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <ClipboardList size={22} />
                <span>Annonser</span>
              </NavLink>
              <NavLink
                to="/profil"
                className={({ isActive }) =>
                  `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
                }
              >
                <User2 size={22} />
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
