import { useAuth } from "../context/useAuth";
import WorkerApplicationsPage from "./WorkerApplicationsPage";
import EmployerApplicationsPage from "./EmployerApplicationsPage";

function ApplicationsPage() {
  const { user } = useAuth();

  if (user?.role === "worker") return <WorkerApplicationsPage />;
  if (user?.role === "employer") return <EmployerApplicationsPage />;

  return null;
}

export default ApplicationsPage;
