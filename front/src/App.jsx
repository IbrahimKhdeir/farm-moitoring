import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Login from "./components/Login";
import Header from "./components/Header";
import MainDashboard from "./components/MainDashboard";
import Devices from "./components/Devices";
import Sensors from "./components/Sensors";
import Alerts from "./components/Alerts";
import AlertSettings from "./components/AlertSettings";
import ApiKeys from "./components/ApiKeys";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <>
        {isAuthenticated && <Header />}
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/devices"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="container mx-auto px-4 py-6">
                    <Devices />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sensors"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="container mx-auto px-4 py-6">
                    <Sensors />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="container mx-auto px-4 py-6">
                    <Alerts />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/alert-settings"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="container mx-auto px-4 py-6">
                    <AlertSettings />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/api-keys"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="container mx-auto px-4 py-6">
                    <ApiKeys />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    </Router>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
