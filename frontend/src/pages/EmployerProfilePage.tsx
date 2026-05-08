import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  getEmployerProfileByUserId,
  getEmployerProfileById,
  updateEmployerProfile,
} from "../api/employer";
import { formatAddress } from "../utils/formatters";
import {
  EmployerProfile,
  EditContactFormData,
  EditAboutFormData,
} from "../types";
import ProfileHeader from "../components/ProfileHeader";
import ErrorMessage from "../components/ErrorMessage";
import Modal from "../components/modals/Modal";
import EditContactModal from "../components/modals/EditContactModal";
import EditAboutModal from "../components/modals/EditAboutModal";
import { Edit, Mail, Phone, MapPin } from "lucide-react";

import "../styles/ProfilePage.css";

function EmployerProfilePage() {
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);
  const [isEditAboutModalOpen, setIsEditAboutModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isOwner = user?.id === profile?.user_id;
  const profileId = id ?? user?.id;

  useEffect(() => {
    if (!profileId) return;

    async function fetchEmployerProfile() {
      try {
        const data = id
          ? await getEmployerProfileById(Number(id))
          : await getEmployerProfileByUserId();

        setProfile(data);
      } catch (error) {
        console.error("Kunde inte hämta profil", error);
        setError("Vi kunde inte hämta profilen. Försök igen senare.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmployerProfile();
  }, [profileId, id, user]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  async function handleSaveContact(contactData: EditContactFormData) {
    try {
      await updateEmployerProfile(contactData);
      setProfile((prev) => (prev ? { ...prev, ...contactData } : prev));

      setIsEditContactModalOpen(false);
    } catch (error) {
      console.error("Kunde inte spara kontaktinformationen", error);
    }
  }

  async function handleSaveAbout(aboutData: EditAboutFormData) {
    try {
      await updateEmployerProfile(aboutData);
      setProfile((prev) => (prev ? { ...prev, ...aboutData } : prev));

      setIsEditAboutModalOpen(false);
    } catch (error) {
      console.error("Kunde inte spara kontaktinformationen", error);
    }
  }

  if (error) return <ErrorMessage message={error} />;

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

              <section className="contact-info">
                <header className="contact-info__header">
                  <h2 className="contact-info__title">Kontaktinformation</h2>
                  {isOwner && (
                    <button
                      aria-label="Redigera kontaktinformation"
                      onClick={() => setIsEditContactModalOpen(true)}
                      className="contact-info__edit-btn"
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
                      <p className="contact-info__value">
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
                      <p className="contact-info__value">
                        {profile.phone ?? "Inget telefonnummer angivet"}
                      </p>
                    </div>
                  </li>
                  <li className="contact-info__item">
                    <div className="contact-info__icon-container">
                      <MapPin size={18} aria-hidden="true" />
                    </div>
                    <div className="contact-info__item-content">
                      <p className="contact-info__label">Adress</p>
                      <p className="contact-info__value">
                        {formatAddress(
                          profile.street ?? null,
                          profile.postal_code ?? null,
                          profile.city ?? null,
                        )}
                      </p>
                    </div>
                  </li>
                </ul>
              </section>

              <div className="divider"></div>

              <section className="about">
                <header className="about__header">
                  <h2 className="about__title">Om restaurangen</h2>
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

                {profile.description ? (
                  <p className="about__text">{profile.description}</p>
                ) : (
                  <p>Ingen beskrivning angiven</p>
                )}
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
        <EditContactModal
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
        <EditAboutModal
          onClose={() => setIsEditAboutModalOpen(false)}
          onSave={handleSaveAbout}
          profile={profile}
        />
      </Modal>
    </>
  );
}

export default EmployerProfilePage;
