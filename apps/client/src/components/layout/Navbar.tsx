import { Link } from 'react-router-dom';
import { Utensils, LogIn, LogOut, UserCircle, ShoppingCart, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export const Navbar: React.FC = () => {
  const { currentUser } = useAuth();
  const { itemCount, openCart } = useCart();

  return (
    <nav className="bg-orange-600 text-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <Utensils size={28} />
          <span>Zé do Bambu</span>
        </Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-orange-200 transition-colors">Início</Link>
          <Link to="/cardapio" className="hover:text-orange-200 transition-colors">Cardápio</Link>
          <Link to="/info" className="hover:text-orange-200 transition-colors">Sobre Nós</Link>
          
          <button onClick={openCart} className="relative p-2 rounded-full hover:bg-orange-500 transition-colors">
            <ShoppingCart />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
          
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <Link to="/meu-perfil" className="flex items-center hover:text-orange-200 transition-colors">
                <UserCircle size={20} className="mr-1" />
                Perfil
              </Link>
              <button onClick={() => useAuth().signOut()} className="flex items-center bg-orange-500 hover:bg-orange-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                <LogOut size={16} className="mr-1" />
                Sair
              </button>
            </div>
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