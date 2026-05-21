import { useEffect, useState } from "react";

import AvailabilityToggle from "./AvailabilityToggle";
import WorkerApplicationsPreview from "./WorkerApplicationsPreview";
import RecommendedJobs from "./RecommendedJobs";
import LatestReview from "./LatestWorkerReview";

import { getWorkerProfileByUserId } from "../api/worker";
import { WorkerProfile } from "../types";

import "../styles/Dashboard.css";

function WorkerDashboard() {
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(
    null,
  );

  const [error, setError] = useState(false);

  const firstName = workerProfile?.name.split(" ")[0];

  useEffect(() => {
    async function fetchWorkerProfile() {
      try {
        const data = await getWorkerProfileByUserId();
        setWorkerProfile(data);
      } catch (error) {
        console.error("Kunde inte hämta profil", error);
        setError(true);
      }
    }

    fetchWorkerProfile();
  }, []);

  if (error) return null;
  if (!workerProfile) return;

  return (
    <section className="dashboard">
      <div className="section__inner">
        <header className="dashboard__header">
          <h1 className="dashboard__title">Hej {firstName}!</h1>
          <p className="dashboard__subtitle">Är du redo för nya pass?</p>
        </header>

        <AvailabilityToggle />

        {/* STATCARDS? */}

        <WorkerApplicationsPreview />
        <RecommendedJobs />
        <LatestReview />
      </div>
    </section>
  );
}

export default WorkerDashboard;
