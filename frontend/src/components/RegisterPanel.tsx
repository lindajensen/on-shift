import {
  Search,
  CalendarClock,
  Star,
  Plus,
  Users2,
  Bookmark,
} from "lucide-react";

import "../styles/RegisterPanel.css";

interface RegisterPanelProps {
  role: "worker" | "employer";
}

function RegisterPanel({ role }: RegisterPanelProps) {
  return (
    <div className="register-form__panel ">
      {role === "worker" ? (
        <div className="register-form__panel__content">
          <h2 className="register-form__panel-title">
            Hoppa in och börja jobba <span>direkt</span>
          </h2>
          <ul className="register-form__panel-features">
            <li className="register-form__panel-feature">
              <div className="register-form__panel-icon">
                <Search size={18} />
              </div>
              <div className="register-form__panel-body">
                <h3 className="register-form__panel-feature--title">
                  Hitta pass snabbt
                </h3>
                <p className="register-form__panel-feature--description">
                  Blädddra bland lediga pass och ansök med ett klick.
                </p>
              </div>
            </li>

            <li className="register-form__panel-feature">
              <div className="register-form__panel-icon">
                <CalendarClock size={18} />
              </div>
              <div className="register-form__panel-body">
                <h3 className="register-form__panel-feature--title">
                  Du bestämmer när du jobbar
                </h3>
                <p className="register-form__panel-feature--description">
                  Ange din tillgänglighet och få förfrågningar när det passar
                  dig.
                </p>
              </div>
            </li>

            <li className="register-form__panel-feature">
              <div className="register-form__panel-icon">
                <Star size={18} />
              </div>
              <div className="register-form__panel-body">
                <h3 className="register-form__panel-feature--title">
                  Bygg ditt rykte
                </h3>
                <p className="register-form__panel-feature--description">
                  Samla betyg och bygg ett nätverk inom restaurangbranschen.
                </p>
              </div>
            </li>
          </ul>
        </div>
      ) : (
        <div className="register-form__panel__content">
          <h2 className="register-form__panel-title">
            Hitta rätt personal på bara några <span>minuter</span>
          </h2>
          <ul className="register-form__panel-features">
            <li className="register-form__panel-feature">
              <div className="register-form__panel-icon">
                <Plus size={18} />
              </div>
              <div className="register-form__panel-body">
                <h3 className="register-form__panel-feature--title">
                  Posta ett pass snabbt och enkelt
                </h3>
                <p className="register-form__panel-feature--description">
                  Välj roll, datum och ersättning. Klart på under en minut.
                </p>
              </div>
            </li>

            <li className="register-form__panel-feature">
              <div className="register-form__panel-icon">
                <Users2 size={18} />
              </div>
              <div className="register-form__panel-body">
                <h3 className="register-form__panel-feature--title">
                  Sök bland tillgänglig personal
                </h3>
                <p className="register-form__panel-feature--description">
                  Filtrera på roll, erfarenhet och tillgänglighet.
                </p>
              </div>
            </li>

            <li className="register-form__panel-feature">
              <div className="register-form__panel-icon">
                <Bookmark size={18} />
              </div>
              <div className="register-form__panel-body">
                <h3 className="register-form__panel-feature--title">
                  Spara dina favoriter
                </h3>
                <p className="register-form__panel-feature--description">
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
