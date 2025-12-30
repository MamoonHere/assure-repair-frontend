import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingFallback from "./LoadingFallback";

const isPermissionPresent = (requiredPermission, userPermissions = []) => {
  return userPermissions.includes(requiredPermission);
};

const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) {
    return <LoadingFallback />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (requiredPermission && !isPermissionPresent(requiredPermission, user?.permissions)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
