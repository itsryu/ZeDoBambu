import { Routes, Route, Link, Navigate } from 'react-router-dom';
import HomePage from '@/features/home/HomePage';
import MenuPage from '@/features/menu/MenuPage';
import AdminDashboardPage from '@/features/admin/AdminDashboardPage';
import ProfilePage from '@/features/profile/ProfilePage';
import { Layout } from '@/components/layout/Layout';
import { NotFoundPage } from '@/pages/NotFoundPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import { useAuth } from './contexts/AuthContext';
import InfoPage from './features/info/InfoPage';

const ProtectedRoute: React.FC<{ children: JSX.Element; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { currentUser } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cardapio" element={<MenuPage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/cadastro" element={currentUser ? <Navigate to="/" /> : <RegisterPage />} />

        {/* ROTA DO PERFIL */}
        <Route path="/meu-perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* ROTA DO PAINEL ADMIN */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute adminOnly={true}><AdminDashboardPage /></ProtectedRoute>
        }/>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;