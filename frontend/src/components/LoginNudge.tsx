import { Link } from "react-router-dom";

import "../styles/LoginNudge.css";

function LoginNudge() {
  return (
    <div className="login-nudge">
      <p className="login-nudge__text">Logga in för att ansöka</p>
      <Link className="btn btn--primary" to="/logga-in">
        Logga in
      </Link>
    </div>
  );
}

export default LoginNudge;
