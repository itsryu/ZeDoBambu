import React, { useState, useEffect, Fragment } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { IUser, IAdminUpdateUserDto } from '@zedobambu/shared-types';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminUpdateUserSchema } from '@zedobambu/shared-validation';
import { Trash2, Edit, Loader2, AlertTriangle, MoreVertical, Search, User as UserIcon, Phone, MapPin, Building, Home, Landmark, CheckCircle, XCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Menu, Transition, Switch } from '@headlessui/react';
import InputMask from 'react-input-mask';
import { fetchAddressByCep } from '@/services/viaCep';
import { clsx } from 'clsx';
import { useAuth } from '@/contexts/AuthContext';

// --- Funções da API ---
const fetchUsers = async (searchTerm: string): Promise<IUser[]> => {
  const { data } = await apiClient.get('/v1/users', { params: { search: searchTerm } });
  return data.data;
};

const updateUser = async ({ id, data }: { id: string; data: IAdminUpdateUserDto }) => {
  const response = await apiClient.put(`/v1/users/${id}`, data);
  return response.data;
};

const deleteUser = async (id: string) => {
  await apiClient.delete(`/v1/users/${id}`);
};

// --- Hook de Debounce para a Busca ---
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
};

// --- Componentes Auxiliares ---
const InputField = ({ id, label, icon: Icon, registerProps, error, ...props }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      {Icon && <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><Icon className="h-5 w-5 text-gray-400" /></div>}
      <input id={id} {...registerProps} {...props} className={clsx("block w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm", Icon && "pl-10")} />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

// --- Componente Principal ---
const UserManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const [userToAction, setUserToAction] = useState<IUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: users, isLoading, isError } = useQuery<IUser[], Error>({
    queryKey: ['users', debouncedSearchTerm],
    queryFn: () => fetchUsers(debouncedSearchTerm),
    placeholderData: keepPreviousData,
  });

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<IAdminUpdateUserDto>({
    resolver: zodResolver(adminUpdateUserSchema),
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData<IUser[]>(['users', debouncedSearchTerm]);
      queryClient.setQueryData<IUser[]>(['users', debouncedSearchTerm], old =>
        old?.map(user => user.id === newData.id ? { 
          ...user, 
          ...newData.data, 
          address: {
            street: (newData.data.address?.street ?? user.address?.street) ?? '',
            number: (newData.data.address?.number ?? user.address?.number) ?? '',
            complement: (newData.data.address?.complement ?? user.address?.complement) ?? '',
            neighborhood: (newData.data.address?.neighborhood ?? user.address?.neighborhood) ?? '',
            city: (newData.data.address?.city ?? user.address?.city) ?? '',
            state: (newData.data.address?.state ?? user.address?.state) ?? '',
            zip: (newData.data.address?.zip ?? user.address?.zip) ?? '',
          }
        } : user) ?? []
      );
      setIsEditModalOpen(false);
      return { previousUsers };
    },
    onError: (err: Error, newData, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users', debouncedSearchTerm], context.previousUsers);
      }
      showNotification('error', `Falha ao atualizar: ${err.message}`);
    },
    onSuccess: () => {
      showNotification('success', 'Utilizador atualizado com sucesso!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDeleteModalOpen(false);
      showNotification('success', 'Utilizador apagado com sucesso!');
    },
    onError: (err: Error) => {
      showNotification('error', `Falha ao apagar: ${err.message}`);
    }
  });

  const openEditModal = (user: IUser) => {
    setUserToAction(user);
    reset({
      name: user.name,
      role: user.role,
      disabled: user.disabled,
      phone: user.phone || '',
      avatarUrl: user.avatarUrl || '',
      address: user.address,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit: SubmitHandler<IAdminUpdateUserDto> = (data) => {
    if (!userToAction) return;
    const changedData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== undefined && value !== '')
    );
    if (Object.keys(changedData).length > 0) {
      updateUserMutation.mutate({ id: userToAction.id, data: changedData });
    } else {
      setIsEditModalOpen(false);
    }
  };

  const openDeleteModal = (user: IUser) => {
    setUserToAction(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!userToAction) return;
    deleteMutation.mutate(userToAction.id);
  };

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

  return (
    <div>
      {notification && (
        <div className={`fixed top-5 right-5 z-50 p-4 rounded-md shadow-lg flex items-center text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.type === 'success' ? <CheckCircle className="mr-3" /> : <AlertTriangle className="mr-3" />}
          {notification.message}
        </div>
      )}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Gerir Utilizadores</h1>

      <div className="mb-4">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><Search className="h-5 w-5 text-gray-400" /></div>
          <input type="text" placeholder="Buscar por nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full max-w-sm rounded-md border-gray-300 pl-10 focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilizador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
                <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (<tr><td colSpan={5} className="text-center p-6"><Loader2 className="animate-spin inline-block text-orange-500" /></td></tr>)
                : isError ? (<tr><td colSpan={5} className="text-center p-6 text-red-500">Erro ao carregar utilizadores.</td></tr>)
                  : users?.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx('px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                          user.role === 'admin' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                        )}>
                          {user.role === 'admin' ? 'Admin' : 'Cliente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.disabled
                          ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inativo</span>
                          : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Ativo</span>
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {user.id !== currentUser?.firebaseUid ? (
                          <Menu as="div" className="relative inline-block text-left">
                            <Menu.Button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                              <MoreVertical className="h-5 w-5" />
                            </Menu.Button>
                            <Transition as={Fragment}>
                              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                <div className="py-1">
                                  <Menu.Item>{({ active }) => (<button onClick={() => openEditModal(user)} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}> <Edit className="mr-2 h-5 w-5" /> Editar </button>)}</Menu.Item>
                                  <Menu.Item>{({ active }) => (<button onClick={() => openDeleteModal(user)} className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-red-600`}> <Trash2 className="mr-2 h-5 w-5" /> Apagar </button>)}</Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        ) : (<span className="text-xs text-gray-400 italic pr-4">A sua conta</span>)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Editar Utilizador: ${userToAction?.name}`}>
        <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
          <InputField id="name" label="Nome Completo" icon={UserIcon} registerProps={register('name')} error={errors.name} type="text" />
          <Controller name="phone" control={control} render={({ field }) => (
            <InputMask mask="(99) 99999-9999" value={field.value || ''} onChange={field.onChange}>
              {(inputProps: any) => <InputField id="phone" label="Telefone" icon={Phone} registerProps={inputProps} error={errors.phone} />}
            </InputMask>
          )} />
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
            <select {...register('role')} id="role" className="block w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm">
              <option value="customer">Cliente</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center">
            <Controller name="disabled" control={control} render={({ field }) => (
              <Switch checked={!!field.value} onChange={field.onChange} className={`${field.value ? 'bg-red-600' : 'bg-green-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
                <span className={`${field.value ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
              </Switch>
            )} />
            <label htmlFor="disabled" className="ml-3 block text-sm text-gray-900">{control._getWatch('disabled') ? 'Conta Desativada' : 'Conta Ativa'}</label>
          </div>

          <fieldset className='space-y-4 border-t pt-4'>
            <legend className='text-md font-medium text-gray-900'>Endereço</legend>
            <div className="relative sm:col-span-3">
              <label htmlFor="address.zip" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><MapPin className="h-5 w-5 text-gray-400" /></div>
                <Controller name="address.zip" control={control} render={({ field }) => (
                  <InputMask mask="99999-999" value={field.value || ''} onChange={field.onChange} onBlur={handleCepBlur}>
                    {(inputProps: any) => <input {...inputProps} id="address.zip" placeholder="00000-000" className="block w-full rounded-md border-gray-300 pl-10 focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />}
                  </InputMask>
                )} />
                {isCepLoading && <Loader2 className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />}
              </div>
              {errors.address?.zip && <p className="text-red-500 text-xs mt-1">{errors.address.zip.message}</p>}
            </div>
            <InputField id="address.street" label="Rua" icon={Home} registerProps={register('address.street')} error={errors.address?.street} type="text" />
            <InputField id="address.number" label="Número" icon={Landmark} registerProps={register('address.number')} error={errors.address?.number} type="text" />
            <InputField id="address.complement" label="Complemento" icon={Building} registerProps={register('address.complement')} error={errors.address?.complement} type="text" />
            <InputField id="address.neighborhood" label="Bairro" icon={MapPin} registerProps={register('address.neighborhood')} error={errors.address?.neighborhood} type="text" />
            <InputField id="address.city" label="Cidade" icon={MapPin} registerProps={register('address.city')} error={errors.address?.city} type="text" />
            <InputField id="address.state" label="Estado (UF)" icon={MapPin} registerProps={register('address.state')} error={errors.address?.state} type="text" maxLength={2} />
          </fieldset>

          <div className="pt-4 flex justify-end space-x-2">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
            <button type="submit" disabled={updateUserMutation.isPending} className="px-4 py-2 text-sm font-medium bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-orange-300 flex items-center">
              {updateUserMutation.isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Guardar Alterações
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Exclusão" size="sm">
        <div className="p-4 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-sm text-gray-600">Tem a certeza de que deseja apagar o utilizador <span className="font-semibold">{userToAction?.name}</span>? Esta ação não pode ser desfeita.</p>
          <div className="mt-6 flex justify-center space-x-3">
            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">Cancelar</button>
            <button type="button" onClick={confirmDelete} disabled={deleteMutation.isPending} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 flex items-center">
              {deleteMutation.isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Apagar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;