import { Outlet } from "react-router-dom";

import Header from "../components/Header";

function MainLayout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout__content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
