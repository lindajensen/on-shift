import { Outlet, useLocation } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { useAuth } from "../context/useAuth";

import Header from "../components/Header";
import AuthHeader from "../components/AuthHeader";
import BottomNav from "../components/BottomNav";
import Footer from "../components/Footer";

function MainLayout() {
  useScrollToTop();
  const { user } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className={`layout ${user && !isLandingPage ? "auth-layout" : ""}`}>
      {isLandingPage || !user ? <Header /> : <AuthHeader />}
      <main className="layout__content">
        <Outlet />
      </main>
      {isLandingPage || !user ? <Footer /> : <BottomNav role={user.role} />}
    </div>
  );
}

export default MainLayout;
