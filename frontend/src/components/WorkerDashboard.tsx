import { useEffect, useState } from "react";

import AvailabilityToggle from "./AvailabilityToggle";
import ApplicationsList from "./ApplicationsPreview";
import RecommendedJobs from "./RecommendedJobs";
import LatestReview from "./LatestReview";

import { getWorkerProfile } from "../api/worker";
import { WorkerProfile } from "../types";

function WorkerDashboard() {
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkerProfile() {
      try {
        const data = await getWorkerProfile();
        setWorkerProfile(data);
      } catch (error) {
        console.error("Kunde inte hämta profil", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkerProfile();
  }, []);

  //TODO: Error handling

  if (!workerProfile) return;

  return (
    <section className="worker-dashboard">
      <div className="section__inner">
        <header className="worker-dashboard__header">
          <h1 className="worker-dashboard__title">Hej {workerProfile.name}!</h1>
          <p className="worker-dashboard__subtitle">Är du redo för nya pass?</p>
        </header>

        <AvailabilityToggle />

        {/* STATCARDS? */}

        <ApplicationsList />
        <RecommendedJobs />
        <LatestReview />
      </div>
    </section>
  );
}

export default WorkerDashboard;
