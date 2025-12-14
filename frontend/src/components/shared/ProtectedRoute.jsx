import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute - Requires user to be logged in
 */
export function ProtectedRoute({ children }) {
  const { user } = useSelector((store) => store.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * RecruiterRoute - Requires user to be a recruiter
 */
export function RecruiterRoute({ children }) {
  const { user } = useSelector((store) => store.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "recruiter") {
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * ApplicantRoute - Requires user to be an applicant
 */
export function ApplicantRoute({ children }) {
  const { user } = useSelector((store) => store.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "applicant") {
    return <Navigate to="/admin/companies" replace />;
  }

  return children;
}

/**
 * GuestRoute - Only accessible when NOT logged in (login/signup pages)
 */
export function GuestRoute({ children }) {
  const { user } = useSelector((store) => store.auth);

  if (user) {
    // Redirect based on role
    if (user.role === "recruiter") {
      return <Navigate to="/admin/companies" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
