import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  getEmployerProfileByUserId,
  getEmployerProfileById,
} from "../api/employer";
import { formatAddress } from "../utils/formatters";
import { EmployerProfile } from "../types";
import ProfileHeader from "../components/ProfileHeader";
import ErrorMessage from "../components/ErrorMessage";
import { Edit, Mail, Phone, MapPin } from "lucide-react";

import "../styles/EmployerProfilePage.css";

function EmployerProfilePage() {
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isOwner = user?.id === profile?.user_id;
  const profileId = id ?? user?.userId;

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

  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="employer-profile">
      <div className="section__inner">
        {isLoading && (
          <>
            <div className="employer-profile__skeleton skeleton" />
            <div className="employer-profile__skeleton skeleton" />
            <div className="employer-profile__skeleton skeleton" />
          </>
        )}

        {!isLoading && !error && profile && (
          <>
            <ProfileHeader
              name={profile.name}
              city={profile.city}
              rating={profile.rating}
            />

            <div className="divider"></div>

            <section className="contact-info">
              <header className="contact-info__header">
                <h2 className="contact-info__title">Kontaktinformation</h2>
                {isOwner && (
                  <button className="contact-info__edit-btn">
                    <Edit size={16} />
                  </button>
                )}
              </header>

              <ul className="contact-info__list">
                <li className="contact-info__item">
                  <div className="contact-info__icon-container">
                    <Mail size={18} />
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
                    <Phone size={18} />
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
                    <MapPin size={18} />
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

            <section className="about-restaurant">
              <header className="about-restaurant__header">
                <h2 className="about-restaurant__title">Om restaurangen</h2>
                {isOwner && (
                  <button className="about-restaurant__edit-btn">
                    <Edit size={16} />
                  </button>
                )}
              </header>

              {profile.description ? (
                <p className="about-restaurant__text">{profile.description}</p>
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
  );
}

export default EmployerProfilePage;
