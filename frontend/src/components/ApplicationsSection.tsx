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
  onHire: (id: number) => void;
  onReject: (id: number) => void;
  onViewCV: (workerId: number) => void;
}

function ApplicationsSection({
  applications,
  openMenuId,
  setOpenMenuId,
  onOpen,
  onHire,
  onReject,
  onViewCV,
}: ApplicationsSectionProps) {
  useEffect(() => {
    function handleClickOutside() {
      setOpenMenuId(null);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setOpenMenuId]);

  //TODO: Message button

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
            <ClipboardX size={18} aria-hidden="true" />
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

                      <button
                        aria-label="Fler alternativ"
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
                        <MoreHorizontal size={20} aria-hidden="true" />
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
                    <Link
                      to={`/personal/${application.worker_id}`}
                      className="application-card__menu-btn"
                    >
                      <User2 size={16} aria-hidden="true" />
                      Gå till profil
                    </Link>
                    <button
                      className="application-card__menu-btn"
                      onClick={() => onViewCV(application.worker_id)}
                    >
                      <FileText size={16} aria-hidden="true" />
                      Visa CV
                    </button>
                    <button className="application-card__menu-btn">
                      <MessageCircle size={16} aria-hidden="true" />
                      Skicka meddelande
                    </button>
                    <button
                      className="application-card__menu-btn"
                      disabled={application.status !== "pending"}
                      onClick={() => onHire(application.id)}
                    >
                      <ChefHat size={16} aria-hidden="true" />
                      Anställ
                    </button>
                    <button
                      className="application-card__menu-btn application-card__menu-btn--danger"
                      disabled={application.status !== "pending"}
                      onClick={() => onReject(application.id)}
                    >
                      <Ban size={16} aria-hidden="true" />
                      Tacka nej
                    </button>
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
