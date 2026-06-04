import { useEffect, useState } from "react";
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
  const [applicationToHire, setApplicationToHire] = useState<number | null>(
    null,
  );
  const [applicationToReject, setApplicationToReject] = useState<number | null>(
    null,
  );

  useEffect(() => {
    function handleClickOutside() {
      setOpenMenuId(null);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setOpenMenuId]);

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
                        aria-expanded={openMenuId === application.id}
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

                    {/* Message functionality is not yet implemented. Requires a messaging system with backend support. */}
                    <button className="application-card__menu-btn">
                      <MessageCircle size={16} aria-hidden="true" />
                      Skicka meddelande
                    </button>

                    <button
                      className="application-card__menu-btn"
                      disabled={application.status !== "pending"}
                      onClick={() => setApplicationToHire(application.id)}
                    >
                      <ChefHat size={16} aria-hidden="true" />
                      Anställ
                    </button>

                    <button
                      className="application-card__menu-btn application-card__menu-btn--danger"
                      disabled={application.status !== "pending"}
                      onClick={() => setApplicationToReject(application.id)}
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

      {applicationToHire && (
        <div
          className="confirm-overlay"
          onClick={() => setApplicationToHire(null)}
        >
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-dialog__heading">Anställ?</h3>
            <p className="confirm-dialog__subheading">
              Är du säker på att du vill anställa denna person?
            </p>
            <div className="confirm-buttons">
              <button
                className="btn confirm-button confirm-button--cancel"
                onClick={() => setApplicationToHire(null)}
              >
                Avbryt
              </button>
              <button
                className="btn confirm-button confirm-button--confirm"
                onClick={() => {
                  onHire(applicationToHire);
                  setApplicationToHire(null);
                }}
              >
                Anställ
              </button>
            </div>
          </div>
        </div>
      )}

      {applicationToReject && (
        <div
          className="confirm-overlay"
          onClick={() => setApplicationToReject(null)}
        >
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-dialog__heading">Tacka nej?</h3>
            <p className="confirm-dialog__subheading">
              Är du säker på att du vill tacka nej? Detta kan inte ångras.
            </p>
            <div className="confirm-buttons">
              <button
                className="btn confirm-button confirm-button--cancel"
                onClick={() => setApplicationToReject(null)}
              >
                Avbryt
              </button>
              <button
                className="btn confirm-button confirm-button--delete"
                onClick={() => {
                  onReject(applicationToReject);
                  setApplicationToReject(null);
                }}
              >
                Tacka nej
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ApplicationsSection;
