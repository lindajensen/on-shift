import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "../api/worker";
import {
  getRoleLabel,
  getExperienceLevel,
  getDayLabel,
} from "../utils/formatters";
import { formatTime } from "../utils/date";
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
import ErrorMessage from "../components/ErrorMessage";

import {
  Edit,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  ExternalLink,
  Upload,
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

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isOwner = user?.id === profile?.user_id;
  const profileId = id ?? user?.id;

  useEffect(() => {
    if (!profileId) return;

    async function fetchWorkerProfile() {
      try {
        const data = id
          ? await getWorkerProfileById(Number(id))
          : await getWorkerProfileByUserId();

        setProfile(data);
      } catch (error) {
        console.error("Kunde inte hämta profil", error);
        setError("Vi kunde inte hämta profilen. Försök igen senare.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkerProfile();
  }, [profileId, id, user]);

  function handleLogout() {
    navigate("/");
    logout();
  }

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

  if (error) return <ErrorMessage message={error} />;

  //TODO: CV section (upload only is isOwner)
  //? Var lägga sparade employers och jobb?

  return (
    <>
      <section className="profile">
        <div className="section__inner">
          {isLoading && (
            <>
              <div className="profile__skeleton skeleton" />
              <div className="profile__skeleton skeleton" />
              <div className="profile__skeleton skeleton" />
            </>
          )}

          {!isLoading && !error && profile && (
            <>
              <ProfileHeader
                name={profile.name}
                city={profile.city}
                rating={profile.rating}
                isOwner={isOwner}
              />

              <div className="divider"></div>

              {isOwner && <AvailabilityToggle />}

              {/* <div className="divider"></div> */}

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

                <p
                  className={`about__text ${!profile.bio ? "empty-text" : ""}`}
                >
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
                  <div className="cv__content">
                    <div className="cv__info">
                      <p className="cv__filename">anna_andersson_CV.pdf</p>
                      <p className="cv__date">Uppladdad 10 april 2026</p>
                    </div>

                    <div className="cv__actions">
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visa CV"
                        className="cv__view-btn"
                      >
                        <ExternalLink size={16} aria-hidden="true" />
                      </a>
                      <button
                        aria-label="Ladda upp nytt CV"
                        className="cv__upload-btn"
                      >
                        <Upload size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {isOwner && (
                <button
                  className="btn btn--primary btn--full"
                  onClick={handleLogout}
                >
                  Logga ut
                </button>
              )}
            </>
          )}
        </div>
      </section>

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
