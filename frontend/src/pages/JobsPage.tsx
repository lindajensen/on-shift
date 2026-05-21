import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/useAuth";

import LoginNudge from "../components/LoginNudge";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";

import { getAllJobs } from "../api/jobs";
import { getSavedJobs, saveJob, unsaveJob } from "../api/worker";
import {
  getShiftType,
  formatCompensation,
  getRoleLabel,
} from "../utils/formatters";
import { formatDate, formatTime } from "../utils/date";
import { PublicJobListing } from "../types";

import { Search, MapPin, Clock, Wallet, Bookmark } from "lucide-react";

import "../styles/JobsPage.css";

function JobsPage() {
  const [jobs, setJobs] = useState<PublicJobListing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Alla");
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(new Set());

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const filters = [
    "Alla",
    "Akut",
    "Idag",
    "Dag",
    "Helg",
    "Kväll",
    "Ingen erfarenhet",
    "Servitör",
    "Bartender",
    "Diskare",
    "Runner",
    "Kock",
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesQuery =
      job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.restaurant_name.toLowerCase().includes(searchQuery.toLowerCase());

    const today = new Date().toISOString().split("T")[0];

    if (activeFilter === "Akut") return job.is_urgent && matchesQuery;
    if (activeFilter === "Ingen erfarenhet")
      return !job.requires_experience && matchesQuery;
    if (activeFilter === "Idag") return job.job_date === today && matchesQuery;
    if (activeFilter === "Dag")
      return (
        getShiftType(job.start_time, job.job_date) === "dag" && matchesQuery
      );
    if (activeFilter === "Kväll")
      return (
        getShiftType(job.start_time, job.job_date) === "kväll" && matchesQuery
      );
    if (activeFilter === "Helg")
      return (
        getShiftType(job.start_time, job.job_date) === "helg" && matchesQuery
      );
    if (activeFilter === "Servitör")
      return job.role === "Servitör" && matchesQuery;
    if (activeFilter === "Bartender")
      return job.role === "Bartender" && matchesQuery;
    if (activeFilter === "Diskare")
      return job.role === "Diskare" && matchesQuery;
    if (activeFilter === "Runner") return job.role === "Runner" && matchesQuery;
    if (activeFilter === "Kock") return job.role === "Kock" && matchesQuery;

    return matchesQuery;
  });

  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await getAllJobs();
        setJobs(data);

        if (user?.role === "worker") {
          const saved = await getSavedJobs();
          setSavedJobIds(new Set(saved.map((job) => job.job_id)));
        }
      } catch (error) {
        console.error("Kunde inte hämta pass", error);
        setError(
          "Vi kunde inte hämta passen just nu. Kontrollera din anslutning och försök igen.",
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, [user?.role]);

  async function handleSave(id: number) {
    try {
      await saveJob(id);
      setSavedJobIds((prev) => new Set(prev).add(id));
    } catch (error) {
      console.error("Kunde inte spara pass", error);
    }
  }

  async function handleUnsave(id: number) {
    try {
      await unsaveJob(id);
      setSavedJobIds((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    } catch (error) {
      console.error("Kunde inte ta bort sparat pass", error);
    }
  }

  //TODO: If logged in, POST to /api/jobs/:id/applications instead of redirecting to /login
  //TODO: Vad göra med jobb där datum är passerat?

  if (isLoading) return <LoadingSpinner subtitle="Hämtar lediga pass" />;
  if (error) return <ErrorMessage message={error} />;

  const visibleJobs = user ? filteredJobs : filteredJobs.slice(0, 8);

  return (
    <section className="jobs">
      <div className="section__inner">
        <header className="jobs__header">
          <h1 className="jobs__heading">Lediga pass</h1>
          {!user && (
            <p className="jobs__subheading">
              Visar {Math.min(8, filteredJobs.length)} av {filteredJobs.length}{" "}
              lediga pass. Logga in för att se alla.
            </p>
          )}
        </header>

        <div className="jobs__search">
          {/* <Search className="jobs__search-icon" size={16} aria-hidden="true" /> */}
          <input
            className="jobs__search-input"
            type="text"
            value={searchQuery}
            placeholder="Sök roll eller restaurang"
            onChange={(e) => setSearchQuery(e.target.value)}
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

        {visibleJobs.length === 0 ? (
          <div className="empty">
            <div className="empty__icon">
              <Search size={18} />
            </div>
            <div>
              <p className="empty__title">Inga pass hittades</p>
              <p className="empty__text">
                Prova ett annat filter eller sök på något annat.
              </p>
            </div>
          </div>
        ) : (
          <ul className="job-list">
            {visibleJobs.map((job) => {
              const jobIsSaved = savedJobIds.has(job.id);

              return (
                <li key={job.id} className="job-list__item">
                  <Link to={`/jobb/${job.id}`}>
                    <article className="job-card">
                      <div className="job-card__header">
                        <h2 className="job-card__role">
                          {getRoleLabel(job.role)}
                        </h2>
                        {user?.role === "worker" && (
                          <button
                            aria-label={
                              jobIsSaved ? "Ta bort från sparade" : "Spara pass"
                            }
                            className={`job-card__bookmark-btn ${jobIsSaved ? "job-card__bookmark-btn--saved" : ""}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (jobIsSaved) {
                                handleUnsave(job.id);
                              } else {
                                handleSave(job.id);
                              }
                            }}
                          >
                            <Bookmark size={20} aria-hidden="true" />
                          </button>
                        )}
                      </div>

                      <p className="job-card__restaurant">
                        {job.restaurant_name}
                      </p>

                      <div className="job-card__meta">
                        <div className="job-card__meta-item">
                          <Clock size={14} aria-hidden="true" />
                          <p className="job-card__meta-text">
                            {formatDate(job.job_date)} kl.{" "}
                            {formatTime(job.start_time)} -{" "}
                            {formatTime(job.end_time)}
                          </p>
                        </div>

                        <div className="job-card__meta-item">
                          <MapPin size={14} aria-hidden="true" />
                          <p className="job-card__meta-text">
                            {job.location ?? "Stad ej angiven"}
                          </p>
                        </div>

                        <div className="job-card__meta-item">
                          <Wallet size={14} aria-hidden="true" />
                          <p className="job-card__meta-text">
                            {formatCompensation(job.compensation)}
                          </p>
                        </div>

                        <div className="job-card__tags">
                          {job.is_urgent && (
                            <span className="badge badge--accent">Akut</span>
                          )}
                          {job.requires_experience && (
                            <span className="badge badge--accent">
                              Erfarenhet
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="job-card__footer-meta">
                        <p className="job-card__published">
                          Publicerat den {formatDate(job.created_at)}
                        </p>
                      </div>
                    </article>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default JobsPage;
