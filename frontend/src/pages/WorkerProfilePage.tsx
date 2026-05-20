import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import {
  getWorkerProfileById,
  getWorkerProfileByUserId,
  updateWorkerContact,
  updateWorkerBio,
  updateWorkerExperience,
  updateWorkerEducation,
  updateWorkerRoles,
  updateWorkerAvailability,
  uploadCV,
  getCVUrl,
  deleteCV,
} from "../api/worker";

import { saveWorker, unsaveWorker, getSavedWorkers } from "../api/employer";

import {
  getRoleLabel,
  getExperienceLevel,
  getDayLabel,
  formatFilename,
} from "../utils/formatters";
import { formatTime, formatDateWithYear } from "../utils/date";

import {
  WorkerAboutFormData,
  WorkerContactFormData,
  WorkerExperience,
  WorkerEducation,
  WorkerRole,
  WorkerProfile,
  WorkerAvailabilityFormData,
} from "../types";

import ProfileHeader from "../components/ProfileHeader";
import AvailabilityToggle from "../components/AvailabilityToggle";
import Modal from "../components/modals/Modal";
import EditWorkerContactModal from "../components/modals/EditWorkerContactModal";
import EditWorkerAboutModal from "../components/modals/EditWorkerAboutModal";
import EditWorkerExperienceModal from "../components/modals/EditWorkerExperienceModal";
import EditWorkerEducationModal from "../components/modals/EditWorkerEducationModal";
import EditWorkerRolesModal from "../components/modals/EditWorkerRolesModal";
import EditWorkerAvailabilityModal from "../components/modals/EditWorkerAvailabilityModal";
import WorkerReviewsPreview from "../components/WorkerReviewsPreview";
import ErrorMessage from "../components/ErrorMessage";

import {
  Edit,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  ExternalLink,
  Upload,
  Trash2,
} from "lucide-react";

import "../styles/ProfilePage.css";

function WorkerProfilePage() {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);
  const [isEditAboutModalOpen, setIsEditAboutModalOpen] = useState(false);
  const [isEditExperienceModalOpen, setIsEditExperienceModalOpen] =
    useState(false);
  const [isEditEducationModalOpen, setIsEditEducationModalOpen] =
    useState(false);
  const [isEditRolesModalOpen, setIsEditRolesModalOpen] = useState(false);
  const [isEditAvailabilityModalOpen, setIsEditAvailabilityModalOpen] =
    useState(false);
  const [showDeleteCVConfirm, setShowDeleteCVConfirm] = useState(false);

  const [isSaved, setIsSaved] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();
  const { user } = useAuth();

  const isOwner = user?.id === profile?.user_id;
  const profileId = id ?? user?.id;

  useEffect(() => {
    if (!profileId) return;

    async function fetchWorkerProfile() {
      try {
        const data = id
          ? await getWorkerProfileById(Number(id))
          : await getWorkerProfileByUserId();

        setProfile({
          ...data,
          experience: data.experience ?? [],
          education: data.education ?? [],
          roles: data.roles ?? [],
          availability: data.availability ?? [],
        });

        if (user?.role === "employer") {
          const savedWorkers = await getSavedWorkers();
          setIsSaved(savedWorkers.some((worker) => worker.id === data.id));
        }

        console.log(data);
      } catch (error) {
        console.error("Kunde inte hämta profil", error);
        setError("Vi kunde inte hämta profilen. Försök igen senare.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkerProfile();
  }, [profileId, id, user]);

  async function handleSave(id: number) {
    try {
      await saveWorker(id);
      setIsSaved(true);
    } catch (error) {
      console.error("Kunde inte spara personal", error);
    }
  }

  async function handleUnsave(id: number) {
    try {
      await unsaveWorker(id);
      setIsSaved(false);
    } catch (error) {
      console.error("Kunde inte ta bort sparad personal", error);
    }
  }

  // function handleLogout() {
  //   logout();
  //   navigate("/");
  // }

  async function handleSaveContact(contactData: WorkerContactFormData) {
    try {
      await updateWorkerContact(contactData);

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              ...contactData,
              phone: contactData.phone || null,
              email: contactData.email || null,
              city: contactData.city || null,
            }
          : prev,
      );

      setIsEditContactModalOpen(false);
    } catch (error) {
      console.error("Kunde inte spara kontaktinformationen", error);
    }
  }

  async function handleSaveAbout(aboutData: WorkerAboutFormData) {
    try {
      await updateWorkerBio(aboutData);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              bio: aboutData.bio || null,
            }
          : prev,
      );
      setIsEditAboutModalOpen(false);
    } catch (error) {
      console.error("Kunde inte spara beskrivning", error);
    }
  }

  async function handleSaveExperience(experienceData: WorkerExperience[]) {
    try {
      await updateWorkerExperience(experienceData);

      setProfile((prev) =>
        prev ? { ...prev, experience: experienceData } : prev,
      );

      setIsEditExperienceModalOpen(false);
    } catch (error) {
      console.error("Kunde inte spara erfarenhet", error);
    }
  }

  async function handleSaveEducation(educationData: WorkerEducation[]) {
    try {
      await updateWorkerEducation(educationData);

      setProfile((prev) =>
        prev ? { ...prev, education: educationData } : prev,
      );

      setIsEditEducationModalOpen(false);
    } catch (error) {
      console.error("Kunde inte spara erfarenhet", error);
    }
  }

  async function handleSaveRoles(rolesData: WorkerRole[]) {
    try {
      await updateWorkerRoles(rolesData);

      setProfile((prev) => (prev ? { ...prev, roles: rolesData } : prev));

      setIsEditRolesModalOpen(false);
    } catch (error) {
      console.error("Kunde inte spara roller", error);
    }
  }

  async function handleSaveAvailability(
    availabilityData: WorkerAvailabilityFormData,
  ) {
    try {
      await updateWorkerAvailability(availabilityData);

      setProfile((prev) =>
        prev ? { ...prev, availability: availabilityData.availability } : prev,
      );

      setIsEditAvailabilityModalOpen(false);
    } catch (error) {
      console.error("Kunde inte spara tillgänglighet", error);
    }
  }

  async function handleUploadCV(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const data = await uploadCV(file);

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              cv_url: data.cv_url,
              cv_filename: data.cv_filename,
              cv_uploaded_at: new Date().toISOString(),
            }
          : prev,
      );
    } catch (error) {
      console.error("Kunde inte ladda upp CV", error);
    }
  }

  async function handleViewCV() {
    try {
      const url = await getCVUrl();

      window.open(url, "_blank");
    } catch (error) {
      console.error("Kunde inte öppna CV", error);
    }
  }

  async function handleDeleteCV() {
    try {
      await deleteCV();

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              cv_url: null,
              cv_filename: null,
              cv_uploaded_at: null,
            }
          : prev,
      );
    } catch (error) {
      console.error("Kunde inte radera CV", error);
    }
  }

  if (isLoading) {
    return (
      <section className="profile">
        <div className="section__inner">
          <div className="profile__skeleton skeleton" />
          <div className="profile__skeleton skeleton" />
          <div className="profile__skeleton skeleton" />
        </div>
      </section>
    );
  }

  if (error) return <ErrorMessage message={error} />;
  if (!profile) return null;

  //TODO: Confirmdialog for deleting cv?

  return (
    <>
      <section className="profile">
        <div className="section__inner">
          <ProfileHeader
            name={profile.name}
            rating={profile.rating}
            isOwner={isOwner}
            isSaved={isSaved}
            onSave={() => handleSave(profile.id)}
            onUnsave={() => handleUnsave(profile.id)}
          />

          <div className="divider"></div>

          {isOwner && <AvailabilityToggle />}

          <section className="contact-info">
            <header className="contact-info__header">
              <h2 className="contact-info__title">Kontaktinformation</h2>
              {isOwner && (
                <button
                  aria-label="Redigera kontaktinformation"
                  className="contact-info__edit-btn"
                  onClick={() => setIsEditContactModalOpen(true)}
                >
                  <Edit size={16} aria-hidden="true" />
                </button>
              )}
            </header>

            <ul className="contact-info__list">
              <li className="contact-info__item">
                <div className="contact-info__icon-container">
                  <Mail size={18} aria-hidden="true" />
                </div>
                <div className="contact-info__item-content">
                  <p className="contact-info__label">E-post</p>
                  <p
                    className={`contact-info__value ${!profile.email ? "empty-text" : ""}`}
                  >
                    {profile.email ?? "Ingen e-post angiven"}
                  </p>
                </div>
              </li>

              <li className="contact-info__item">
                <div className="contact-info__icon-container">
                  <Phone size={18} aria-hidden="true" />
                </div>
                <div className="contact-info__item-content">
                  <p className="contact-info__label">Telefon</p>
                  <p
                    className={`contact-info__value ${!profile.phone ? "empty-text" : ""}`}
                  >
                    {profile.phone ?? "Inget telefonnummer angivet"}
                  </p>
                </div>
              </li>

              <li className="contact-info__item">
                <div className="contact-info__icon-container">
                  <MapPin size={18} aria-hidden="true" />
                </div>
                <div className="contact-info__item-content">
                  <p className="contact-info__label">Stad</p>
                  <p
                    className={`contact-info__value ${!profile.city ? "empty-text" : ""}`}
                  >
                    {profile.city ?? "Ingen stad angiven"}
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <div className="divider"></div>

          <section className="about">
            <header className="about__header">
              <h2 className="about__title">Om mig</h2>
              {isOwner && (
                <button
                  aria-label="Redigera restaurangbeskrivning"
                  className="about__edit-btn"
                  onClick={() => setIsEditAboutModalOpen(true)}
                >
                  <Edit size={16} aria-hidden="true" />
                </button>
              )}
            </header>

            <p className={`about__text ${!profile.bio ? "empty-text" : ""}`}>
              {profile.bio ?? "Ingen beskrivning angiven"}
            </p>
          </section>

          <div className="divider"></div>

          <section className="experience">
            <header className="experience__header">
              <h2 className="experience__title">Erfarenhet</h2>
              {isOwner && (
                <button
                  aria-label="Redigera erfarenhet"
                  className="experience__edit-btn"
                  onClick={() => setIsEditExperienceModalOpen(true)}
                >
                  <Edit size={16} aria-hidden="true" />
                </button>
              )}
            </header>

            {profile.experience.length === 0 ? (
              <p className="empty-text">Ingen erfarenhet tillagd än</p>
            ) : (
              <ul className="timeline">
                {profile.experience.map((experience) => (
                  <li key={experience.id} className="timeline__item">
                    <div className="timeline__dot" />
                    <div className="timeline__content">
                      <div className="timeline__title-row">
                        <p className="timeline__title">
                          {experience.job_title}
                        </p>
                        <span className="timeline__date">
                          {experience.start_date} -{" "}
                          {experience.end_date === null
                            ? "pågående"
                            : experience.end_date}
                        </span>
                      </div>
                      <p className="timeline__subtitle">
                        {experience.workplace}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="divider"></div>

          <section className="education">
            <header className="education__header">
              <h2 className="education__title">Utbildning</h2>
              {isOwner && (
                <button
                  aria-label="Redigera utbildning"
                  className="education__edit-btn"
                  onClick={() => setIsEditEducationModalOpen(true)}
                >
                  <Edit size={16} aria-hidden="true" />
                </button>
              )}
            </header>

            {profile.education.length === 0 ? (
              <p className="empty-text">Ingen utbildning tillagd än</p>
            ) : (
              <ul className="education__list">
                {profile.education.map((education) => (
                  <li key={education.id} className="education__item">
                    <div className="education__icon-container">
                      <GraduationCap
                        size={18}
                        aria-hidden="true"
                        className="education__icon"
                      />
                    </div>
                    <div className="education__content">
                      <p className="education__name">{education.program}</p>
                      <p className="education__meta">
                        {education.school} ·{" "}
                        {education.graduation_year === null
                          ? "Pågående"
                          : education.graduation_year}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="divider"></div>

          <section className="roles">
            <header className="roles__header">
              <h2 className="roles__title">Roller</h2>
              {isOwner && (
                <button
                  aria-label="Redigera roller"
                  className="education__edit-btn"
                  onClick={() => setIsEditRolesModalOpen(true)}
                >
                  <Edit size={16} aria-hidden="true" />
                </button>
              )}
            </header>

            {profile.roles.length === 0 ? (
              <p className="empty-text">Inga roller tillagda än</p>
            ) : (
              <ul className="roles-info__list">
                {profile.roles.map((role) => (
                  <li
                    key={role.role}
                    className="roles-info__item badge badge--accent"
                  >
                    {getRoleLabel(role.role)} ·{" "}
                    {getExperienceLevel(role.experience_level)}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="divider"></div>

          <section className="availability">
            <header className="availability__header">
              <h2 className="availability__title">Tillgänglighet</h2>

              {isOwner && (
                <button
                  aria-label="Redigera tillgänglighet"
                  className="availability__edit-btn"
                  onClick={() => setIsEditAvailabilityModalOpen(true)}
                >
                  <Edit size={16} aria-hidden="true" />
                </button>
              )}
            </header>

            <ul className="availability__list">
              {[
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ].map((day) => {
                const entry = profile.availability?.find(
                  (a) => a.day_of_week === day,
                );
                return (
                  <li key={day} className="availability__item">
                    <span className="availability__day">
                      {getDayLabel(day)}
                    </span>
                    {entry ? (
                      <span className="availability__time">
                        {formatTime(entry.start_time)} -{" "}
                        {formatTime(entry.end_time)}
                      </span>
                    ) : (
                      <span className="availability__time availability__time--unavailable">
                        Inte tillgänglig
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="divider"></div>

          <section className="cv">
            <header className="cv__header">
              <h2 className="cv__title">CV</h2>
            </header>

            <div className="cv__card">
              {profile.cv_url ? (
                <div className="cv__content">
                  <div className="cv__info">
                    <p className="cv__filename">
                      {profile.cv_filename
                        ? formatFilename(profile.cv_filename)
                        : ""}
                    </p>
                    <p className="cv__date">
                      {profile.cv_uploaded_at
                        ? `Uppladdad ${formatDateWithYear(profile.cv_uploaded_at)}`
                        : ""}
                    </p>
                  </div>

                  <div className="cv__actions">
                    {isOwner && (
                      <>
                        <input
                          id="cv-replace"
                          type="file"
                          accept=".pdf"
                          className="cv__file-input"
                          onChange={handleUploadCV}
                        />
                        <label htmlFor="cv-replace" className="cv__replace-btn">
                          <Upload size={16} aria-hidden="true" />
                        </label>
                      </>
                    )}
                    <button
                      aria-label="Visa CV"
                      className="cv__view-btn"
                      onClick={handleViewCV}
                    >
                      <ExternalLink size={16} aria-hidden="true" />
                    </button>
                    {isOwner && (
                      <button
                        aria-label="Ta bort CV"
                        className="cv__delete-btn"
                        onClick={() => setShowDeleteCVConfirm(true)}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              ) : isOwner ? (
                <div className="cv__empty">
                  <p className="cv__empty-text">Inget CV uppladdat än</p>
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf"
                    className="cv__file-input"
                    onChange={handleUploadCV}
                  />
                  <label htmlFor="cv-upload" className="cv__upload-btn">
                    Ladda upp
                  </label>
                </div>
              ) : (
                <p className="empty-text">Inget CV uppladdat än</p>
              )}
            </div>
          </section>

          {/* {isOwner && (
            <button className="btn btn--primary" onClick={handleLogout}>
              Logga ut
            </button>
          )} */}

          {user?.role === "employer" && (
            <>
              <div className="divider"></div>
              <WorkerReviewsPreview workerId={Number(id)} />
            </>
          )}
        </div>
      </section>

      {showDeleteCVConfirm && (
        <div
          className="confirm-overlay"
          onClick={() => setShowDeleteCVConfirm(false)}
        >
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-dialog__heading">Ta bort CV?</h3>
            <p className="confirm-dialog__subheading">
              Är du säker på att du vill ta bort ditt CV? Det går inte att
              ångra.
            </p>
            <div className="confirm-buttons">
              <button
                className="btn confirm-button confirm-button--cancel"
                onClick={() => setShowDeleteCVConfirm(false)}
              >
                Avbryt
              </button>
              <button
                className="btn confirm-button confirm-button--delete"
                onClick={() => {
                  handleDeleteCV();
                  setShowDeleteCVConfirm(false);
                }}
              >
                Ta bort
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isEditContactModalOpen}
        onClose={() => setIsEditContactModalOpen(false)}
        showCloseButton={false}
      >
        <EditWorkerContactModal
          onClose={() => setIsEditContactModalOpen(false)}
          onSave={handleSaveContact}
          profile={profile}
        />
      </Modal>

      <Modal
        isOpen={isEditAboutModalOpen}
        onClose={() => setIsEditAboutModalOpen(false)}
        showCloseButton={false}
      >
        <EditWorkerAboutModal
          onClose={() => setIsEditAboutModalOpen(false)}
          onSave={handleSaveAbout}
          profile={profile}
        />
      </Modal>

      <Modal
        isOpen={isEditExperienceModalOpen}
        onClose={() => setIsEditExperienceModalOpen(false)}
        showCloseButton={false}
      >
        <EditWorkerExperienceModal
          onClose={() => setIsEditExperienceModalOpen(false)}
          onSave={handleSaveExperience}
          profile={profile?.experience}
        />
      </Modal>

      <Modal
        isOpen={isEditEducationModalOpen}
        onClose={() => setIsEditEducationModalOpen(false)}
        showCloseButton={false}
      >
        <EditWorkerEducationModal
          onClose={() => setIsEditEducationModalOpen(false)}
          onSave={handleSaveEducation}
          profile={profile?.education}
        />
      </Modal>

      <Modal
        isOpen={isEditRolesModalOpen}
        onClose={() => setIsEditRolesModalOpen(false)}
        showCloseButton={false}
      >
        <EditWorkerRolesModal
          onClose={() => setIsEditRolesModalOpen(false)}
          onSave={handleSaveRoles}
          profile={profile?.roles}
        />
      </Modal>

      <Modal
        isOpen={isEditAvailabilityModalOpen}
        onClose={() => setIsEditAvailabilityModalOpen(false)}
        showCloseButton={false}
      >
        <EditWorkerAvailabilityModal
          onClose={() => setIsEditAvailabilityModalOpen(false)}
          onSave={handleSaveAvailability}
          profile={profile?.availability}
        />
      </Modal>
    </>
  );
}

export default WorkerProfilePage;
