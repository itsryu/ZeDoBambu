import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AlertTriangle className="w-24 h-24 text-orange-500 mb-6" />
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Página Não Encontrada</p>
      <p className="text-gray-500 mb-8">
        Oops! A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
      >
        Voltar para a Página Inicial
      </Link>
    </div>
  );
};