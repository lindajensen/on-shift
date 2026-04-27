import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecommendedJobs } from "../api/worker";
import { capitalize } from "../utils/text";
import { formatDate, formatTime } from "../utils/date";
import { JobPreview } from "../types";
import { ChevronRight, Clock, MapPin } from "lucide-react";

import "../styles/CardList.css";

function RecommendedJobs() {
  const [jobs, setJobs] = useState<JobPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //TODO: Apply button not yet implemented
  //TODO: Implement error state

  useEffect(() => {
    async function fetchRecommendedJobs() {
      try {
        const data = await getRecommendedJobs();
        setJobs(data);
      } catch (error) {
        console.error("Kunde inte hämta rekommenderade jobb", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecommendedJobs();
  }, []);

  return (
    <section className="card-list">
      <header className="card-list__header">
        <h2 className="card-list__title">Rekommenderade pass</h2>
        <Link className="card-list__link" to="/jobb">
          Visa alla
          <ChevronRight />
        </Link>
      </header>

      {isLoading && (
        <ul className="card-list__list">
          {[1, 2, 3].map((i) => (
            <li key={i} className="card-list__item">
              <div className="card-list__skeleton skeleton" />
            </li>
          ))}
        </ul>
      )}

      {!isLoading && (
        <ul className="card-list__list">
          {jobs.slice(0, 3).map((job) => (
            <li key={job.id} className="card-list__item">
              <article className="card-list__card">
                <h3 className="card-list__role">{capitalize(job.role)}</h3>
                <p className="card-list__employer">{job.restaurant_name}</p>

                <div className="card-list__meta">
                  <Clock size={18} />
                  <p className="card-list__meta-text">
                    {formatDate(job.job_date)} kl. {formatTime(job.start_time)}{" "}
                    - {formatTime(job.end_time)}
                  </p>
                </div>

                <div className="card-list__meta">
                  <MapPin size={18} />
                  <p className="card-list__meta-text">{job.location}</p>
                </div>

                <footer className="card-list__card-footer">
                  <p className="card-list__rate">
                    {Number(job.compensation).toFixed(0)} kr/h
                  </p>
                  <button className="card-list__apply-btn">Ansök</button>
                </footer>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default RecommendedJobs;
