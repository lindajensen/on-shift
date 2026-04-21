import {
  Search,
  CalendarClock,
  Star,
  Plus,
  Users2,
  Bookmark,
} from "lucide-react";

import "../styles/AuthPanel.css";

interface RegisterPanelProps {
  role: "worker" | "employer";
}

function RegisterPanel({ role }: RegisterPanelProps) {
  return (
    <div className="auth-panel">
      {role === "worker" ? (
        <div className="auth-panel__content">
          <h2 className="auth-panel-title">
            Hoppa in och börja jobba <span>direkt</span>
          </h2>
          <ul className="auth-panel-features">
            <li className="auth-panel-feature">
              <div className="auth-panel-icon">
                <Search size={18} />
              </div>
              <div className="auth-panel-body">
                <h3 className="auth-panel-feature--title">Hitta pass snabbt</h3>
                <p className="auth-panel-feature--description">
                  Blädddra bland lediga pass och ansök med ett klick.
                </p>
              </div>
            </li>

            <li className="auth-panel-feature">
              <div className="auth-panel-icon">
                <CalendarClock size={18} />
              </div>
              <div className="auth-panel-body">
                <h3 className="auth-panel-feature--title">
                  Du bestämmer när du jobbar
                </h3>
                <p className="auth-panel-feature--description">
                  Ange din tillgänglighet och få förfrågningar när det passar
                  dig.
                </p>
              </div>
            </li>

            <li className="auth-panel-feature">
              <div className="auth-panel-icon">
                <Star size={18} />
              </div>
              <div className="auth-panel-body">
                <h3 className="auth-panel-feature--title">Bygg ditt rykte</h3>
                <p className="auth-panel-feature--description">
                  Samla betyg och bygg ett nätverk inom restaurangbranschen.
                </p>
              </div>
            </li>
          </ul>
        </div>
      ) : (
        <div className="auth-panel__content">
          <h2 className="auth-panel-title">
            Hitta rätt personal på bara några <span>minuter</span>
          </h2>
          <ul className="auth-panel-features">
            <li className="auth-panel-feature">
              <div className="auth-panel-icon">
                <Plus size={18} />
              </div>
              <div className="auth-panel-body">
                <h3 className="auth-panel-feature--title">
                  Posta ett pass snabbt och enkelt
                </h3>
                <p className="auth-panel-feature--description">
                  Välj roll, datum och ersättning. Klart på under en minut.
                </p>
              </div>
            </li>

            <li className="auth-panel-feature">
              <div className="auth-panel-icon">
                <Users2 size={18} />
              </div>
              <div className="auth-panel-body">
                <h3 className="auth-panel-feature--title">
                  Sök bland tillgänglig personal
                </h3>
                <p className="auth-panel-feature--description">
                  Filtrera på roll, erfarenhet och tillgänglighet.
                </p>
              </div>
            </li>

            <li className="auth-panel-feature">
              <div className="auth-panel-icon">
                <Bookmark size={18} />
              </div>
              <div className="auth-panel-body">
                <h3 className="auth-panel-feature--title">
                  Spara dina favoriter
                </h3>
                <p className="auth-panel-feature--description">
                  Bygg ett eget nätverk av pålitlig och tillgänglig personal.
                </p>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default RegisterPanel;
