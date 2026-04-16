import { useState } from "react";

import {
  UserPlus2,
  CalendarClock,
  Zap,
  House,
  Plus,
  Users2,
} from "lucide-react";

import "../styles/HowItWorks.css";

function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"worker" | "employer">("worker");

  return (
    <section className="how-it-works">
      <h2>Så fungerar det</h2>

      <div className="how-it-works__toggle">
        <button
          className={`how-it-works__toggle-btn ${activeTab === "worker" ? "how-it-works__toggle-btn--active" : ""}`}
          onClick={() => setActiveTab("worker")}
        >
          För personal
        </button>
        <button
          className={`how-it-works__toggle-btn ${activeTab === "employer" ? "how-it-works__toggle-btn--active" : ""}`}
          onClick={() => setActiveTab("employer")}
        >
          För restauranger
        </button>
      </div>

      {/* Worker Steps */}
      {activeTab === "worker" && (
        <ul className="how-it-works__steps">
          <li className="how-it-works__step">
            <div className="how-it-works__step-icon">
              {" "}
              <UserPlus2 size={20} />
            </div>
            <div className="how-it-works__step-content">
              <h3 className="how-it-works__step-title">
                Registrera dig gratis
              </h3>
              <p className="how-it-works__step-description">
                Skapa din profil och ladda upp ditt CV.
              </p>
            </div>
          </li>
          
          <li className="how-it-works__step">
            <div className="how-it-works__step-icon">
              {" "}
              <CalendarClock size={20} />
            </div>
            <div className="how-it-works__step-content">
              <h3 className="how-it-works__step-title">
                Ange när du är tillgänglig
              </h3>
              <p className="how-it-works__step-description">
                Fyll i dina lediga dagar och tider så vet restaurangen när du
                kan hoppa in.
              </p>
            </div>
          </li>
          <li className="how-it-works__step">
            <div className="how-it-works__step-icon">
              {" "}
              <Zap size={20} />
            </div>
            <div className="how-it-works__step-content">
              <h3 className="how-it-works__step-title">Få jobb direkt</h3>
              <p className="how-it-works__step-description">
                Ansök direkt eller låt arbetsgivare hitta dig.
              </p>
            </div>
          </li>
        </ul>
      )}

      {activeTab === "employer" && (
        <ul className="how-it-works__steps">
          <li className="how-it-works__step">
            <div className="how-it-works__step-icon">
              {" "}
              <House size={20} />
            </div>
            <div className="how-it-works__step-content">
              <h3 className="how-it-works__step-title">Registrera er gratis</h3>
              <p className="how-it-works__step-description">
                Registrera restaurangen en gång och skapa eran profil.
              </p>
            </div>
          </li>

          <li className="how-it-works__step">
            <div className="how-it-works__step-icon">
              {" "}
              <Plus size={20} />
            </div>

            <div className="how-it-works__step-content">
              <h3 className="how-it-works__step-title">Posta ett pass</h3>
              <p className="how-it-works__step-description">
                Välj roll, datum och ersättning. Klart på under en minut.
              </p>
            </div>
          </li>

          <li className="how-it-works__step">
            <div className="how-it-works__step-icon">
              {" "}
              <Users2 size={20} />
            </div>
            <div className="how-it-works__step-content">
              <h3 className="how-it-works__step-title">Hitta rätt person</h3>
              <p className="how-it-works__step-description">
                Ta emot ansökningar eller sök bland tillgänglig personal.
              </p>
            </div>
          </li>
        </ul>
      )}
    </section>
  );
}

export default HowItWorks;
