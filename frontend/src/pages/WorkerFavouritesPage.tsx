import { useEffect, useState } from "react";
import {
  getSavedEmployers,
  unsaveEmployer,
  getSavedJobs,
  unsaveJob,
} from "../api/worker";
import { SavedJob } from "../types";
import SavedJobsList from "../components/SavedJobsList";
import SavedEmployersList from "../components/SavedEmployersList";
import { SavedEmployer } from "../types";

import "../styles/WorkerFavouritesPage.css";

function WorkerFavouritesPage() {
  const [activeTab, setActiveTab] = useState<"jobs" | "employers">("jobs");
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [savedEmployers, setSavedEmployers] = useState<SavedEmployer[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFavourites() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        
        const [jobs, employers] = await Promise.all([
          getSavedJobs(),
          getSavedEmployers(),
        ]);
        setSavedJobs(jobs);
        setSavedEmployers(employers);
      } catch (error) {
        console.error("Kunde inte hämta favoriter", error);
        setError("Vi kunde inte hämta dina favoriter. Försök igen senare.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFavourites();
  }, []);

  async function handleUnsaveJob(id: number) {
    try {
      await unsaveJob(id);
      setSavedJobs((prev) => prev.filter((job) => job.job_id !== id));
    } catch (error) {
      console.error("Kunde inte ta bort sparat pass", error);
    }
  }

  async function handleUnsaveEmployer(id: number) {
    try {
      await unsaveEmployer(id);
      setSavedEmployers((prev) =>
        prev.filter((employer) => employer.id !== id),
      );
    } catch (error) {
      console.error("Kunde inte ta bort sparad restaurang", error);
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
            onUnsave={handleUnsaveJob}
          />
        ) : (
          <SavedEmployersList
            savedEmployers={savedEmployers}
            isLoading={isLoading}
            error={error}
            onUnsave={handleUnsaveEmployer}
          />
        )}
      </div>
    </section>
  );
}

export default WorkerFavouritesPage;
