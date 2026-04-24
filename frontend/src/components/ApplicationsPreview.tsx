import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllApplications } from "../api/applications";
import { formatDate, formatTime } from "../utils/date";
import { getStatusLabel } from "../utils/formatters";
import { ApplicationPreview } from "../types";
import { ChevronRight } from "lucide-react";

// import ErrorMessage from "./ErrorMessage";

import "../styles/ApplicationsPreview.css";

function ApplicationsPreview() {
  const [applications, setApplications] = useState<ApplicationPreview[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const data = await getAllApplications();
        setApplications(data);

        console.log(data);
      } catch (error) {
        console.error("Kunde inte hämta ansökningar", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApplications();
  }, []);

  return (
    <section className="applications-preview">
      <header className="applications-preview__header">
        <h2 className="applications-preview__title">Mina ansökningar</h2>
        <Link className="applications-preview__link" to="/ansokningar">
          Visa alla
          <ChevronRight />
        </Link>
      </header>

      {isLoading && (
        <div className="applications-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="application-skeleton" />
          ))}
        </div>
      )}

      {!isLoading && (
        <ul className="applications-preview__list">
          {applications.slice(0, 3).map((application) => (
            <li className="applications-preview__item">
              <article className="applications-preview__card">
                {/* <div className="applications-preview__avatar">RV</div> */}
                <div className="applications-preview__info">
                  <h3 className="applications-preview__name">
                    {application.restaurant_name}
                  </h3>
                  <p className="applications-preview__meta">
                    {application.role} · {formatDate(application.job_date)} kl.{" "}
                    {formatTime(application.start_time)} -{" "}
                    {formatTime(application.end_time)}
                  </p>
                </div>

                <div className="applications-preview__status">
                  <span
                    className={`badge badge--${application.status === "pending" ? "pending" : application.status === "hired" ? "hired" : "rejected"}`}
                  >
                    {getStatusLabel(application.status)}
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ApplicationsPreview;
