import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import StorePage from "./pages/StorePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>;
  return admin ? children : <Navigate to="/admin/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StorePage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={
        <ProtectedRoute><AdminPage /></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
