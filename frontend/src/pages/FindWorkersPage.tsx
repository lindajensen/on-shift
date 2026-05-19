import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import {
  getAllWorkers,
  getSavedWorkers,
  saveWorker,
  unsaveWorker,
} from "../api/employer";
import { getRoleLabel } from "../utils/formatters";
import { Worker } from "../types";
import WorkerCard from "../components/WorkerCard";
import ErrorMessage from "../components/ErrorMessage";
import { Search } from "lucide-react";

import "../styles/FindWorkersPage.css";

function FindWorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [savedWorkerIds, setSavedWorkerIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Alla");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const filters = [
    "Alla",
    "Tillgänglig idag",
    "Servitör",
    "Bartender",
    "Diskare",
    "Runner",
    "Kock",
    "Morgon",
    "Dag",
    "Kväll",
    "Helger",
    "Vardagar",
  ];

  const filteredWorkers = workers.filter((worker) => {
    const matchesQuery =
      worker.roles.some((workerRole) =>
        getRoleLabel(workerRole.role)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ) || worker.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "Servitör")
      return (
        worker.roles.some((workerRole) => workerRole.role === "waiter") &&
        matchesQuery
      );
    if (activeFilter === "Bartender")
      return (
        worker.roles.some((workerRole) => workerRole.role === "bartender") &&
        matchesQuery
      );
    if (activeFilter === "Diskare")
      return (
        worker.roles.some((workerRole) => workerRole.role === "dishwasher") &&
        matchesQuery
      );
    if (activeFilter === "Runner")
      return (
        worker.roles.some((workerRole) => workerRole.role === "runner") &&
        matchesQuery
      );
    if (activeFilter === "Kock")
      return (
        worker.roles.some((workerRole) => workerRole.role === "chef") &&
        matchesQuery
      );

    if (activeFilter === "Tillgänglig idag") {
      const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const today = days[new Date().getDay()];
      return (
        worker.availability?.some((entry) => entry.day_of_week === today) &&
        matchesQuery
      );
    }

    if (activeFilter === "Morgon")
      return (
        worker.availability?.some((entry) => entry.start_time < "12:00:00") &&
        matchesQuery
      );

    if (activeFilter === "Dag")
      return (
        worker.availability?.some(
          (entry) =>
            entry.start_time >= "12:00:00" && entry.start_time < "17:00:00",
        ) && matchesQuery
      );

    if (activeFilter === "Kväll")
      return (
        worker.availability?.some((entry) => entry.start_time >= "17:00:00") &&
        matchesQuery
      );

    if (activeFilter === "Helger")
      return (
        worker.availability?.some(
          (entry) =>
            entry.day_of_week === "saturday" || entry.day_of_week === "sunday",
        ) && matchesQuery
      );

    if (activeFilter === "Vardagar")
      return (
        worker.availability?.some((entry) =>
          ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(
            entry.day_of_week,
          ),
        ) && matchesQuery
      );

    return matchesQuery;
  });

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
        setError("Ingen personal hittades");
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

  if (isLoading) {
    return (
      <section className="find-workers">
        <div className="section__inner">
          <ul className="find-workers__list-skeleton">
            {[1, 2, 3].map((i) => (
              <li key={i} className="find-workers__item">
                <div className="find-workers__skeleton skeleton" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="find-workers">
      <div className="section__inner">
        <header className="find-workers__header">
          <h1 className="find-workers__title">Hitta personal</h1>
        </header>

        <div className="find-workers__search">
          <input
            className="find-workers__search-input"
            type="text"
            value={searchQuery}
            placeholder="Sök namn eller roll"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="jobs__filters">
          {filters.map((filter) => (
            <button
              className={`jobs__filter-btn ${activeFilter === filter ? "jobs__filter-btn--active" : ""}`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {filteredWorkers.length === 0 ? (
          <div className="empty">
            <div className="empty__icon">
              <Search size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="empty__title">Ingen personal hittades</p>
              <p className="empty__text">
                Prova ett annat filter eller sök på något annat.
              </p>
            </div>
          </div>
        ) : (
          <ul className="find-workers__list">
            {filteredWorkers.map((worker) => (
              <li key={worker.id} className="find-workers__item">
                <WorkerCard
                  worker={worker}
                  isAnonymous={false}
                  showBookmark={true}
                  onSave={() => handleSaveWorker(worker.id)}
                  onUnsave={() => handleUnsaveWorker(worker.id)}
                  isSaved={savedWorkerIds.has(worker.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default FindWorkersPage;
