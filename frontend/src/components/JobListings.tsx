import { Link } from "react-router-dom";
import { MapPin, Clock, ChevronRight } from "lucide-react";

import "../styles/JobListings.css";

function JobListings() {
  return (
    //TODO: Fetch from database and only show the last 6 jobs
    //TODO: Publicerad xxx är fult
    //TODO: If logged in, POST to /api/jobs/:id/applications instead of redirecting to /login
    //TODO: fix link to /jobb/:id

    <section className="job-listings">
      <div className="section__inner">
        <header className="job-listings__header">
          <div className="job-listings__header-right">
            <h2 className="job-listings__title">Lediga pass just nu</h2>
            <p className="job-listings__subtitle">
              Säkra ett pass innan det försvinner
            </p>
          </div>
          <Link className="job-listings__see-all" to="/jobb">
            Se alla pass
            <ChevronRight size={16} />
          </Link>
        </header>

        <ul className="job-list">
          <li className="job-list__item">
            <Link to="/jobb/:id">
              <article className="job-card">
                <div className="job-card__header">
                  <h3 className="job-card__role">Kock</h3>
                  <span className="job-card__pay">220 kr/h</span>
                </div>
                <p className="job-card__restaurant">Restaurang Volt</p>

                <div className="job-card__meta">
                  <div className="job-card__meta-item">
                    <Clock size={14} />
                    <p className="job-card__meta-text">
                      Idag kl. 17:00 - 22:00
                    </p>
                  </div>
                  <div className="job-card__meta-item">
                    <MapPin size={14} />
                    <p className="job-card__meta-text">Södermalm, Stockholm</p>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="job-card__footer-meta">
                  <div className="job-card__tags">
                    <span className="badge badge--accent">Akut</span>
                    <span className="badge badge--accent">Erfarenhet</span>
                  </div>
                  <p className="job-card__published">
                    Publicerad: Idag kl. 14:00
                  </p>
                </div>

                {/* <footer className="job-card__actions">
                  <Link className="btn btn--outline" to="jobb/:id">
                    Läs mer
                  </Link>
                  <Link className="btn btn--primary" to="/login">
                    Ansök
                  </Link>
                </footer> */}
              </article>
            </Link>
          </li>

          <li className="job-list__item">
            <Link to="/jobb/:id">
              <article className="job-card">
                <div className="job-card__header">
                  <h3 className="job-card__role">Diskare</h3>
                  <span className="job-card__pay">150 kr/h</span>
                </div>
                <p className="job-card__restaurant">Brasserie Balzac</p>

                <div className="job-card__meta">
                  <div className="job-card__meta-item">
                    <Clock size={14} />
                    <p className="job-card__meta-text">
                      Lördag kl. 11:00 - 16:00
                    </p>
                  </div>
                  <div className="job-card__meta-item">
                    <MapPin size={14} />
                    <p className="job-card__meta-text">Vasastan, Stockholm</p>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="job-card__footer-meta">
                  <div className="job-card__tags">
                    <span className="badge badge--accent">Högt tempo</span>
                  </div>
                  <p className="job-card__published">
                    Publicerad: Igår kl. 11:00
                  </p>
                </div>

                {/* <footer className="job-card__actions">
                  <Link className="btn btn--outline" to="/jobs/:id">
                    Läs mer
                  </Link>
                  <Link className="btn btn--primary" to="/login">
                    Ansök
                  </Link>
                </footer> */}
              </article>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default JobListings;
