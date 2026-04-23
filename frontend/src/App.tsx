import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import JobsPage from "./pages/JobsPage";
import JobDetailsPage from "./pages/JobDetailsPage";

import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registrera" element={<RegisterPage />} />
        <Route path="/logga-in" element={<LoginPage />} />
        <Route path="/jobb" element={<JobsPage />} />
        <Route path="/jobb/:id" element={<JobDetailsPage />} />
      </Route>

      {/* WorkerLayout and EmployerLayout */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
