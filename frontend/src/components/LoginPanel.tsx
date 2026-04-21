import { Zap, CalendarClock, Users2 } from "lucide-react";

import "../styles/AuthPanel.css";

function LoginPanel() {
  return (
    <div className="auth-panel">
      <div className="auth-panel__content">
        <h2 className="auth-panel-title">
          Välkommen tillbaka! <span>Logga in</span>
        </h2>

        <ul className="auth-panel-features">
          <li className="auth-panel-feature">
            <div className="auth-panel-icon">
              <Zap size={18} />
            </div>
            <div className="auth-panel-body">
              <h3 className="auth-panel-feature--title">Snabbt och enkelt</h3>
              <p className="auth-panel-feature--description">
                Hitta pass eller personal på under en minut.
              </p>
            </div>
          </li>

          <li className="auth-panel-feature">
            <div className="auth-panel-icon">
              <CalendarClock size={18} />
            </div>
            <div className="auth-panel-body">
              <h3 className="auth-panel-feature--title">Alltid tillgängligt</h3>
              <p className="auth-panel-feature--description">
                Bläddra bland lediga pass och tillgänglig personal när det
                passar dig.
              </p>
            </div>
          </li>

          <li className="auth-panel-feature">
            <div className="auth-panel-icon">
              <Users2 size={18} />
            </div>
            <div className="auth-panel-body">
              <h3 className="auth-panel-feature--title">Bygg ditt nätverk</h3>
              <p className="auth-panel-feature--description">
                Samla betyg och spara dina favoriter för framtida samarbeten.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default LoginPanel;
