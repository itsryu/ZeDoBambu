// /zedobambu-monorepo/apps/client/src/App.tsx
// Adicione as rotas de Login e Registro
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import HomePage from '@/features/home/HomePage';
import MenuPage from '@/features/menu/MenuPage';
import { Layout } from '@/components/layout/Layout';
import { NotFoundPage } from '@/pages/NotFoundPage';
import LoginPage from '@/pages/LoginPage'; // ADICIONADO
import RegisterPage from '@/pages/RegisterPage'; // ADICIONADO
import { useAuth } from './contexts/authContexts'; // ADICIONADO

// Componente para rotas protegidas
const ProtectedRoute: React.FC<{ children: JSX.Element; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Carregando autenticação...</div>; // Ou um spinner/skeleton
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />; // Ou para uma página de acesso negado
  }

  return children;
};


function App() {
  const { currentUser } = useAuth(); // ADICIONADO

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cardapio" element={<MenuPage />} />
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/cadastro" element={currentUser ? <Navigate to="/" /> : <RegisterPage />} />

        {/* Exemplo de rota protegida para cliente */}
        <Route path="/meu-perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Exemplo de rota protegida para admin (supondo que /admin seja parte desta app) */}
        {/* Se /admin for uma app separada, o redirecionamento será diferente */}
        <Route path="/admin/dashboard-interno" element={
          <ProtectedRoute adminOnly={true}><AdminDashboardPage /></ProtectedRoute>
        }/>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

// Componentes de exemplo para rotas protegidas (crie-os)
const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  return <div><h1>Meu Perfil</h1><p>Bem-vindo, {currentUser?.name || currentUser?.email}!</p></div>;
};
const AdminDashboardPage: React.FC = () => <div><h1>Painel Admin Interno</h1><p>Configurações avançadas.</p></div>;


export default App;