import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface TokenPayload {
  exp: number;
  orgId?: number;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded: TokenPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    if (!decoded.orgId) {
      return <Navigate to="/join-organization" replace />;
    }
  } catch (error) {
    // Invalid token
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
