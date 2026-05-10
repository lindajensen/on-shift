import { useAuth } from "../context/useAuth";
import EmployerProfilePage from "./EmployerProfilePage";
import WorkerProfilePage from "./WorkerProfilePage";

function ProfilePage() {
  const { user } = useAuth();

  if (user?.role === "employer") return <EmployerProfilePage />;

  if (user?.role === "worker") return <WorkerProfilePage />;

  return null;
}

export default ProfilePage;
