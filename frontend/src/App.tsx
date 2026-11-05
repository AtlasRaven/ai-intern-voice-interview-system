import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PositionsPage } from './pages/PositionsPage';
import { InterviewRoomPage } from './pages/InterviewRoomPage';
import { EvaluationResultPage } from './pages/EvaluationResultPage';
import { HRDashboardPage } from './pages/HRDashboardPage';
import { QuestionBankPage } from './pages/QuestionBankPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requireHR?: boolean }> = ({ children, requireHR = false }) => {
  const { isAuthenticated, isHR } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireHR && !isHR) {
    return <Navigate to="/positions" replace />;
  }

  return <>{children}</>;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-background text-textPrimary">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route
                path="/positions"
                element={
                  <ProtectedRoute>
                    <PositionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/:id"
                element={
                  <ProtectedRoute>
                    <InterviewRoomPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/evaluation/:id"
                element={
                  <ProtectedRoute>
                    <EvaluationResultPage />
                  </ProtectedRoute>
                }
              />

              {/* HR Only Routes */}
              <Route
                path="/hr/dashboard"
                element={
                  <ProtectedRoute requireHR>
                    <HRDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr/questions"
                element={
                  <ProtectedRoute requireHR>
                    <QuestionBankPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/positions" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
