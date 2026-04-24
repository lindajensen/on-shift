import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecommendedJobs } from "../api/worker";
import { capitalize } from "../utils/text";
import { JobPreview } from "../types";
import { ChevronRight, Clock, MapPin } from "lucide-react";

import "../styles/RecommendedJobs.css";

function RecommendedJobs() {
  const [jobs, setJobs] = useState<JobPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //TODO: Apply button not yet implemented
  //TODO: Implement error state

  useEffect(() => {
    async function fetchRecommendedJobs() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 5000));

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
    <section className="recommended-jobs">
      <header className="recommended-jobs__header">
        <h2 className="recommended-jobs__title">Rekommenderade pass</h2>
        <Link className="recommended-jobs__link" to="/jobb">
          Visa alla
          <ChevronRight />
        </Link>
      </header>

      {isLoading && (
        <ul className="recommended-jobs__list">
          {[1, 2, 3].map((i) => (
            <li key={i} className="recommended-jobs__item">
              <div className="recommended-jobs__skeleton skeleton" />
            </li>
          ))}
        </ul>
      )}

      <ul className="recommended-jobs__list">
        {jobs.slice(0, 3).map((job) => (
          <li key={job.id} className="recommended-jobs__item">
            <article className="recommended-jobs__card">
              <h3 className="recommended-jobs__role">{capitalize(job.role)}</h3>
              <p className="recommended-jobs__employer">Restaurang Volt</p>

              <div className="recommended-jobs__meta">
                <Clock size={18} />
                <p className="recommended-jobs__meta-text">
                  Idag 17:00 - 22:00
                </p>
              </div>

              <div className="recommended-jobs__meta">
                <MapPin size={18} />
                <p className="recommended-jobs__meta-text">
                  Södermalm, Stockholm
                </p>
              </div>

              <footer className="recommended-jobs__card-footer">
                <p className="recommended-jobs__rate">185 kr/h</p>
                <button className="recommended-jobs__apply-btn">Ansök</button>
              </footer>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default RecommendedJobs;
