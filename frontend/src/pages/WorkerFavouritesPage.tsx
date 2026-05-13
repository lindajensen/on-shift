import { useEffect, useState } from "react";
import { getSavedJobs, unsaveJob } from "../api/worker";
import { SavedJob } from "../types";
import SavedJobsList from "../components/SavedJobsList";
import SavedEmployersList from "../components/SavedEmployersList";

import "../styles/WorkerFavouritesPage.css";

function WorkerFavouritesPage() {
  const [activeTab, setActiveTab] = useState<"jobs" | "employers">("jobs");
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSavedJobs() {
      try {
        const data = await getSavedJobs();
        setSavedJobs(data);
      } catch (error) {
        console.error("Kunde inte hämta sparade pass", error);
        setError(
          "Vi kunde inte hämta dina sparade pass. Kontrollera din anslutning och försök igen.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchSavedJobs();
  }, []);

  async function handleUnsave(id: number) {
    try {
      await unsaveJob(id);
      setSavedJobs((prev) => prev.filter((job) => job.job_id !== id));
    } catch (error) {
      console.error("Kunde inte ta bort sparat pass", error);
    }
  }

  return (
    <section className="favourites-page">
      <div className="section__inner">
        <header className="favourites-page__header">
          <h1 className="favourites-page__title">Favoriter</h1>
        </header>

        <div className="favourites-page__tabs">
          <button
            className={`favourites-page__tab ${activeTab === "jobs" ? "favourites-page__tab--active" : ""}`}
            onClick={() => setActiveTab("jobs")}
          >
            Pass
          </button>
          <button
            className={`favourites-page__tab ${activeTab === "employers" ? "favourites-page__tab--active" : ""}`}
            onClick={() => setActiveTab("employers")}
          >
            Restauranger
          </button>
        </div>

        {activeTab === "jobs" ? (
          <SavedJobsList
            savedJobs={savedJobs}
            isLoading={isLoading}
            error={error}
            onUnsave={handleUnsave}
          />
        ) : (
          <SavedEmployersList />
        )}
      </div>
    </section>
  );
}

export default WorkerFavouritesPage;
