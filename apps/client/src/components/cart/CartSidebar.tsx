import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';

export const CartSidebar: React.FC = () => {
  const { isCartOpen, closeCart, cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

  return (
    <Transition.Root show={isCartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeCart}>
        <Transition.Child as={Fragment} enter="ease-in-out duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-500" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-500 sm:duration-700" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leaveFrom="translate-x-0" leaveTo="translate-x-full">
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 flex items-center">
                          <ShoppingCart className="h-6 w-6 mr-2" /> Carrinho de Compras
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button type="button" className="relative -m-2 p-2 text-gray-400 hover:text-gray-500" onClick={closeCart}><X className="h-6 w-6" /></button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {cartItems.length === 0 ? (
                            <div className="text-center py-10">
                              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                              <p className="mt-4 text-gray-500">O seu carrinho está vazio.</p>
                              <button onClick={closeCart} className="mt-6 text-orange-600 hover:text-orange-500 font-semibold">Continuar a comprar</button>
                            </div>
                          ) : (
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                              {cartItems.map((item) => (
                                <li key={item.id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img src={item.imageUrl || `https://ui-avatars.com/api/?name=${item.name}&background=random`} alt={item.name} className="h-full w-full object-cover object-center" />
                                  </div>
                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3><Link to={`/product/${item.id}`}>{item.name}</Link></h3>
                                        <p className="ml-4">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                                      </div>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center border border-gray-200 rounded">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-500 hover:text-gray-700"><Minus className="h-4 w-4" /></button>
                                        <p className="px-3 text-gray-900">{item.quantity}</p>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-500 hover:text-gray-700"><Plus className="h-4 w-4" /></button>
                                      </div>
                                      <div className="flex">
                                        <button onClick={() => removeFromCart(item.id)} type="button" className="font-medium text-red-600 hover:text-red-500 flex items-center">
                                          <Trash2 className="h-4 w-4 mr-1" /> Remover
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {cartItems.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>R$ {cartTotal.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">Taxas e entrega serão calculadas no checkout.</p>
                        <div className="mt-6">
                          <a href="#" className="flex items-center justify-center rounded-md border border-transparent bg-orange-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-orange-700">
                            Finalizar Compra
                          </a>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>ou <button type="button" className="font-medium text-orange-600 hover:text-orange-500" onClick={closeCart}>Continuar a Comprar<span aria-hidden="true"> &rarr;</span></button></p>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};