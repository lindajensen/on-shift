import WorkerCard from "./WorkerCard";
import "../styles/WorkerListings.css";

function WorkerListings() {
  //TODO: Fetch from database and only show 3-4 random workers

  return (
    <section className="worker-listings">
      <div className="section__inner">
        <header className="worker-listings__header">
          <h2 className="worker-listings__title">
            Tillgänglig personal just nu
          </h2>
          <p className="worker-listings__subtitle">
            Logga in för att se vem som är redo att ta ett pass
          </p>
        </header>

        <ul className="worker-list">
          <li className="worker-list__item">
            <WorkerCard isAnonymous={true} />
          </li>
        </ul>
      </div>
    </section>
  );
}

export default WorkerListings;
