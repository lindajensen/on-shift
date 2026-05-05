import { useEffect, useState } from "react";
import { getAllWorkers } from "../api/employer";
import { Worker } from "../types";
import WorkerCard from "../components/WorkerCard";

import "../styles/FindWorkersPage.css";

function FindWorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkers() {
      try {
        const data = await getAllWorkers();
        setWorkers(data);

        console.log(data);
      } catch (error) {
        console.error("Kunde inte hämta personal", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkers();
  }, []);

  //TODO: Loading and error states
  //TODO: Empty state

  return (
    <section className="find-workers">
      <div className="section__inner">
        <header className="find-workers__header">
          <h1 className="find-workers__title">Hitta personal</h1>
        </header>

        {/* Filtering */}

        <ul className="find-workers__list">
          {workers.map((worker) => (
            <li key={worker.id} className="find-workers__item">
              <WorkerCard worker={worker} isAnonymous={false} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FindWorkersPage;
