import { SavedEmployer } from "../types";
import RestaurantCard from "./RestaurantCard";
import ErrorMessage from "./ErrorMessage";
import { Bookmark } from "lucide-react";

interface SavedEmployersListProps {
  savedEmployers: SavedEmployer[];
  isLoading: boolean;
  error: string | null;
  onUnsave: (id: number) => void;
}

function SavedEmployersList({
  savedEmployers,
  isLoading,
  error,
  onUnsave,
}: SavedEmployersListProps) {
  if (isLoading) {
    return (
      <section className="saved-page__inner">
        <ul className="preview__list">
          {[1, 2, 3].map((i) => (
            <li key={i} className="saved-page__item">
              <div className="saved-page__skeleton saved-page__skeleton--small skeleton" />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (error) return <ErrorMessage message={error} />;

  if (savedEmployers.length === 0) {
    return (
      <section className="saved-page__inner">
        <div className="empty">
          <div className="empty__icon">
            <Bookmark size={18} aria-hidden="true" />
          </div>
          <div className="empty__content">
            <p className="empty__title">Inga sparade restauranger</p>
            <p className="empty__text">
              Besök en restaurangprofil och tryck på bokmärket för att spara
              den.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="saved-page__inner">
      <ul className="saved-page__list">
        {savedEmployers.map((employer) => (
          <li key={employer.id} className="saved-page__item">
            <RestaurantCard
              name={employer.name}
              location={employer.city ?? "Plats ej angiven"}
              rating={employer.rating ? Number(employer.rating) : null}
              employerId={employer.id}
              onUnsave={() => onUnsave(employer.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SavedEmployersList;
