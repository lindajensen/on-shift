import "../styles/LoadingSpinner.css";

interface LoadingSpinnerProps {
  title?: string;
  subtitle?: string;
}

function LoadingSpinner({
  title = "Laddar...",
  subtitle,
}: LoadingSpinnerProps) {
  return (
    <section className="loading-spinner">
      <div className="section__inner">
        <h1 className="loading-spinner__logo">
          <span className="loading-spinner__logo-accent">on</span>Shift
        </h1>

        <span className="loading-spinner__loader"></span>

        <div className="loading-spinner__content">
          <h2 className="loading-spinner__content__title">{title}</h2>
          <p className="loading-spinner__content__subtitle">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}

export default LoadingSpinner;
