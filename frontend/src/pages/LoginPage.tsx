import LoginForm from "../components/LoginForm";
import LoginPanel from "../components/LoginPanel";

import "../styles/LoginPage.css";

//? Link to this page from protected routes.

function LoginPage() {
  return (
    <section className="login-page">
      <div className="section__inner">
        <div className="login-page__inner">
          <LoginForm />
          <LoginPanel />
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
