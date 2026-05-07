import { useEffect, useState } from "react";
import { getSavedWorkers, unsaveWorker } from "../api/employer";
import { Worker } from "../types";
import WorkerCard from "../components/WorkerCard";
import ErrorMessage from "../components/ErrorMessage";
import { Bookmark } from "lucide-react";

import "../styles/SavedPage.css";

function SavedWorkersPage() {
  const [savedWorkers, setSavedWorkers] = useState<Worker[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSavedWorkers() {
      try {
        const data = await getSavedWorkers();
        setSavedWorkers(data);
      } catch (error) {
        console.error("Kunde inte hämta sparad personal", error);
        setError(
          "Vi kunde inte hämta din sparade personal. Kontrollera din anslutning och försök igen.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchSavedWorkers();
  }, []);

  async function handleUnsaveWorker(id: number) {
    try {
      await unsaveWorker(id);
      setSavedWorkers((prev) => prev.filter((worker) => worker.id !== id));
    } catch (error) {
      console.error("Kunde inte ta bort sparad personal", error);
    }
  }

  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="saved-page">
      <div className="section__inner">
        <header className="saved-page__header">
          <h1 className="saved-page__title">Sparad personal</h1>
        </header>

        {isLoading && (
          <ul className="preview__list">
            {[1, 2, 3].map((i) => (
              <li key={i} className="saved-page__item">
                <div className="saved-page__skeleton skeleton" />
              </li>
            ))}
          </ul>
        )}

        {!isLoading && !error && savedWorkers.length === 0 ? (
          <div className="empty">
            <div className="empty__icon">
              <Bookmark size={18} aria-hidden="true" />
            </div>
            <div className="empty__content">
              <p className="empty__title">Du har inte sparat någon personal</p>
              <p className="empty__text">
                Bläddra bland personalen och spara de som intresserar dig.
              </p>
            </div>
          </div>
        ) : (
          <ul className="saved-page__list">
            {savedWorkers.map((worker) => (
              <li key={worker.id}>
                <WorkerCard
                  worker={worker}
                  isAnonymous={false}
                  onUnsave={() => handleUnsaveWorker(worker.id)}
                  isSaved={true}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default SavedWorkersPage;
