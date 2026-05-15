import { useAuth } from "../context/useAuth";
import WorkerReviewsPage from "./WorkerReviewsPage";
import EmployerReviewsPage from "./EmployerReviewsPage";

function ReviewsPage() {
  const { user } = useAuth();

  if (user?.role === "worker") return <WorkerReviewsPage />;
  if (user?.role === "employer") return <EmployerReviewsPage />;

  return null;
}

export default ReviewsPage;
