import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ThemeProvider from "./contexts/ThemeProvider";
import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import Home from "./pages/Home";
import UserManagement from "./pages/UserManagement";
import ProtectedRoute from "./commons/ProtectedRoute";
import LoadingFallback from "./commons/LoadingFallback";

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <LoadingFallback />;
  }
  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/set-password"
        element={isAuthenticated ? <Navigate to="/" replace /> : <SetPassword />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-management"
        element={
          <ProtectedRoute requiredPermission="USERS.MANAGE">
            <UserManagement />
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