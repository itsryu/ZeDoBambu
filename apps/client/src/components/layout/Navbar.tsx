import { Link, useNavigate } from 'react-router-dom';
import { Utensils, LogIn, LogOut, UserCircle, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext'

export const Navbar: React.FC = () => {
  const { currentUser, signOut, isAuthenticating } = useAuth();
  const { itemCount, openCart } = useCart();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out from Navbar:", error);
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
          <Link to="/info" className="hover:text-orange-200 transition-colors">Sobre Nós</Link>

          {currentUser ? (
            <>
              <Link to="/meu-perfil" className="flex items-center hover:text-orange-200 transition-colors">
                <UserCircle size={20} className="mr-1" />
                Perfil
              </Link>
              {currentUser.role === 'admin' && (
                <Link to="/admin/dashboard" className="hover:text-orange-200 transition-colors">Painel</Link>
              )}
              
              {/* Botão do Carrinho */}
              <button onClick={openCart} className="relative p-2 rounded-full hover:bg-orange-500 transition-colors">
                <ShoppingCart />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </button>

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