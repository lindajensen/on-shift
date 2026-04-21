import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import RegisterForm from "../components/RegisterForm";
import RegisterPanel from "../components/RegisterPanel";

import "../styles/RegisterPage.css";

function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole =
    searchParams.get("roll") === "arbetsgivare" ? "employer" : "worker";

  const [selectedRole, setSelectedRole] = useState<"worker" | "employer">(
    initialRole,
  );

  return (
    <section className="register-page">
      <div className="section__inner">
        <div className="register-page__inner">
          <RegisterForm role={selectedRole} onRoleChange={setSelectedRole} />
          <RegisterPanel role={selectedRole} />
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;
