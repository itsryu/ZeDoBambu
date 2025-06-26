import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { IRestaurantInfo, IUpdateRestaurantDto } from '@zedobambu/shared-types';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateRestaurantInfoSchema } from '@zedobambu/shared-validation';
import { Loader2 } from 'lucide-react';

const fetchRestaurantInfo = async (): Promise<IRestaurantInfo> => {
  const { data } = await apiClient.get('/v1/restaurant/info');
  return data.data;
};

const updateRestaurantInfo = async (infoData: IUpdateRestaurantDto): Promise<IRestaurantInfo> => {
  const { data } = await apiClient.put('/v1/restaurant/info', infoData);
  return data.data;
};

const RestaurantManagement: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: info, isLoading } = useQuery<IRestaurantInfo, Error>({
    queryKey: ['restaurantInfo'],
    queryFn: fetchRestaurantInfo,
  });

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<IUpdateRestaurantDto>({
    resolver: zodResolver(updateRestaurantInfoSchema),
  });

  useEffect(() => {
    if (info) {
      reset(info);
    }
  }, [info, reset]);

  const mutation = useMutation({
    mutationFn: updateRestaurantInfo,
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['restaurantInfo'], updatedData);
      // Opcional: mostrar uma notificação de sucesso.
    },
  });

  const onSubmit: SubmitHandler<IUpdateRestaurantDto> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Gerir Informações do Restaurante</h1>
      {isLoading ? <p>A carregar...</p> : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
            {/* Formulário para editar nome, CNPJ, telefone, endereço e horários */}
            <button type="submit" disabled={mutation.isPending || !isDirty} className="...">
                {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Guardar Alterações'}
            </button>
        </form>
      )}
    </div>
  );
};

export default RestaurantManagement;