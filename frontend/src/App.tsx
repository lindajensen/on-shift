import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";

import Dashboard from "./pages/Dashboard";
import EmployerJobListingsPage from "./pages/EmployerJobListingsPage";
import EmployerJobDetailsPage from "./pages/EmployerJobDetailsPage";
import FindWorkersPage from "./pages/FindWorkersPage";
import ProfilePage from "./pages/ProfilePage";
import FavouritesPage from "./pages/FavouritesPage";
import ReviewsPage from "./pages/ReviewsPage";
import ApplicationsPage from "./pages/ApplicationsPage";

import EmployerProfilePage from "./pages/EmployerProfilePage";
import WorkerProfilePage from "./pages/WorkerProfilePage";
import EmployerJobsPage from "./pages/EmployerJobsPage";
import SessionExpiredPage from "./pages/SessionExpiredPage";

import RecommendedJobsPage from "./pages/RecommendedJobsPage";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/session-utgangen" element={<SessionExpiredPage />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registrera" element={<RegisterPage />} />
        <Route path="/logga-in" element={<LoginPage />} />
        <Route path="/jobb" element={<JobsPage />} />
        <Route path="/jobb/:id" element={<JobDetailsPage />} />
        <Route path="/restaurang/:id" element={<EmployerProfilePage />} />
        <Route path="/personal/:id" element={<WorkerProfilePage />} />
        <Route path="/restaurang/:id/pass" element={<EmployerJobsPage />} />
      </Route>

      {/* WorkerLayout and EmployerLayout */}
      <Route element={<AuthLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/hem" element={<Dashboard />} />
          <Route path="/min-profil" element={<ProfilePage />} />
          <Route path="/favoriter" element={<FavouritesPage />} />
          <Route path="/betyg" element={<ReviewsPage />} />
          <Route path="/ansokningar" element={<ApplicationsPage />} />
        </Route>

        {/* Employer Routes  */}
        <Route element={<ProtectedRoute role="employer" />}>
          <Route path="/mina-annonser" element={<EmployerJobListingsPage />} />
          <Route
            path="/mina-annonser/:id"
            element={<EmployerJobDetailsPage />}
          />
          <Route path="/personal" element={<FindWorkersPage />} />
        </Route>

        {/* Worker Routes  */}
        <Route element={<ProtectedRoute role="worker" />}>
          <Route path="/rekommenderade" element={<RecommendedJobsPage />} />
        </Route>
      </Route>
    </>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
