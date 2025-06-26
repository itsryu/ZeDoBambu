import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { IProduct, ICreateProductDto, IUpdateProductDto } from '@zedobambu/shared-types';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema, updateProductSchema } from '@zedobambu/shared-validation';
import { Loader2, Trash2, Edit, PlusCircle, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { clsx } from 'clsx';

const fetchProducts = async (): Promise<IProduct[]> => {
  const { data } = await apiClient.get('/v1/products');
  return data.data;
};

const createProduct = async (newProduct: ICreateProductDto): Promise<IProduct> => {
  const { data } = await apiClient.post('/v1/products', newProduct);
  return data.data;
};

const updateProduct = async ({ id, productData }: { id: string, productData: IUpdateProductDto }): Promise<IProduct> => {
  const { data } = await apiClient.put(`/v1/products/${id}`, productData);
  return data.data;
};

const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/products/${id}`);
};

// --- Componente Auxiliar ---
const InputField = ({ id, label, registerProps, error, ...props }: any) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} {...registerProps} {...props} className={clsx("block w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm")} />
        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
);

const TextareaField = ({ id, label, registerProps, error, ...props }: any) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea id={id} {...registerProps} {...props} className="block w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
);


// --- Componente Principal ---
const ProductManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const { data: products, isLoading: isLoadingProducts } = useQuery<IProduct[], Error>({
    queryKey: ['adminProducts'],
    queryFn: fetchProducts,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ICreateProductDto>({
    resolver: zodResolver(createProductSchema),
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: editErrors } } = useForm<IUpdateProductDto>({
    resolver: zodResolver(updateProductSchema),
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsEditModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsDeleteModalOpen(false);
    },
  });

  const handleCreateSubmit: SubmitHandler<ICreateProductDto> = (data) => {
    createMutation.mutate(data);
  };

  const openEditModal = (product: IProduct) => {
    setSelectedProduct(product);
    resetEdit(product);
    setIsEditModalOpen(true);
  };
  
  const handleEditSubmit: SubmitHandler<IUpdateProductDto> = (data) => {
    if (!selectedProduct) return;
    updateMutation.mutate({ id: selectedProduct.id, productData: data });
  };
  
  const openDeleteModal = (product: IProduct) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedProduct) return;
    deleteMutation.mutate(selectedProduct.id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Gerir Cardápio</h1>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700"><PlusCircle className="w-6 h-6 mr-2" /> Adicionar Novo Produto</h2>
        <form onSubmit={handleSubmit(handleCreateSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField id="name" label="Nome do Produto" registerProps={register('name')} error={errors.name} />
          <InputField id="price" label="Preço" type="number" step="0.01" registerProps={register('price')} error={errors.price} />
          <div className="md:col-span-2">
            <TextareaField id="description" label="Descrição" registerProps={register('description')} error={errors.description} />
          </div>
          <InputField id="categoryId" label="ID da Categoria" registerProps={register('categoryId')} error={errors.categoryId} />
          <InputField id="imageUrl" label="URL da Imagem (Opcional)" registerProps={register('imageUrl')} error={errors.imageUrl} />
          <div className="md:col-span-2 justify-self-start">
            <button type="submit" disabled={createMutation.isPending} className="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300">
               {createMutation.isPending && <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />}
               {createMutation.isPending ? 'A Adicionar...' : 'Adicionar Produto'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 text-gray-700">Produtos Existentes</h2>
        {isLoadingProducts ? <p className="p-6 text-center">A carregar produtos...</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products?.map(product => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{product.name}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">R$ {product.price.toFixed(2)}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => openEditModal(product)} className="text-orange-600 hover:text-orange-900"><Edit className="w-5 h-5"/></button>
                      <button onClick={() => openDeleteModal(product)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Produto">
        <form onSubmit={handleSubmitEdit(handleEditSubmit)} className="space-y-4 mt-4">
            <InputField id="edit-name" label="Nome do Produto" registerProps={registerEdit('name')} error={editErrors.name} />
            <InputField id="edit-price" label="Preço" type="number" step="0.01" registerProps={registerEdit('price')} error={editErrors.price} />
            <TextareaField id="edit-description" label="Descrição" registerProps={registerEdit('description')} error={editErrors.description} />
            <InputField id="edit-categoryId" label="ID da Categoria" registerProps={registerEdit('categoryId')} error={editErrors.categoryId} />
            <InputField id="edit-imageUrl" label="URL da Imagem (Opcional)" registerProps={registerEdit('imageUrl')} error={editErrors.imageUrl} />
            <div className="pt-4 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                <button type="submit" disabled={updateMutation.isPending} className="px-4 py-2 text-sm font-medium bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-orange-300 flex items-center">
                    {updateMutation.isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    Guardar Alterações
                </button>
            </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Exclusão" size="sm">
         <div className="p-4 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-sm text-gray-600">Tem a certeza de que deseja apagar o produto "{selectedProduct?.name}"? Esta ação não pode ser revertida.</p>
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

export default ProductManagement;