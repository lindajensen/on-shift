import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import RegisterWorkerPage from "./pages/RegisterWorkerPage";
import RegisterEmployerPage from "./pages/RegisterEmployerPage";

import "./App.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register/worker" element={<RegisterWorkerPage />} />
        <Route path="/register/employer" element={<RegisterEmployerPage />} />
      </Route>

      {/* WorkerLayout */}
      {/* EmployerLayout */}
    </>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
