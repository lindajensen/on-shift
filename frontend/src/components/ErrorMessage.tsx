import { CircleAlert } from "lucide-react";

import "../styles/ErrorMessage.css";

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <section className="error-message">
      <div className="section__inner">
        <div className="error-message__icon-container">
          <CircleAlert className="error-message__icon" size={26} />
        </div>

        <div className="error-message__content">
          <h1 className="error-message__title">Något gick fel</h1>
          <p className="error-message__text">{message}</p>
        </div>

        <button
          className="btn btn--primary"
          onClick={() => window.location.reload()}
        >
          Försök igen
        </button>
      </div>
    </section>
  );
}

export default ErrorMessage;
