import { Navigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly, loaderOnly }) {

  const { user, loading } = useUser();

  /* Wait until auth is loaded */
  if (loading) {
    return <div>Loading...</div>;
  }

  /* Not logged in */
  if (!user) {
    return <Navigate to="/login" />;
  }

  /* Admin only */
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  if (loaderOnly && user.role !== "loader") {
  return <Navigate to="/" />;
}

  return children;
}
