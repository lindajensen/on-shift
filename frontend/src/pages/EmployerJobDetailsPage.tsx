import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobDetails } from "../api/employerJobs";
import { getJobStatusLabel, getRoleLabel } from "../utils/formatters";
import { EmployerJobDetails } from "../types";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

import JobInfoSection from "../components/JobInfoSection";
import ApplicationsSection from "../components/ApplicationsSection";

import "../styles/EmployerJobDetailsPage.css";

function EmployerJobDetailsPage() {
  const [job, setJob] = useState<EmployerJobDetails | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    function handleClickOutside() {
      setIsMenuOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!id) return;
    const jobId = Number(id);

    async function fetchJobDetails() {
      try {
        const data = await getJobDetails(jobId);
        setJob(data);
      } catch (error) {
        console.error("Kunde inte hämta jobbinformation", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchJobDetails();
  }, [id]);

  if (!job) return;

  //TODO: Delete and Edit
  //TODO: Loading (skeleton) or spinner
  //TODO: Errorhandling
  //TODO: Accessibility
  //TODO: Desktop
  //TODO: Fix hover styling dropdown menu
  //? Calculate available_spots if people are hired?

  return (
    <section className="job-details-page">
      <div className="section__inner">
        <header className="job-details-page__header">
          <div className="job-details-page__status-row">
            <div
              className={`job-details-page__indicator job-details-page__indicator--${job.status}`}
            ></div>
            <p className="job-details-page__status">
              {getJobStatusLabel(job.status)}
            </p>
          </div>

          <div className="job-details-page__title-row">
            <h1 className="job-details-page__title">
              {getRoleLabel(job.role)}
            </h1>
            <button
              className="job-details-page__more-btn"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(null);
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <MoreHorizontal size={24} />
            </button>

            {/* Drop Down Menu */}
            {isMenuOpen && (
              <div className="job-details-page__menu">
                <button className="job-details-page__menu-btn">
                  <Edit size={16} />
                  Redigera
                </button>
                <button className="job-details-page__menu-btn job-details-page__menu-btn--danger">
                  <Trash2 size={16} />
                  Ta bort
                </button>
              </div>
            )}
          </div>

          <div className="job-card__tags">
            {job.is_urgent && <span className="badge badge--accent">Akut</span>}
            {job.requires_experience && (
              <span className="badge badge--accent">Erfarenhet</span>
            )}
          </div>
        </header>

        <div className="divider"></div>

        <JobInfoSection
          job_date={job.job_date}
          start_time={job.start_time}
          end_time={job.end_time}
          compensation={job.compensation}
          available_slots={job.available_slots}
          description={job.description}
          demands={job.demands}
          is_urgent={job.is_urgent}
          requires_experience={job.requires_experience}
        />

        <ApplicationsSection
          applications={job.applications}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          onOpen={() => setIsMenuOpen(false)}
        />
      </div>
    </section>
  );
}

export default EmployerJobDetailsPage;
