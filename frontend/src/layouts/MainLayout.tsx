import { Outlet } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";

import Header from "../components/Header";
import Footer from "../components/Footer";

function MainLayout() {
  useScrollToTop();
  return (
    <div className="layout">
      <Header />
      <main className="layout__content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
