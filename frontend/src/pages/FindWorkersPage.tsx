import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import {
  getAllWorkers,
  getSavedWorkers,
  saveWorker,
  unsaveWorker,
} from "../api/employer";
import { Worker } from "../types";
import WorkerCard from "../components/WorkerCard";

import "../styles/FindWorkersPage.css";

function FindWorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [savedWorkerIds, setSavedWorkerIds] = useState<Set<number>>(new Set());

  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    async function fetchWorkers() {
      try {
        const data = await getAllWorkers();
        setWorkers(data);

        if (user?.role === "employer") {
          const saved = await getSavedWorkers();
          setSavedWorkerIds(new Set(saved.map((worker) => worker.id)));
        }
      } catch (error) {
        console.error("Kunde inte hämta personal", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkers();
  }, [user?.role]);

  async function handleSaveWorker(id: number) {
    try {
      await saveWorker(id);
      setSavedWorkerIds((prev) => new Set(prev).add(id));
    } catch (error) {
      console.error("Kunde inte spara pass", error);
    }
  }

  async function handleUnsaveWorker(id: number) {
    try {
      await unsaveWorker(id);
      setSavedWorkerIds((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    } catch (error) {
      console.error("Kunde inte ta bort sparat pass", error);
    }
  }

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
              <WorkerCard
                worker={worker}
                isAnonymous={false}
                onSave={() => handleSaveWorker(worker.id)}
                onUnsave={() => handleUnsaveWorker(worker.id)}
                isSaved={savedWorkerIds.has(worker.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FindWorkersPage;
