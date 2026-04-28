import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmployerJobListing } from "../types";
import { formatDate, formatTime } from "../utils/date";
import { getJobStatusLabel } from "../utils/formatters";
import { capitalize } from "../utils/text";
import { Plus, Clock, Edit, Trash2 } from "lucide-react";

import "../styles/JobListingsPage.css";
import { getAllJobListings } from "../api/employerJobs";

function JobListingsPage() {
  const [employerJobListings, setEmployerJobListings] = useState<
    EmployerJobListing[]
  >([]);
  const [activeTab, setActiveTab] = useState<"aktiva" | "avslutade">("aktiva");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployerJobListings() {
      try {
        const data = await getAllJobListings();
        setEmployerJobListings(data);
      } catch (error) {
        console.error("Kunde inte hämta annonser", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEmployerJobListings();
  }, []);

  const activeListings = employerJobListings.filter(
    (job) => job.status === "active" || job.status === "filled",
  );
  const closedListings = employerJobListings.filter(
    (job) => job.status === "closed",
  );

  //TODO: Error handling
  //TODO: 3 and 5 are hard coded (tabs)
  //TODO: Implement action buttons

  return (
    <section className="job-listings-page">
      <div className="section__inner">
        <header className="job-listings-page__header">
          <h1 className="job-listings-page__title">Mina annonser</h1>
          <button className="btn btn--primary">
            <Plus size={18} />
            Ny annons
          </button>
        </header>

        <div className="job-listings-page__tabs">
          <button
            className={`job-listings-page__tab ${activeTab === "aktiva" ? "job-listings-page__tab--active" : ""}`}
            onClick={() => setActiveTab("aktiva")}
          >
            Aktiva ({activeListings.length})
          </button>
          <button
            className={`job-listings-page__tab ${activeTab === "avslutade" ? "job-listings-page__tab--active" : ""}`}
            onClick={() => setActiveTab("avslutade")}
          >
            Avslutade ({closedListings.length})
          </button>
        </div>

        {isLoading && (
          <ul className="job-listings-page__list">
            {[1, 2, 3].map((i) => (
              <li key={i} className="job-listings-page__item">
                <div className="job-listings-page__skeleton skeleton" />
              </li>
            ))}
          </ul>
        )}

        {!isLoading && activeTab === "aktiva" && (
          <ul className="job-listings-page__list">
            {activeListings.map((job) => (
              <li key={job.id} className="job-listings-page__item">
                <Link
                  to={`/annonser/${job.id}`}
                  className="job-listings-page__card-link"
                >
                  <article className="job-listings-page__card">
                    <header className="job-listings-page__card-header">
                      <div
                        className={`job-listings-page__card-indicator job-listings-page__card-indicator--${job.status}`}
                      ></div>
                      <p className="job-listings-page__card-status">
                        {getJobStatusLabel(job.status)}
                      </p>
                    </header>

                    <div className="job-listings-page__card-body">
                      <h2 className="job-listings-page__card-role">
                        {capitalize(job.role)}
                      </h2>
                      <p className="job-listings-page__card-rate">
                        {Number(job.compensation).toFixed(0)} kr/h
                      </p>
                    </div>

                    <div className="job-listings-page__card-meta">
                      <Clock size={14} />
                      <p className="job-listings-page__card-meta-text">
                        {formatDate(job.job_date)} kl.{" "}
                        {formatTime(job.start_time)} -{" "}
                        {formatTime(job.end_time)}
                      </p>
                    </div>

                    <div className="divider"></div>

                    <div className="job-listings-page__card-footer">
                      <span className="badge badge--accent">
                        {parseInt(job.application_count)}{" "}
                        {parseInt(job.application_count) === 1
                          ? "ansökning"
                          : "ansökningar"}
                      </span>

                      <div className="job-listings-page__card-actions">
                        <button className="job-listings-page__card-edit-btn">
                          <Edit size={20} />
                        </button>
                        <button className="job-listings-page__card-delete-btn">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {!isLoading && activeTab === "avslutade" && (
          <ul className="job-listings-page__list">
            {closedListings.map((job) => (
              <li key={job.id} className="job-listings-page__item">
                <Link
                  to={`/annonser/${job.id}`}
                  className="job-listings-page__card-link"
                >
                  <article className="job-listings-page__card">
                    <header className="job-listings-page__card-header">
                      <div
                        className={`job-listings-page__card-indicator job-listings-page__card-indicator--${job.status}`}
                      ></div>
                      <p className="job-listings-page__card-status">
                        {getJobStatusLabel(job.status)}
                      </p>
                    </header>

                    <div className="job-listings-page__card-body">
                      <h2 className="job-listings-page__card-role">
                        {capitalize(job.role)}
                      </h2>
                      <p className="job-listings-page__card-rate">
                        {Number(job.compensation).toFixed(0)} kr/h
                      </p>
                    </div>

                    <div className="job-listings-page__card-meta">
                      <Clock size={14} />
                      <p className="job-listings-page__card-meta-text">
                        {formatDate(job.job_date)} kl.{" "}
                        {formatTime(job.start_time)} -{" "}
                        {formatTime(job.end_time)}
                      </p>
                    </div>

                    <div className="divider"></div>

                    <div className="job-listings-page__card-footer">
                      <span className="badge badge--accent">
                        {parseInt(job.application_count)}{" "}
                        {parseInt(job.application_count) === 1
                          ? "ansökning"
                          : "ansökningar"}
                      </span>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default JobListingsPage;
