import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../styles/Hero.css";

const headlines = ["Hoppa in och börja jobba", "Hitta rätt personal"];

function Hero() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % headlines.length);
        setVisible(true);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="section__inner">
        <h1
          className={`hero__heading ${visible ? "hero__heading--visible" : "hero__heading--hidden"}`}
        >
          {headlines[index]}{" "}
          <span className="hero__heading-accent">direkt.</span>
        </h1>
        <p className="hero__subheading">
          Plattformen för bemanning inom restaurangbranschen. Hitta pass eller
          hyr professionell personal på bara några minuter.
        </p>

        <div className="hero__actions">
          <Link className="btn btn--primary" to="/register/worker">
            Söker jobb
          </Link>
          <Link className="btn btn--outline" to="/register/employer">
            Söker personal
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
