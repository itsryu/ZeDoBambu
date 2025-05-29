import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-orange-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <Utensils size={28} />
          <span>Zé do Bambu</span>
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-orange-200">Início</Link>
          <Link to="/cardapio" className="hover:text-orange-200">Cardápio</Link>
        </div>
      </div>
    </nav>
  );
};