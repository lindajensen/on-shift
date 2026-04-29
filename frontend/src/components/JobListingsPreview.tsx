import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJobListings } from "../api/employerJobs";
import { getRoleLabel } from "../utils/formatters";
import { formatDate, formatTime } from "../utils/date";
import { EmployerJobListing } from "../types";
import { ChevronRight } from "lucide-react";

import "../styles/Preview.css";

function JobListingsPreview() {
  const [jobListings, setJobListings] = useState<EmployerJobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchJobListings() {
      try {
        const data = await getAllJobListings();
        setJobListings(data);
      } catch (error) {
        console.error("Kunde inte hämta annonser", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobListings();
  }, []);

  //TODO: Switch useState isLoading to true
  //TODO: Check skeleton in applicationslist
  //TODO: Implement error state
  //TODO: Items clickable link to detailspage?

  return (
    <section className="preview">
      <header className="preview__header">
        <h2 className="preview__title">Mina annonser</h2>
        <Link className="preview__link" to="/ansokningar">
          Visa alla
          <ChevronRight />
        </Link>
      </header>

      {isLoading && (
        <div className="preview-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="preview-skeleton skeleton" />
          ))}
        </div>
      )}

      {!isLoading && (
        <ul className="preview__list">
          {jobListings.slice(0, 3).map((jobListing) => (
            <li key={jobListing.id} className="preview__item">
              <article className="preview__card">
                <div className="preview__info">
                  <h3 className="preview__name">
                    {getRoleLabel(jobListing.role)}
                  </h3>
                  <p className="preview__meta">
                    {formatDate(jobListing.job_date)} kl.{" "}
                    {formatTime(jobListing.start_time)} -{" "}
                    {formatTime(jobListing.end_time)}
                  </p>
                </div>

                <div className="preview__status">
                  <p className="preview__status-count">
                    {jobListing.application_count}
                  </p>
                  <p className="preview__status-label">
                    {parseInt(jobListing.application_count) === 1
                      ? "ansökning"
                      : "ansökningar"}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default JobListingsPreview;
