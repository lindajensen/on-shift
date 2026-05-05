import { useEffect, useState } from "react";
import { getRandomWorkers } from "../api/employer";
import { Worker } from "../types";
import WorkerCard from "./WorkerCard";

import "../styles/WorkerListings.css";

function WorkerListings() {
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    async function fetchRandomWorkers() {
      try {
        const data = await getRandomWorkers();
        setWorkers(data);

        console.log(data);
      } catch (error) {
        console.error("Kunde inte hämta personal", error);
      }
    }

    fetchRandomWorkers();
  }, []);

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
          {workers.map((worker) => (
            <li key={worker.id} className="find-workers__item">
              <WorkerCard worker={worker} isAnonymous={true} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default WorkerListings;
