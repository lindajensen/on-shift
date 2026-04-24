import { Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import AuthHeader from "../components/AuthHeader";
import BottomNav from "../components/BottomNav";

function AuthLayout() {
  const { user } = useAuth();

  return (
    <div className="layout">
      <AuthHeader />
      <main className="layout__content">
        <Outlet />
      </main>
      <BottomNav role={user!.role} />
    </div>
  );
}

export default AuthLayout;
