import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark text-light px-6">
      <h1 className="text-7xl font-bold mb-4">404</h1>

      <p className="text-muted mb-8">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/dashboard"
        className="px-6 py-3 rounded-xl bg-primary text-dark font-semibold hover:opacity-90 transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}