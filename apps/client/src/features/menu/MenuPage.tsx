import { IProduct } from '@zedobambu/shared-types';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/axios';


const mockProducts: IProduct[] = [
  { id: '1', name: 'Galinha Caipira', description: 'Deliciosa galinha caipira ao molho pardo.', price: 55.90, category: { id: 'cat1', name: 'Pratos Principais' }, availability: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Feijoada Completa', description: 'Tradicional feijoada com todos os acompanhamentos.', price: 79.90, category: { id: 'cat1', name: 'Pratos Principais' }, availability: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Suco de Laranja Natural', description: '300ml de puro suco de laranja.', price: 8.00, category: { id: 'cat2', name: 'Bebidas' }, availability: true, createdAt: new Date(), updatedAt: new Date() },
];

const MenuPage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Exemplo de como seria o fetch com useEffect e apiClient (idealmente com react-query)
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const response = await apiClient.get<{ data: IProduct[] }>('/api/v1/products'); // Ajuste o endpoint
  //       setProducts(response.data.data);
  //     } catch (err) {
  //       setError('Falha ao carregar o cardápio.');
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProducts();
  // }, []);

  if (loading) return <p className="text-center">Carregando cardápio...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8 text-orange-700">Nosso Cardápio</h1>
      {products.length === 0 && !loading && (
        <p className="text-center text-gray-500">Nenhum item disponível no momento.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
            )}
            {!product.imageUrl && (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Imagem Indisponível</span>
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-3">{product.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-orange-600">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
                {product.availability ? (
                  <button className="bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-3 rounded-full">
                    Adicionar
                  </button>
                ) : (
                  <span className="text-sm text-red-500">Indisponível</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;