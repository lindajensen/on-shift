import "../styles/CTABanner.css";

function CTABanner() {
  return (
    <section className="cta-banner">
      <div className="cta-banner__inner">
        <h2 className="cta-banner__title">
          Redo att hoppa in <span className="cta-banner__accent">direkt?</span>
        </h2>
        <p className="cta-banner__subtitle">
          Registrera dig gratis och hitta ditt nästa pass eller rätt person för
          jobbet.
        </p>
      </div>
    </section>
  );
}

export default CTABanner;
