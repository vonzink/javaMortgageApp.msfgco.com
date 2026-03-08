import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import AuthGuard from '@/components/ui/AuthGuard';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import ApplicationFormPage from '@/pages/ApplicationFormPage';
import ApplicationListPage from '@/pages/ApplicationListPage';
import ApplicationDetailsPage from '@/pages/ApplicationDetailsPage';

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route element={<AuthGuard><Layout /></AuthGuard>}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/apply" element={<ApplicationFormPage />} />
        <Route path="/applications" element={<ApplicationListPage />} />
        <Route path="/applications/:id" element={<ApplicationDetailsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
