import { useEffect, useState } from "react";
import { toggleAvailability, getWorkerProfile } from "../api/worker";

import "../styles/AvailabilityToggle.css";

function AvailabilityToggle() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkerProfile() {
      try {
        const data = await getWorkerProfile();
        setIsAvailable(data.is_available);
      } catch (error) {
        console.error("Kunde inte hämta profil", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkerProfile();
  }, []);

  async function handleToggle() {
    const updatedAvailability = !isAvailable;
    setIsAvailable(updatedAvailability);

    try {
      await toggleAvailability(updatedAvailability);
    } catch (error) {
      setIsAvailable(!updatedAvailability);
      console.error(error);
    }
  }

  return (
    <div className="availability-toggle">
      <div className="availability-toggle__text">
        <p className="availability-toggle__title">Söker jobb</p>
        <p className="availability-toggle__subtitle">Synlig för företag</p>
      </div>

      <label className="toggle">
        <input
          type="checkbox"
          className="toggle__input"
          checked={isAvailable}
          onChange={handleToggle}
          disabled={isLoading}
        />
        <span className="toggle__slider"></span>
      </label>
    </div>
  );
}

export default AvailabilityToggle;
