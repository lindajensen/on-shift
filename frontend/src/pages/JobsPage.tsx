import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import LoginNudge from "../components/LoginNudge";
import { Job } from "../types";
import { Search, MapPin, Clock } from "lucide-react";

import "../styles/JobsPage.css";
import { getAllJobs } from "../api/jobs";

function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeFilter, setActiveFilter] = useState("Alla");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = [
    "Alla",
    "Akut",
    "Idag",
    "Helg",
    "Kväll",
    "Servitör",
    "Bartender",
    "Diskare",
    "Runner",
    "Kock",
  ];

  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await getAllJobs();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
        setError("Kunde inte hämta jobb");
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  //! Do not show all job openings if not logged in

  //TODO: Fix hardcoded subheading
  //TODO: Fetch from backend
  //TODO: Fix filtering
  //TODO: If logged in, POST to /api/jobs/:id/applications instead of redirecting to /login
  // TODO: Wrap /jobs in dynamic(?) layout based on if user is logged in or not

  return (
    <section className="jobs">
      <div className="section__inner">
        <header className="jobs__header">
          <h1 className="jobs__heading">Lediga pass</h1>
          <p className="jobs__subheading">
            Visa 8 av 124 lediga pass. Logga in för att se alla.
          </p>
        </header>

        <div className="jobs__search">
          <Search className="jobs__search-icon" size={16} />
          <input
            className="jobs__search-input"
            type="text"
            placeholder="Sök roll eller restaurang"
          />
        </div>

        <div className="jobs__filters">
          {filters.map((filter) => (
            <button
              className={`jobs__filter-btn ${activeFilter === filter ? "jobs__filter-btn--active" : ""}`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <LoginNudge />

        <ul className="job-list">
          {jobs.map((job) => (
            <li key={job.id} className="job-list__item">
              <article className="job-card">
                <div className="job-card__header">
                  <h3 className="job-card__role">{job.role}</h3>
                  <span className="job-card__pay">{job.compensation} kr/h</span>
                </div>
                <p className="job-card__restaurant">{job.restaurantName}</p>

                <div className="job-card__meta">
                  <div className="job-card__meta-item">
                    <Clock size={14} />
                    <p className="job-card__meta-text">
                      {job.date} kl. {job.startTime} - {job.endTime}
                    </p>
                  </div>
                  <div className="job-card__meta-item">
                    <MapPin size={14} />
                    <p className="job-card__meta-text">{job.location}</p>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="job-card__footer-meta">
                  <ul className="job-card__tags">
                    {job.tags.map((tag, index) => (
                      <li key={index} className="badge badge--accent">
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <p className="job-card__published">{job.postedAt}</p>
                </div>

                <footer className="job-card__actions">
                  <Link className="btn btn--outline" to="/jobs/:id">
                    Läs mer
                  </Link>
                  <Link className="btn btn--primary" to="/login">
                    Ansök
                  </Link>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default JobsPage;
