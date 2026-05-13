import { useAuth } from "../context/useAuth";
import SavedWorkersPage from "./SavedWorkersPage";
import SavedJobsPage from "./SavedJobsPage";

function FavouritesPage() {
  const { user } = useAuth();

  if (user?.role === "employer") return <SavedWorkersPage />;
  if (user?.role === "worker") return <SavedJobsPage />;

  return null;
}

export default FavouritesPage;
