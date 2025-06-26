import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { IRestaurantInfo, IUpdateRestaurantDto } from '@zedobambu/shared-types';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateRestaurantInfoSchema } from '@zedobambu/shared-validation';
import { Loader2, Building2, Phone, MapPin, Home, Landmark, CheckCircle, AlertCircle, Building } from 'lucide-react';
import { fetchAddressByCep } from '@/services/viaCep';
import InputMask from 'react-input-mask';

// --- Funções da API ---
const fetchRestaurantInfo = async (): Promise<IRestaurantInfo> => {
  const { data } = await apiClient.get('/v1/restaurant/info');
  return data.data;
};

const updateRestaurantInfo = async (infoData: IUpdateRestaurantDto): Promise<IRestaurantInfo> => {
  const { data } = await apiClient.put('/v1/restaurant/info', infoData);
  return data.data;
};

const InputField = ({ id, label, icon: Icon, registerProps, error, ...props }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      {Icon && <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><Icon className="h-5 w-5 text-gray-400" /></div>}
      <input id={id} {...registerProps} {...props} className={`block w-full rounded-md border-gray-300 ${Icon ? 'pl-10' : 'px-3'} focus:border-orange-500 focus:ring-orange-500 sm:text-sm`} />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

const daysOfWeek = [
  { key: 'monday', label: 'Segunda-feira' }, { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' }, { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' }, { key: 'saturday', label: 'Sábado' }, { key: 'sunday', label: 'Domingo' }
] as const;

const RestaurantManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isCepLoading, setIsCepLoading] = useState(false);

  const { data: info, isLoading } = useQuery<IRestaurantInfo, Error>({
    queryKey: ['restaurantInfo'],
    queryFn: fetchRestaurantInfo,
  });

  const { register, handleSubmit, reset, formState: { errors, isDirty }, setValue, control } = useForm<IUpdateRestaurantDto>({
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
      setNotification({ type: 'success', message: 'Informações atualizadas com sucesso!' });
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (error) => {
        setNotification({ type: 'error', message: `Erro ao atualizar: ${error.message}`});
        setTimeout(() => setNotification(null), 3000);
    }
  });

  const handleCepBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cep = event.target.value;
    if (cep && cep.replace(/\D/g, '').length === 8) {
      setIsCepLoading(true);
      const addressData = await fetchAddressByCep(cep);
      if (addressData) {
        setValue('address.street', addressData.logradouro, { shouldDirty: true, shouldValidate: true });
        setValue('address.neighborhood', addressData.bairro, { shouldDirty: true, shouldValidate: true });
        setValue('address.city', addressData.localidade, { shouldDirty: true, shouldValidate: true });
        setValue('address.state', addressData.uf, { shouldDirty: true, shouldValidate: true });
      }
      setIsCepLoading(false);
    }
  };
  
  const onSubmit: SubmitHandler<IUpdateRestaurantDto> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
        {notification && (
            <div className={`fixed top-5 right-5 z-50 p-4 rounded-md shadow-lg flex items-center text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                {notification.type === 'success' ? <CheckCircle className="mr-3" /> : <AlertCircle className="mr-3" />}
                {notification.message}
            </div>
        )}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Gerir Informações do Restaurante</h1>
      
      {isLoading ? <div className="text-center p-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-500" /></div> : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Informações Gerais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField id="name" label="Nome do Restaurante" icon={Building2} registerProps={register('name')} error={errors.name} />
              <Controller name="cnpj" control={control} render={({ field }) => (
                <InputMask mask="99.999.999/9999-99" value={field.value} onChange={field.onChange} onBlur={field.onBlur}>
                  {(inputProps: any) => <InputField id="cnpj" label="CNPJ" icon={Landmark} registerProps={inputProps} error={errors.cnpj} />}
                </InputMask>
              )} />
              <Controller name="phone" control={control} render={({ field }) => (
                <InputMask mask="(99) 99999-9999" value={field.value} onChange={field.onChange} onBlur={field.onBlur}>
                  {(inputProps: any) => <InputField id="phone" label="Telefone de Contacto" icon={Phone} registerProps={inputProps} error={errors.phone} />}
                </InputMask>
              )} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Endereço</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
              <div className="sm:col-span-2 relative">
                <label htmlFor="address.zip" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><MapPin className="h-5 w-5 text-gray-400" /></div>
                  <Controller name="address.zip" control={control} render={({ field }) => (
                    <InputMask mask="99999-999" value={field.value || ''} onChange={field.onChange} onBlur={handleCepBlur}>
                      {(inputProps: any) => <input {...inputProps} id="address.zip" className="block w-full rounded-md border-gray-300 pl-10 focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />}
                    </InputMask>
                  )} />
                  {isCepLoading && <Loader2 className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />}
                </div>
                {errors.address?.zip && <p className="text-red-500 text-xs mt-1">{errors.address.zip.message}</p>}
              </div>
              <div className="sm:col-span-4"><InputField id="address.street" label="Rua" icon={Home} registerProps={register('address.street')} error={errors.address?.street} /></div>
              <div className="sm:col-span-2"><InputField id="address.number" label="Número" icon={Landmark} registerProps={register('address.number')} error={errors.address?.number} /></div>
              <div className="sm:col-span-4"><InputField id="address.complement" label="Complemento" icon={Building} registerProps={register('address.complement')} error={errors.address?.complement} /></div>
              <div className="sm:col-span-2"><InputField id="address.neighborhood" label="Bairro" icon={MapPin} registerProps={register('address.neighborhood')} error={errors.address?.neighborhood} /></div>
              <div className="sm:col-span-2"><InputField id="address.city" label="Cidade" icon={MapPin} registerProps={register('address.city')} error={errors.address?.city} /></div>
              <div className="sm:col-span-2"><InputField id="address.state" label="Estado (UF)" icon={MapPin} registerProps={register('address.state')} error={errors.address?.state} maxLength={2} /></div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Horário de Funcionamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {daysOfWeek.map(day => (
                <InputField key={day.key} id={`openingHours.${day.key}`} label={day.label} registerProps={register(`openingHours.${day.key}`)} error={errors.openingHours?.[day.key]} placeholder="Ex: 18:00 - 23:00 ou Fechado" />
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={mutation.isPending || !isDirty} className="inline-flex items-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all">
              {mutation.isPending && <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />}
              {mutation.isPending ? 'A guardar...' : 'Guardar Alterações'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RestaurantManagement;
