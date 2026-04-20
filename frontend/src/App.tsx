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
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";

import "./App.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/registrera/arbetstagare"
          element={<RegisterWorkerPage />}
        />
        <Route
          path="/registrera/arbetsgivare"
          element={<RegisterEmployerPage />}
        />
        <Route path="/jobb" element={<JobsPage />} />
        <Route path="/jobb/:id" element={<JobDetailsPage />} />
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
