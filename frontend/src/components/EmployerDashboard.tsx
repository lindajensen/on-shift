import JobListingsPreview from "./JobListingsPreview";
import ApplicationsPreview from "./EmployerApplicationsPreview";
import SavedWorkersPreview from "./SavedWorkersPreview";

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
        <ApplicationsPreview />
        <SavedWorkersPreview />
      </div>
    </section>
  );
}

export default EmployerDashboard;
