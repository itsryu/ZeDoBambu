import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

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
                            <p className="text-center text-gray-500">O seu carrinho está vazio.</p>
                          ) : (
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                              {cartItems.map((item) => (
                                <li key={item.id} className="flex py-6">
                                  {/* ... (código para renderizar cada item do carrinho) ... */}
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