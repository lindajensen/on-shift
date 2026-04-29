import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSavedWorkers } from "../api/employer";
import { getRoleLabel } from "../utils/formatters";
import { getExperienceLevel } from "../utils/formatters";
import { SavedWorkerPreview } from "../types";
import { ChevronRight, Star, Bookmark } from "lucide-react";

import "../styles/CardList.css";

function SavedWorkersPreview() {
  const [savedWorkers, setSavedWorkers] = useState<SavedWorkerPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //TODO: Error handling
  //TODO: Contact button not yet implemented
  //TODO: Fallback för om inga sparade arbetare
  //TODO: Availability not yet implemented
  //TODO: Make card clickable?

  useEffect(() => {
    async function fetchSavedWorkers() {
      try {
        const data = await getSavedWorkers();
        setSavedWorkers(data);
      } catch (error) {
        console.error("Kunde inte hämta sparad personal", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSavedWorkers();
  }, []);

  return (
    <section className="card-list">
      <header className="card-list__header">
        <h2 className="">Sparad personal</h2>
        <Link className="card-list__link" to="/sparad-personal">
          Visa alla
          <ChevronRight />
        </Link>
      </header>

      {isLoading && (
        <ul className="card-list__list">
          {[1, 2, 3].map((i) => (
            <li key={i} className="card-list__item">
              <div className="card-list__skeleton skeleton" />
            </li>
          ))}
        </ul>
      )}

      {savedWorkers.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">
            <Bookmark size={18} />
          </div>
          <div>
            <p className="empty-text">
              Du har ingen sparad personal än. Gå till "Hitta personal" för att
              börja lägga till favoriter.
            </p>
          </div>
        </div>
      ) : (
        <ul className="card-list__list">
          {savedWorkers.slice(0, 3).map((savedWorker) => (
            <li key={savedWorker.id} className="card-list__item">
              <article className="card-list__card">
                <div className="card-list__card-header">
                  <h3 className="card-list__role">{savedWorker.worker_name}</h3>
                  <div className="card-list__meta">
                    <Star className="rating-star" size={18} />
                    <p className="card-list__meta-text">4.9</p>
                  </div>
                </div>

                <ul className="card-list__role-list">
                  {savedWorker.roles.map((role, index) => (
                    <li key={index} className="card-list__role-item">
                      {" "}
                      {getRoleLabel(role.role)} |{" "}
                      {getExperienceLevel(role.experience_level)}
                    </li>
                  ))}
                </ul>

                {/* <div className="card-list__meta">
                <Clock size={18} />
                <p className="card-list__meta-text">Tillgänglig helger</p>
              </div> */}

                <button className="card-list__contact-btn">Kontakta</button>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default SavedWorkersPreview;
