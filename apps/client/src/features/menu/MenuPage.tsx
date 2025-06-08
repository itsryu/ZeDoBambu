import { IProduct } from '@zedobambu/shared-types';
import apiClient from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ChefHat } from 'lucide-react';

const fetchProducts = async (): Promise<IProduct[]> => {
  const response = await apiClient.get('/v1/products');
  return response.data.data;
};

const MenuPage: React.FC = () => {
  const { data: products, isLoading, isError, error } = useQuery<IProduct[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <ChefHat className="mx-auto h-12 w-12 animate-spin text-orange-500" />
        <p className="mt-4 text-lg text-gray-600">Carregando nosso delicioso cardápio...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 bg-red-50 p-6 rounded-lg">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold text-red-800">Oops! Algo deu errado.</h2>
        <p className="mt-2 text-red-600">Não foi possível carregar o cardápio. Erro: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8 text-orange-700">Nosso Cardápio</h1>
      {products?.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum item disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105">
              <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-orange-700">{product.name}</h2>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <p className="text-lg font-bold text-orange-600 mt-4">R$ {product.price.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-gray-100">
                <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors">
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;