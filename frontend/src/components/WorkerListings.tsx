import WorkerCard from "./WorkerCard";
import "../styles/WorkerListings.css";

function WorkerListings() {
  //TODO: Fetch from database and only show 3-4 random workers

  return (
    <section className="worker-listings">
      <header className="worker-listings__header">
        <h2 className="worker-listings__title">Tillgänglig personal just nu</h2>
        <p className="worker-listings__subtitle">
          Logga in för att se vem som är redo att ta ett pass
        </p>
      </header>

      <WorkerCard isAnonymous={true} />
    </section>
  );
}

export default WorkerListings;
