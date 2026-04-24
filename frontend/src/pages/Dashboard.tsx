import { useAuth } from "../context/useAuth";
import WorkerDashboard from "../components/WorkerDashboard";
import EmployerDashboard from "../components/EmployerDashboard";

function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "worker") return <WorkerDashboard />;

  if (user?.role === "employer") return <EmployerDashboard />;
}

export default Dashboard;
