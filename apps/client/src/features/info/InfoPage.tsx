import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { IRestaurantInfo } from '@zedobambu/shared-types';
import { Loader2, MapPin, Phone, Clock } from 'lucide-react';

const fetchRestaurantInfo = async (): Promise<IRestaurantInfo> => {
  const { data } = await apiClient.get('/v1/restaurant/info');
  return data.data;
};

const InfoPage: React.FC = () => {
  const { data: info, isLoading, isError } = useQuery<IRestaurantInfo, Error>({
    queryKey: ['restaurantInfo'],
    queryFn: fetchRestaurantInfo,
  });
  
  if (isLoading) return <div className="text-center p-10"><Loader2 className="animate-spin h-8 w-8 mx-auto text-orange-500" /></div>;
  if (isError) return <div className="text-center p-10 text-red-600">Erro ao carregar as informações.</div>;

  const fullAddress = `${info?.address.street}, ${info?.address.number} - ${info?.address.neighborhood}, ${info?.address.city} - ${info?.address.state}`;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-orange-700">{info?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-2xl font-semibold mb-4 text-gray-800">Contacto e Endereço</h2>
           {/* ... Detalhes de contacto e endereço ... */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Horário de Funcionamento</h2>
          {/* ... Lista de horários ... */}
        </div>
      </div>
      <div className="mt-8 rounded-lg shadow-md overflow-hidden">
        <iframe
          src={mapSrc}
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default InfoPage;