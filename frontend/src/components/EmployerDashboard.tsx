import JobListingsPreview from "./JobListingsPreview";

import "../styles/Dashboard.css";

function EmployerDashboard() {
  return (
    <section className="dashboard">
      <div className="section__inner">
        <header className="dashboard__header">
          <h1 className="dashboard__title">Hej Restaurang Norrsken!</h1>
          <p className="dashboard__subtitle">Är du att hitta personal?</p>
        </header>

        {/* Stats */}

        <JobListingsPreview />
      </div>
    </section>
  );
}

export default EmployerDashboard;
