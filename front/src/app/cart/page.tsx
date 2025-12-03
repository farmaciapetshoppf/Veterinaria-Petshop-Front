'use client';

import WorkInProgress from "../components/WorkInProgress/WorkInProgress"
import cart from "../../assets/cart.png"
import perrocompras from "../../assets/perrocompras.png"
import perrocompra from "../../assets/perrocompra.png"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useCart } from "@/src/context/CartContext"
import { useState } from "react"
import { IProduct } from "../interfaces/product.interface"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/context/AuthContext"
import { createOrder } from "@/src/services/order.services"
import { toast } from "sonner"
import Image from "next/image"
import { XMarkIcon } from "@heroicons/react/16/solid"


function CartPage() {

  const [open, setOpen] = useState(true)
const {
   cartItems,
    removeFromCart,
    getTotal,
    clearCart,
    getIdItems,
    getItemsCount
} = useCart();

const itemsCount = getItemsCount();

const handleCheckout = async () => {
  // Si el usuario no está autenticado, mostrar un toast de error y redirigir al login
  if (!userData?.token || !userData?.user?.id) {
    // mostrar toast de error rojo y redirigir a login
    toast.custom(() => (
      <div className="flex items-center gap-3 rounded-md border border-red-800 bg-red-100 px-4 py-2 text-red-900">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <div className="text-sm font-medium">Debes iniciar sesión para completar la compra</div>
      </div>
    ), { duration: 4000 });
    return getLogin();
  }

  try {
    // Crear array de items con productId y quantity
    const orderItems = cartItems.map(item => ({
      productId: String(item.id),
      quantity: 1 // Por ahora cada producto tiene cantidad 1
    }));
    
    await createOrder(orderItems, String(userData.user.id), userData.token);
    clearCart();
    // Mostrar toast de éxito al completar la compra con estilo verde
    toast.custom(() => (
      <div className="flex items-center gap-3 rounded-md border border-green-800 bg-green-100 px-4 py-2 text-green-900">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l3 3L15 6" />
        </svg>
        <div className="text-sm font-medium">Compra exitosa</div>
      </div>
    ), { duration: 4000 });
    
    setOpen(false);
    router.push('/dashboard');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    toast.custom(() => (
      <div className="flex flex-col gap-1 rounded-md border border-red-800 bg-red-100 px-4 py-2 text-red-900">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <div className="text-sm font-medium">Error al crear la orden</div>
        </div>
        <div className="text-xs text-red-800">{message}</div>
      </div>
    ), { duration: 6000 });
  }
};
const items: IProduct[] = Array.isArray(cartItems) ? (cartItems as IProduct[]) : [];
const {userData} = useAuth();
const router = useRouter();

// getLogin dentro del componente para poder usar router.push con redirect
const getLogin = () => {
  // redirigir preservando la ruta de retorno
  router.push('/auth/login?redirect=/cart');
};
return (
    <div className="relative min-h-screen pt-20">
      {/* Imagen de fondo con degradado */}
      <div className="fixed inset-0 pt-20 z-0">
        <div className="absolute inset-0 bg-linear-to-r from-amber-100 via-amber-50 to-transparent" />
        <Image
          src={perrocompra}
          alt="Perro con bolsa de compras"
          fill
          className="object-contain object-left"
          priority
        />
      </div>

      {/* Botón flotante para reabrir el carrito cuando está cerrado */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-8 right-8 z-50 bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Abrir carrito"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {itemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
              {itemsCount}
            </span>
          )}
        </button>
      )}

      {/* Dialog del carrito */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed top-25 bottom-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full border-amber-200 border-2 mb-1 mr-2 rounded-2xl flex-col overflow-y-auto bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-lg font-medium text-gray-900">Shopping cart</DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            router.push('/');
                          }}
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root border-amber-200">
                        <ul role="list" className="-my-6 divide-y border-amber-200 divide-gray-200">
                          {items.length === 0 ? (
                            <li className="py-6 text-gray-600">Tu carrito está vacío</li>
                            ) : (
                            items.map((item: IProduct) => (
                              <li key={item.id} className="flex py-6">
                                <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                                  <Image
                                   alt={item.name}
                                    src={(item.image ) ? item.image : (process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}${item.image ?? ''}` : '/next.svg')}
                                    width={96}
                                    height={96}
                                    loading="lazy"
                                    className="object-cover"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href={`/product/${item.id}`}>{item.name}</a>
                                      </h3>
                                      <p className="ml-4">${Number(item.price).toLocaleString()}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-end text-sm">
                                    <button
                                      type="button"
                                      onClick={() => removeFromCart(item.id)}
                                      className="font-medium text-red-600 rounded-md px-2 py-1  hover:bg-red-600 hover:text-white  transition-colors duration-200"
                                    >
                                      Quitar
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>${Number(getTotal()).toLocaleString()}</p>
                      
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                      <button
                        onClick={!userData ? getLogin : handleCheckout}
                        className="flex items-center justify-center rounded-md border border-transparent bg-amber-400 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-red-600"
                      >
                       {!userData ? 'Inicia sesión para continuar' : 'Proceder al pago'} 
                      </button>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <div>
                        or{' '}
                        <button
                          type="button"
                          onClick={clearCart}
                          className="font-medium text-amber-500 hover:text-red-600"
                        >
                         Vaciar carrito 
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
export default CartPage