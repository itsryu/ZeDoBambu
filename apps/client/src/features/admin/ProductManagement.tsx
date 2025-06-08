import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { IProduct, ICreateProductDto, IUpdateProductDto } from '@zedobambu/shared-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema, updateProductSchema } from '@zedobambu/shared-validation';
import { Loader2, Trash2, Edit, PlusCircle, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';


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

  const handleCreateSubmit = (data: ICreateProductDto) => {
    createMutation.mutate(data);
  };

  const openEditModal = (product: IProduct) => {
    setSelectedProduct(product);
    resetEdit(product);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (data: IUpdateProductDto) => {
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
          <button type="submit" disabled={createMutation.isPending} className="col-span-1 md:col-span-2 justify-self-start inline-flex items-center py-2 px-4 ...">
            {createMutation.isPending && <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />}
            {createMutation.isPending ? 'A Adicionar...' : 'Adicionar Produto'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 text-gray-700">Produtos Existentes</h2>
        {isLoadingProducts ? <p className="p-6">A carregar produtos...</p> : (
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
                    <button onClick={() => openEditModal(product)} className="text-orange-600 hover:text-orange-900"><Edit className="w-5 h-5" /></button>
                    <button onClick={() => openDeleteModal(product)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Produto">
        <form onSubmit={handleSubmitEdit(handleEditSubmit)} className="space-y-4">
          <button type="submit" disabled={updateMutation.isPending} className="w-full inline-flex justify-center rounded-md ...">
            {updateMutation.isPending ? 'A Guardar...' : 'Guardar Alterações'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Exclusão" size="sm">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-sm text-gray-600">Tem a certeza de que deseja apagar o produto "{selectedProduct?.name}"? Esta ação não pode ser revertida.</p>
          <div className="mt-6 flex justify-center space-x-3">
            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 rounded-md ...">Cancelar</button>
            <button type="button" onClick={confirmDelete} disabled={deleteMutation.isPending} className="px-4 py-2 rounded-md bg-red-600 text-white ...">
              {deleteMutation.isPending ? 'A apagar...' : 'Apagar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductManagement;