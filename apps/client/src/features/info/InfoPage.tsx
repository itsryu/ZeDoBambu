// /zedobambu-monorepo/apps/client/src/features/info/InfoPage.tsx
// COMPLETO: Página de informações com design profissional e todos os detalhes do restaurante.
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { IRestaurantInfo } from '@zedobambu/shared-types';
import { Loader2, MapPin, Phone, Clock } from 'lucide-react';

// --- Função da API ---
const fetchRestaurantInfo = async (): Promise<IRestaurantInfo> => {
  const { data } = await apiClient.get('/v1/restaurant/info');
  return data.data;
};

// --- Componente Auxiliar ---
const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => (
    <div className="flex items-start">
        <Icon className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
        <div className="ml-4">
            <p className="font-semibold text-gray-800">{label}</p>
            <p className="text-gray-600">{value || 'Não informado'}</p>
        </div>
    </div>
);

// --- Componente Principal ---
const InfoPage: React.FC = () => {
  const { data: info, isLoading, isError } = useQuery<IRestaurantInfo, Error>({
    queryKey: ['restaurantInfo'],
    queryFn: fetchRestaurantInfo,
  });
  
  if (isLoading) return <div className="text-center p-10"><Loader2 className="animate-spin h-8 w-8 mx-auto text-orange-500" /></div>;
  if (isError || !info) return <div className="text-center p-10 text-red-600">Erro ao carregar as informações do restaurante.</div>;

  const fullAddress = info.address 
    ? `${info.address.street}, ${info.address.number} - ${info.address.neighborhood}, ${info.address.city} - ${info.address.state}`
    : info.name; // Fallback para o nome do restaurante se o endereço não estiver completo

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

  const daysOfWeek = [
    { key: 'monday', label: 'Segunda-feira' }, { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' }, { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' }, { key: 'saturday', label: 'Sábado' }, { key: 'sunday', label: 'Domingo' }
  ] as const;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-orange-700">{info.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card de Contacto e Endereço */}
        <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">Contacto e Endereço</h2>
           <div className="space-y-4">
              <InfoRow icon={Phone} label="Telefone" value={info.phone} />
              <InfoRow icon={MapPin} label="Endereço" value={fullAddress} />
           </div>
        </div>
        
        {/* Card de Horário de Funcionamento */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">Horário de Funcionamento</h2>
          <div className="space-y-3">
              {daysOfWeek.map(day => (
                  <div key={day.key} className="flex justify-between items-center text-sm">
                      <p className="text-gray-700">{day.label}</p>
                      <p className="font-semibold text-gray-800">{info.openingHours?.[day.key] || 'Não informado'}</p>
                  </div>
              ))}
          </div>
        </div>
      </div>
      
      {/* Mapa */}
      <div className="mt-8 rounded-lg shadow-md overflow-hidden">
        <iframe
          title="Localização do Restaurante"
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
