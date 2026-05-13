import { useAuth } from "../context/useAuth";
import SavedWorkersPage from "./SavedWorkersPage";
import WorkerFavouritesPage from "./WorkerFavouritesPage";

function FavouritesPage() {
  const { user } = useAuth();

  if (user?.role === "employer") return <SavedWorkersPage />;
  if (user?.role === "worker") return <WorkerFavouritesPage />;

  return null;
}

export default FavouritesPage;
