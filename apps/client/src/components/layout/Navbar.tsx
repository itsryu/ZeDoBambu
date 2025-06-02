import { Link, useNavigate } from 'react-router-dom';
import { Utensils, LogIn, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/authContexts'; // ADICIONADO

export const Navbar: React.FC = () => {
  const { currentUser, signOut, isAuthenticating } = useAuth(); // ADICIONADO
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirecionamento já é feito no AuthContext
    } catch (error) {
      console.error("Failed to sign out from Navbar:", error);
      // Tratar erro aqui se necessário
    }
  };

  return (
    <nav className="bg-orange-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <Utensils size={28} />
          <span>Zé do Bambu</span>
        </Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-orange-200 transition-colors">Início</Link>
          <Link to="/cardapio" className="hover:text-orange-200 transition-colors">Cardápio</Link>
          
          {currentUser ? (
            <>
              <Link to="/meu-perfil" className="flex items-center hover:text-orange-200 transition-colors">
                <UserCircle size={20} className="mr-1" />
                Perfil
              </Link>
              {currentUser.role === 'admin' && (
                // Se o admin for uma app separada, este link será um <a> normal
                // ou um botão que redireciona para a URL do admin app.
                // Exemplo para rota interna:
                <Link to="/admin/dashboard-interno" className="hover:text-orange-200 transition-colors">Painel Admin</Link>
                // Exemplo para app externa:
                // <a href={import.meta.env.VITE_ADMIN_APP_URL || '/admin-app'} target="_blank" rel="noopener noreferrer" className="hover:text-orange-200 transition-colors">Painel Admin</a>
              )}
              <button
                onClick={handleSignOut}
                disabled={isAuthenticating}
                className="flex items-center bg-orange-500 hover:bg-orange-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-70"
              >
                <LogOut size={16} className="mr-1" />
                {isAuthenticating ? 'Saindo...' : 'Sair'}
              </button>
            </>
          ) : (
            <Link to="/login" className="flex items-center bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
              <LogIn size={16} className="mr-1" />
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};