import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-orange-700 mb-6">
        Bem-vindo ao Zé do Bambu!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        O melhor da culinária regional, feito com carinho para você e sua família.
      </p>
      <Link
        to="/cardapio"
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        Ver Cardápio
      </Link>
    </div>
  );
};

export default HomePage;