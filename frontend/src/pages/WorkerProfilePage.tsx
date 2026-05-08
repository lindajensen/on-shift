import { useEffect, useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import AvailabilityToggle from "../components/AvailabilityToggle";

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
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);
  const [isEditAboutModalOpen, setIsEditAboutModalOpen] = useState(false);
  const [isEditExperienceModalOpen, setIsEditExperienceModalOpen] =
    useState(false);
  const [isEditEducationModalOpen, setIsEditEducationModalOpen] =
    useState(false);
  const [isEditRolesModalOpen, setIsEditRolesModalOpen] = useState(false);
  const [isEditAvailabilityModalOpen, setIsEditAvailabilityModalOpen] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {});

  //TODO: Loading (sätt till true) och error states
  //TODO: Empty states if no contact info
  //TODO: Fetch from backend and props to ProfileHeader
  //! aria-hidden="true"
  //? Funkar availabilitytoggle automatiskt
  //? Roller jag söker längre upp?
  //? Var lägga sparade employers och jobb?
  //? Ska junior och senior ligga där det ligger? Känns som om det har med det jobbet att göra

  return (
    <section className="profile">
      <div className="section__inner">
        <ProfileHeader />

        <div className="divider"></div>

        <AvailabilityToggle />

        <div className="divider"></div>

        <section className="contact-info">
          <header className="contact-info__header">
            <h2 className="contact-info__title">Kontaktinformation</h2>
            <button
              aria-label="Redigera kontaktinformation"
              className="contact-info__edit-btn"
              onClick={() => setIsEditContactModalOpen(true)}
            >
              <Edit size={16} aria-hidden="true" />
            </button>
          </header>

          <ul className="contact-info__list">
            <li className="contact-info__item">
              <div className="contact-info__icon-container">
                <Mail size={18} aria-hidden="true" />
              </div>
              <div className="contact-info__item-content">
                <p className="contact-info__label">E-post</p>
                <p className="contact-info__value">anna@hello.se</p>
              </div>
            </li>

            <li className="contact-info__item">
              <div className="contact-info__icon-container">
                <Phone size={18} aria-hidden="true" />
              </div>
              <div className="contact-info__item-content">
                <p className="contact-info__label">Telefon</p>
                <p className="contact-info__value">070-123 45 67</p>
              </div>
            </li>

            <li className="contact-info__item">
              <div className="contact-info__icon-container">
                <MapPin size={18} aria-hidden="true" />
              </div>
              <div className="contact-info__item-content">
                <p className="contact-info__label">Stad</p>
                <p className="contact-info__value">Stockholm</p>
              </div>
            </li>
          </ul>
        </section>

        <div className="divider"></div>

        <section className="about">
          <header className="about__header">
            <h2 className="about__title">Om mig</h2>
            <button
              aria-label="Redigera restaurangbeskrivning"
              className="about__edit-btn"
              onClick={() => setIsEditAboutModalOpen(true)}
            >
              <Edit size={16} aria-hidden="true" />
            </button>
          </header>

          <p>
            Erfaren servitör med 3 års erfarenhet från à la carte och brasserie.
            Trivs i högt tempo och är van vid att arbeta självständigt. Söker
            extra pass på kvällar och helger.
          </p>
        </section>

        <div className="divider"></div>

        {/* <section className="experience">
          <header className="experience__header">
            <h2 className="experience__title">Erfarenhet</h2>
            <button
              aria-label="Redigera erfarenhet"
              className="experience__edit-btn"
            >
              <Edit size={16} aria-hidden="true" />
            </button>
          </header>

          <ul className="experience-info__list">
            <li className="experience-info__item">Servitör · Senior</li>
            <li className="experience-info__item">Bartender · Junior</li>
          </ul>
        </section> */}

        <section className="experience">
          <header className="experience__header">
            <h2 className="experience__title">Erfarenhet</h2>
            <button
              aria-label="Redigera erfarenhet"
              className="experience__edit-btn"
              onClick={() => setIsEditExperienceModalOpen(true)}
            >
              <Edit size={16} aria-hidden="true" />
            </button>
          </header>

          <ul className="timeline">
            <li className="timeline__item">
              <div className="timeline__dot" />
              <div className="timeline__content">
                <div className="timeline__title-row">
                  <p className="timeline__title">Servitör · Senior</p>
                  <span className="timeline__date">Jan 2022 - nu</span>
                </div>
                <p className="timeline__subtitle">Restaurang Volt</p>
              </div>
            </li>
            <li className="timeline__item">
              <div className="timeline__dot" />
              <div className="timeline__content">
                <div className="timeline__title-row">
                  <p className="timeline__title">Bartender · Junior</p>
                  <span className="timeline__date">Jun 2020 - Dec 2021</span>
                </div>
                <p className="timeline__subtitle">Norrsken Bar</p>
              </div>
            </li>
          </ul>
        </section>

        <div className="divider"></div>

        {/* <section className="education">
          <header className="education__header">
            <h2 className="education__title">Utbildning</h2>
            <button
              aria-label="Redigera utbildning"
              className="education__edit-btn"
            >
              <Edit size={16} aria-hidden="true" />
            </button>
          </header>

          <ul className="timeline">
            <li className="timeline__item">
              <div className="timeline__dot" />
              <div className="timeline__content">
                <div className="timeline__title-row">
                  <p className="timeline__title">
                    Hotell- och restaurangprogrammet
                  </p>
                  <span className="timeline__date">2019</span>
                </div>
                <p className="timeline__subtitle">Stockholms gymnasium</p>
              </div>
            </li>
          </ul>
        </section> */}

        <section className="education">
          <header className="education__header">
            <h2 className="education__title">Utbildning</h2>
            <button
              aria-label="Redigera utbildning"
              className="education__edit-btn"
              onClick={() => setIsEditEducationModalOpen(true)}
            >
              <Edit size={16} aria-hidden="true" />
            </button>
          </header>

          <ul className="education__list">
            <li className="education__item">
              <div className="education__icon-container">
                <GraduationCap
                  size={18}
                  aria-hidden="true"
                  className="education__icon"
                />
              </div>
              <div className="education__content">
                <p className="education__name">
                  Hotell- och restaurangprogrammet
                </p>
                <p className="education__meta">Stockholms gymnasium · 2019</p>
              </div>
            </li>

            <li className="education__item">
              <div className="education__icon-container">
                <GraduationCap
                  size={18}
                  aria-hidden="true"
                  className="education__icon"
                />
              </div>
              <div className="education__content">
                <p className="education__name">
                  Hotell- och restaurangprogrammet
                </p>
                <p className="education__meta">Stockholms gymnasium · 2019</p>
              </div>
            </li>
          </ul>
        </section>

        <div className="divider"></div>

        <section className="roles">
          <header className="roles__header">
            <h2 className="roles__title">Roller jag söker</h2>
            <button
              aria-label="Redigera roller"
              className="education__edit-btn"
              onClick={() => setIsEditRolesModalOpen(true)}
            >
              <Edit size={16} aria-hidden="true" />
            </button>
          </header>

          <ul className="roles-info__list">
            <li className="roles-info__item badge badge--accent">Servitör</li>
            <li className="roles-info__item badge badge--accent">Kock</li>
          </ul>
        </section>

        <div className="divider"></div>

        <section className="availability">
          <header className="availability__header">
            <h2 className="availability__title">Tillgänglighet</h2>

            <button
              aria-label="Redigera tillgänglighet"
              className="availability__edit-btn"
              onClick={() => setIsEditAvailabilityModalOpen(true)}
            >
              <Edit size={16} aria-hidden="true" />
            </button>
          </header>

          <ul className="availability__list">
            <li className="availability__item">
              <span className="availability__day">Mån</span>
              <span className="availability__time">16:00 - 23:00</span>
            </li>
            <li className="availability__item">
              <span className="availability__day">Tis</span>
              <span className="availability__time">16:00 - 23:00</span>
            </li>
            <li className="availability__item">
              <span className="availability__day">Ons</span>
              <span className="availability__time availability__time--unavailable">
                Inte tillgänglig
              </span>
            </li>
            <li className="availability__item">
              <span className="availability__day">Tors</span>
              <span className="availability__time">16:00 - 23:00</span>
            </li>
            <li className="availability__item">
              <span className="availability__day">Fre</span>
              <span className="availability__time">14:00 - 23:00</span>
            </li>
            <li className="availability__item">
              <span className="availability__day">Lör</span>
              <span className="availability__time">12:00 - 23:00</span>
            </li>
            <li className="availability__item">
              <span className="availability__day">Sön</span>
              <span className="availability__time availability__time--unavailable">
                Inte tillgänglig
              </span>
            </li>
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

        <button className="btn btn--primary btn--full">Logga ut</button>
      </div>
    </section>
  );
}

export default WorkerProfilePage;
