import { Link } from "react-router-dom";
import "../styles/CTABanner.css";

function CTABanner() {
  return (
    <section className="cta-banner">
      <div className="cta-banner__inner">
        <h2 className="cta-banner__title">
          Redo att hoppa in <span className="cta-banner__accent">direkt?</span>
        </h2>
        <p className="cta-banner__subtitle">
          Registrera dig gratis och hitta ditt nästa pass eller rätt person för
          jobbet.
        </p>

        <div className="cta-banner__actions">
          <Link to="/register/worker">Jag söker jobb</Link>
          <Link to="/register/employer">Jag söker personal</Link>
        </div>
      </div>
    </section>
  );
}

export default CTABanner;
