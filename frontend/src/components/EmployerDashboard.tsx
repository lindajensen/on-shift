import JobListingsPreview from "./JobListingsPreview";
import EmployerApplicationsPreview from "./EmployerApplicationsPreview";
import SavedWorkersPreview from "./SavedWorkersPreview";
import LatestEmployerReview from "./LatestEmployerReview";

import "../styles/Dashboard.css";

function EmployerDashboard() {
  return (
    <section className="dashboard">
      <div className="section__inner">
        <header className="dashboard__header">
          <h1 className="dashboard__title">Hej Restaurang Norrsken!</h1>
          <p className="dashboard__subtitle">Är du att hitta personal?</p>
        </header>

        {/* STATCARDS? */}

        <JobListingsPreview />
        <EmployerApplicationsPreview />
        <SavedWorkersPreview />
        <LatestEmployerReview />
      </div>
    </section>
  );
}

export default EmployerDashboard;
