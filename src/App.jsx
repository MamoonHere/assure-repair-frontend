import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ThemeProvider from "./contexts/ThemeProvider";
import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import MapComponent from "./pages/Map";
import UserManagement from "./pages/UserManagement";
import ProtectedRoute from "./commons/ProtectedRoute";
import LoadingFallback from "./commons/LoadingFallback";
import ProtectedLayout from "./layouts/ProtectedLayout";
import PublicLayout from "./layouts/PublicLayout";

const MapPage = ProtectedLayout(MapComponent);
const UserPage = ProtectedLayout(UserManagement);
const LogInPage = PublicLayout(Login);
const SetPasswordPage = PublicLayout(SetPassword);

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <LoadingFallback />;
  }
  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LogInPage />}
      />
      <Route
        path="/set-password"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <SetPasswordPage />
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-management"
        element={
          <ProtectedRoute requiredPermission="USERS.MANAGE">
            <UserPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
