import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getRoleLabel,
  getExperienceLevel,
  getStatusLabel,
} from "../utils/formatters";
import { EmployerApplicationDetail } from "../types";
import {
  MoreHorizontal,
  Star,
  User2,
  FileText,
  MessageCircle,
  ChefHat,
  Ban,
  ClipboardX,
} from "lucide-react";

import "../styles/ApplicationsSection.css";

interface ApplicationsSectionProps {
  applications: EmployerApplicationDetail[] | null;
  openMenuId: number | null;
  setOpenMenuId: (id: number | null) => void;
  onOpen: () => void;
}

function ApplicationsSection({
  applications,
  openMenuId,
  setOpenMenuId,
  onOpen,
}: ApplicationsSectionProps) {
  useEffect(() => {
    function handleClickOutside() {
      setOpenMenuId(null);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setOpenMenuId]);

  //TODO: CV button <a href={cv_url} target="_blank">
  //TODO: Anställ button
  //TODO: Message button
  //TODO: Decline button

  const applicationList = applications ?? [];

  return (
    <>
      <header className="applications-section__header">
        <h2 className="applications-section__title">Ansökningar</h2>
        <p className="applications-section__count">{applicationList.length}</p>
      </header>

      {applicationList.length == 0 ? (
        <div className="empty">
          <div className="empty__icon">
            <ClipboardX size={18} />
          </div>
          <div>
            <p className="empty__text">Du har inga ansökningar än.</p>
          </div>
        </div>
      ) : (
        <ul className="application-list">
          {applicationList.map((application) => (
            <li key={application.id} className="application-item">
              <article className="application-card">
                <div className="application-card__row">
                  <div className="application-card__info">
                    <div className="application-card__name-row">
                      <h3 className="application-card__name">
                        {application.worker_name}
                      </h3>

                      {application.rating && (
                        <div className="application-card__rating-container">
                          <Star className="rating-star" size={18} />
                          <span className="application-card__rating">
                            {application.rating.toFixed(1)}
                          </span>
                        </div>
                      )}

                      <button
                        className="application-card__more"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (openMenuId !== application.id) {
                            onOpen();
                          }
                          setOpenMenuId(
                            openMenuId === application.id
                              ? null
                              : application.id,
                          );
                        }}
                      >
                        <MoreHorizontal size={20} />
                      </button>
                    </div>

                    <p className="application-card__meta">
                      {getRoleLabel(application.role)} ·{" "}
                      {getExperienceLevel(application.experience_level)}
                    </p>
                  </div>
                </div>

                <div className="application-card__footer">
                  <span className={`badge badge--${application.status}`}>
                    {getStatusLabel(application.status)}
                  </span>
                </div>

                {/* Dropdown Menu */}
                {openMenuId === application.id && (
                  <div className="application-card__menu">
                    <ul className="application-card__menu-list">
                      <li className="application-card__menu-item">
                        <User2 size={16} />
                        <Link to="#" className="application-card__menu-btn">
                          Gå till profil
                        </Link>
                      </li>
                      <li className="application-card__menu-item">
                        <FileText size={16} />
                        <button className="application-card__menu-btn">
                          Visa CV
                        </button>
                      </li>
                      <li className="application-card__menu-item">
                        <MessageCircle size={16} />
                        <button className="application-card__menu-btn">
                          Skicka meddelande
                        </button>
                      </li>
                      <li className="application-card__menu-item">
                        <ChefHat size={16} />
                        <button className="application-card__menu-btn">
                          Anställ
                        </button>
                      </li>
                      <li className="application-card__menu-item application-card__menu-item--danger">
                        <Ban size={16} />
                        <button className="application-card__menu-btn application-card__menu-btn--danger">
                          Tacka nej
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default ApplicationsSection;
