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
import SavedJobsPage from "./pages/SavedJobsPage";
import SavedWorkersPage from "./pages/SavedWorkersPage";
import FindWorkersPage from "./pages/FindWorkersPage";
import EmployerProfilePage from "./pages/EmployerProfilePage";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

//TODO: Need to add role prop to protected routes. I think.

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registrera" element={<RegisterPage />} />
        <Route path="/logga-in" element={<LoginPage />} />
        <Route path="/jobb" element={<JobsPage />} />
        <Route path="/jobb/:id" element={<JobDetailsPage />} />
        <Route path="/restaurang/:id" element={<EmployerProfilePage />} />
      </Route>

      {/* WorkerLayout and EmployerLayout */}
      <Route element={<AuthLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mina-annonser" element={<EmployerJobListingsPage />} />
          <Route
            path="/mina-annonser/:id"
            element={<EmployerJobDetailsPage />}
          />
          <Route path="/sparade-pass" element={<SavedJobsPage />} />
          <Route path="/sparad-personal" element={<SavedWorkersPage />} />
          <Route path="/personal" element={<FindWorkersPage />} />

          <Route path="/min-profil" element={<EmployerProfilePage />} />
        </Route>
      </Route>
    </>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
