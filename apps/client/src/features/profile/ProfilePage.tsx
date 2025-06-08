import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { IUser, IUpdateUserProfileDto } from '@zedobambu/shared-types';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserProfileSchema } from '@zedobambu/shared-validation';
import { User, Mail, Phone, MapPin, Building, Home, Landmark, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import InputMask from 'react-input-mask';
import { fetchAddressByCep } from '@/services/viaCep';

const fetchUserProfile = async (): Promise<IUser> => {
  const { data } = await apiClient.get('/v1/users/me');
  return data.data;
};

const updateUserProfile = async (profileData: IUpdateUserProfileDto): Promise<IUser> => {
  const { data } = await apiClient.put('/v1/users/me', profileData);
  return data.data;
};

const InputField = ({ id, label, icon: Icon, registerProps, error, ...props }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
        <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input id={id} {...registerProps} {...props} className="block w-full rounded-md border-gray-300 pl-10 focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { watch } = useForm();
  const queryClient = useQueryClient();
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isCepLoading, setIsCepLoading] = useState(false);

  const { data: userProfile, isLoading, isError } = useQuery<IUser, Error>({
    queryKey: ['userProfile', currentUser?.firebaseUid],
    queryFn: fetchUserProfile,
    enabled: !!currentUser,
  });

  const { register, handleSubmit, formState: { errors, isDirty }, reset, setValue, control } = useForm<IUpdateUserProfileDto>({
    resolver: zodResolver(updateUserProfileSchema),
  });

  const avatarUrlValue = watch('avatarUrl');

  const handleCepBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cep = event.target.value;
    if (cep && cep.replace(/\D/g, '').length === 8) {
      setIsCepLoading(true);
      const addressData = await fetchAddressByCep(cep);
      if (addressData) {
        setValue('address.street', addressData.logradouro, { shouldValidate: true, shouldDirty: true });
        setValue('address.neighborhood', addressData.bairro, { shouldValidate: true, shouldDirty: true });
        setValue('address.city', addressData.localidade, { shouldValidate: true, shouldDirty: true });
        setValue('address.state', addressData.uf, { shouldValidate: true, shouldDirty: true });
      }
      setIsCepLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile) {
      reset({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        avatarUrl: userProfile.avatarUrl || '',
        address: userProfile.address || { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip: '' },
      });
    }
  }, [userProfile, reset]);

  const profileUpdateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedData) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', currentUser?.firebaseUid] });
      setNotification({ type: 'success', message: 'Perfil atualizado com sucesso!' });
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (error) => {
      setNotification({ type: 'error', message: `Erro ao atualizar: ${error.message}` });
      setTimeout(() => setNotification(null), 3000);
    }
  });

  const onSubmit: SubmitHandler<IUpdateUserProfileDto> = (data) => {
    profileUpdateMutation.mutate(data);
  };

  if (isLoading) return <div className="text-center p-10 flex justify-center items-center"><Loader2 className="animate-spin h-8 w-8 text-orange-500" /></div>;
  if (isError) return <div className="text-center p-10 text-red-600">Erro ao carregar o perfil.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {notification && (
        <div className={`fixed top-5 right-5 z-50 p-4 rounded-md shadow-lg flex items-center text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.type === 'success' ? <CheckCircle className="mr-3" /> : <AlertCircle className="mr-3" />}
          {notification.message}
        </div>
      )}
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Meu Perfil</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">Informações Pessoais</h2>
          <div className="space-y-6">
            <div className='flex items-center space-x-6'>
              <img src={avatarUrlValue || userProfile?.avatarUrl || `https://ui-avatars.com/api/?name=${userProfile?.name || 'U'}&background=random`}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover ring-2 ring-offset-2 ring-orange-400"
                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${userProfile?.name || 'U'}&background=random` }}
              />
              <div className="flex-grow">
                <InputField id="avatarUrl" label="URL do Avatar" icon={User} registerProps={register('avatarUrl')} error={errors.avatarUrl} type="url" placeholder="[https://exemplo.com/foto.jpg](https://exemplo.com/foto.jpg)" />
              </div>
            </div>
            <InputField id="name" label="Nome Completo" icon={User} registerProps={register('name')} error={errors.name} type="text" placeholder="Seu nome completo" />
            <InputField id="email" label="Email" icon={Mail} value={currentUser?.email || ''} disabled type="email" />
            <Controller name="phone" control={control} render={({ field }) => (
              <InputMask mask="(99) 99999-9999" value={field.value} onChange={field.onChange}>
                {(inputProps: any) => <InputField id="phone" label="Telefone" icon={Phone} registerProps={inputProps} error={errors.phone} placeholder="(61) 99201-3036" />}
              </InputMask>
            )} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">Endereço de Entrega</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="address.zip" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Controller name="address.zip" control={control} render={({ field }) => (
                  <InputMask mask="99999-999" value={field.value} onChange={field.onChange} onBlur={handleCepBlur}>
                    {(inputProps: any) => <input {...inputProps} id="address.zip" placeholder="00000-000" className="block w-full rounded-md border-gray-300 pl-10 focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />}
                  </InputMask>
                )} />
                {isCepLoading && <Loader2 className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />}
              </div>
              {errors.address?.zip && <p className="text-red-500 text-xs mt-1">{errors.address.zip.message}</p>}
            </div>
            <div className="sm:col-span-3"></div>
            <div className="sm:col-span-4">
              <InputField id="address.street" label="Rua" icon={Home} registerProps={register('address.street')} error={errors.address?.street} type="text" placeholder="Av. Principal" />
            </div>
            <div className="sm:col-span-2">
              <InputField id="address.number" label="Número" icon={Landmark} registerProps={register('address.number')} error={errors.address?.number} type="text" placeholder="123" />
            </div>
            <div className="sm:col-span-6">
              <InputField id="address.complement" label="Complemento (Opcional)" icon={Building} registerProps={register('address.complement')} error={errors.address?.complement} type="text" placeholder="Apto 101, Bloco B" />
            </div>
            <div className="sm:col-span-3">
              <InputField id="address.neighborhood" label="Bairro" icon={MapPin} registerProps={register('address.neighborhood')} error={errors.address?.neighborhood} type="text" placeholder="Centro" />
            </div>
            <div className="sm:col-span-3">
              <InputField id="address.city" label="Cidade" icon={MapPin} registerProps={register('address.city')} error={errors.address?.city} type="text" placeholder="Sua Cidade" />
            </div>
            <div className="sm:col-span-3">
              <InputField id="address.state" label="Estado (UF)" icon={MapPin} registerProps={register('address.state')} error={errors.address?.state} type="text" placeholder="SP" maxLength={2} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={profileUpdateMutation.isPending || !isDirty} className="inline-flex items-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all">
            {profileUpdateMutation.isPending && <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />}
            {profileUpdateMutation.isPending ? 'A guardar...' : 'Guardar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;