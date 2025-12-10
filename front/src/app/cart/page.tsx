'use client';

import WorkInProgress from "../components/WorkInProgress/WorkInProgress"
import cart from "../../assets/cart.png"
import perrocompras from "../../assets/perrocompras.png"
import perrocompra from "../../assets/perrocompra.png"
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useCart } from "@/src/context/CartContext"
import { useEffect, useState, useRef } from "react"
import { IProduct } from "@/src/types"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/context/AuthContext"
import { createCheckout } from "@/src/services/order.services"
import { toast } from "sonner"
import Image from "next/image"
import { XMarkIcon } from "@heroicons/react/16/solid"
import MercadoPagoWallet from "../components/MercadoPagoWallet/MercadoPagoWallet"


function CartPage() {

  const [open, setOpen] = useState(true)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const hasSyncedRef = useRef(false)
  const syncPromiseRef = useRef<Promise<void> | null>(null)
const {
   cartItems,
    removeFromCart,
    updateQuantity,
    getTotal,
    clearCart,
    getIdItems,
    getItemsCount,
    loadCartFromBackend
} = useCart();

const itemsCount = getItemsCount();

const items: IProduct[] = Array.isArray(cartItems) ? (cartItems as IProduct[]) : [];
const {userData} = useAuth();
const router = useRouter();

// getLogin dentro del componente para poder usar router.push con redirect
const getLogin = () => {
  // redirigir preservando la ruta de retorno
  router.push('/auth/login?redirect=/cart');
};

// Cargar carrito después de definir userData
useEffect(() => {
  const syncCart = async () => {
    if (!userData?.user?.id) {
      console.log('⏭️ Usuario no autenticado, saltando sincronización');
      return;
    }

    // Evitar sincronización múltiple usando useRef
    if (hasSyncedRef.current) {
      console.log('⏭️ Ya se sincronizó anteriormente, saltando...');
      return;
    }
  
    // Primero verificar si hay items en localStorage
    const localCart = localStorage.getItem('cart');
    console.log('💾 localStorage cart:', localCart ? 'SÍ' : 'NO');
    
    if (localCart) {
      try {
        const localItems: IProduct[] = JSON.parse(localCart);
        console.log('📦 Items en localStorage:', localItems.length);
        
        if (localItems.length > 0) {
          console.log('🔄 Sincronizando items con backend...');
          toast.info('Sincronizando carrito...');
          
          const { addToCartBackend } = await import('@/src/services/order.services');
          
          let syncCount = 0;
          for (const item of localItems) {
            try {
              console.log(`  ➕ Agregando: ${item.name} (qty: ${item.quantity || 1})`);
              await addToCartBackend(
                String(userData.user.id),
                item.id,
                item.quantity || 1,
                userData.token || ''
              );
              syncCount++;
            } catch (err: any) {
              // Si el error es que ya existe, no es un problema
              if (err.message?.includes('ya está en el carrito') || err.message?.includes('already')) {
                console.log(`  ⏭️ ${item.name} ya está en el carrito del backend`);
                syncCount++;
              } else {
                console.error('❌ Error al sincronizar item:', item.name, err.message);
              }
            }
          }
          
          console.log(`✅ Sincronizados ${syncCount}/${localItems.length} items`);
          
          // Marcar como sincronizado
          hasSyncedRef.current = true;
          
          // Recargar carrito del backend
          await loadCartFromBackend();
          
          // Limpiar localStorage después de sincronizar
          localStorage.removeItem('cart');
          toast.success(`Carrito sincronizado: ${syncCount} productos`);
        }
      } catch (err) {
        console.error('💥 Error al sincronizar carrito:', err);
        toast.error('Error al sincronizar el carrito');
      }
    } else {
      // No hay items en localStorage, solo cargar del backend
      console.log('📥 Cargando carrito del backend...');
      await loadCartFromBackend();
      hasSyncedRef.current = true;
    }
  };
  
  syncCart();
}, [userData?.user?.id]);

const handleCheckout = async () => {
  // Si el usuario no está autenticado, mostrar un toast de error y redirigir al login
  if (!userData?.user?.id) {
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

  if (items.length === 0) {
    toast.error('Tu carrito está vacío');
    return;
  }

  setIsCheckingOut(true);
  try {
    console.log('🚀 Iniciando checkout...');
    console.log('🛒 Items en el carrito:', items.length);
    
    // Llamar al nuevo endpoint que usa el carrito del backend
    const response = await createCheckout(String(userData.user.id), userData.token || '');
    
    console.log('📦 Respuesta completa del checkout:', response);
    
    // El backend devuelve { message: string, data: { preferenceId, initPoint, sandboxInitPoint } }
    const data = response?.data || response;
    
    console.log('📦 Datos de pago:', data);
    console.log('🔗 USAR ESTE LINK PARA PRODUCCIÓN:', data?.initPoint);
    console.log('⚠️ Link de sandbox (NO usar en producción):', data?.sandboxInitPoint);
    
    // IMPORTANTE: Usar initPoint para producción (NO sandboxInitPoint)
    const checkoutUrl = data?.initPoint;
    
    if (checkoutUrl) {
      console.log('✅ Redirigiendo a MercadoPago (PRODUCCIÓN):', checkoutUrl);
      // Limpiar carrito local antes de redirigir
      localStorage.removeItem('cart');
      // Redirigir en la misma ventana
      window.location.href = checkoutUrl;
    } else {
      console.warn('⚠️ MercadoPago no configurado, orden creada sin initPoint');
      
      // Limpiar carrito local
      localStorage.removeItem('cart');
      
      toast.success(
        `✅ ¡Orden #${data.id?.slice(0, 8)} creada exitosamente! Total: $${data.total}. Redirigiendo al historial...`,
        { autoClose: 3000 }
      );
      
      // Redirigir al dashboard
      setTimeout(() => {
        setOpen(false);
        router.push('/dashboard');
      }, 2000);
    }
  } catch (error: any) {
    console.error('❌ Error al crear checkout:', error);
    
    // Extraer información específica del error
    const errorMessage = error.message || '';
    
    // Mensaje de error más específico
    if (errorMessage.includes('No hay carrito activo') || errorMessage.includes('vacío')) {
      toast.error('El carrito está vacío. Agrega productos antes de continuar.');
    } else if (errorMessage.includes('Insufficient stock')) {
      // Extraer el nombre del producto y las cantidades del mensaje
      const productMatch = errorMessage.match(/product "([^"]+)"/);
      const availableMatch = errorMessage.match(/Available: (\d+)/);
      const requestedMatch = errorMessage.match(/requested: (\d+)/);
      
      if (productMatch && availableMatch && requestedMatch) {
        const productName = productMatch[1];
        const available = availableMatch[1];
        const requested = requestedMatch[1];
        toast.error(`"${productName}" no tiene stock suficiente. Disponible: ${available}, solicitado: ${requested}. Por favor ajusta la cantidad.`, {
          autoClose: 8000
        });
      } else {
        toast.error('Uno o más productos no tienen stock suficiente. Por favor verifica las cantidades.');
      }
    } else {
      toast.error(errorMessage || 'Error al procesar el pago');
    }
  } finally {
    setIsCheckingOut(false);
  }
};

const handleUpdateQuantity = async (productId: number | string, newQuantity: number) => {
  if (newQuantity < 1) return;
  await updateQuantity(productId, newQuantity);
};

const handleRemoveItem = async (productId: number | string) => {
  await removeFromCart(productId);
};

const handleClearCart = async () => {
  await clearCart();
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
            <div className="pointer-events-none fixed top-25 bottom-0 right-60 flex max-w-full pl-8 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-3xl transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full w-full border-amber-200 border-2 mb-1 rounded-2xl flex-col overflow-y-auto bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-lg font-medium text-gray-900">Tu carrito</DialogTitle>
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
                        <ul role="list" className="-my-6">
                          {items.length === 0 ? (
                            <li className="py-6 text-gray-600">Tu carrito está vacío</li>
                            ) : (
                            items.map((item: IProduct, index: number) => (
                              <li key={item.id} className={`flex py-6 px-4 rounded-lg ${index % 2 === 0 ? 'bg-amber-50' : 'bg-white'}`}>
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
                                      <p className="ml-4">${(Number(item.price) * (item.quantity || 1)).toLocaleString()}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                                    <p className="mt-1 text-xs text-gray-400">Precio unitario: ${Number(item.price).toLocaleString()}</p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    {/* Control de cantidad */}
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                                        className="w-8 h-8 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700"
                                        disabled={(item.quantity || 1) <= 1}
                                      >
                                        −
                                      </button>
                                      <span className="w-12 text-center font-medium">{item.quantity || 1}</span>
                                      <button
                                        onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                                        className="w-8 h-8 rounded-md bg-amber-200 hover:bg-amber-300 flex items-center justify-center font-bold text-gray-700"
                                      >
                                        +
                                      </button>
                                    </div>
                                    
                                    {/* Botón eliminar */}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveItem(item.id)}
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

                    {/* Botón principal de checkout */}
                    <div className="mt-6">
                      <button
                        onClick={!userData ? getLogin : handleCheckout}
                        className="w-full flex items-center justify-center gap-2 rounded-lg border border-transparent bg-amber-300 hover:bg-amber-500 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={items.length === 0 || isCheckingOut}
                      >
                        {isCheckingOut ? (
                          <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando...
                          </>
                        ) : (
                          <>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.95 17.4l-4.95-4.95-4.95 4.95L6 16.35l4.95-4.95L6 6.45 7.05 5.4l4.95 4.95 4.95-4.95L18 6.45l-4.95 4.95 4.95 4.95-1.05 1.05z"/>
                            </svg>
                            {!userData ? 'Inicia sesión para continuar' : 'Pagar con MercadoPago'}
                          </>
                        )}
                      </button>
                    </div>

                    {/* Separador */}
                    <div className="relative mt-6 mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">o</span>
                      </div>
                    </div>

                    {/* Botón secundario - vaciar carrito */}
                    <div className="flex justify-center text-center text-sm text-gray-500">
                      <button
                        type="button"
                        onClick={handleClearCart}
                        className="font-medium text-amber-500 hover:text-red-600 transition-colors"
                        disabled={items.length === 0}
                      >
                        Vaciar carrito
                      </button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Modal de pago con MercadoPago Wallet */}
      {showPaymentModal && preferenceId && (
        <Dialog open={showPaymentModal} onClose={() => setShowPaymentModal(false)} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="max-w-lg w-full bg-white rounded-lg shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <DialogTitle className="text-xl font-semibold">Completa tu pago</DialogTitle>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setOpen(true); // Reabrir el carrito
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <MercadoPagoWallet preferenceId={preferenceId} />
              
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-semibold mb-2">
                  📝 Instrucciones importantes:
                </p>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Haz clic en el botón azul de MercadoPago</li>
                  <li>Completa el pago en la nueva ventana</li>
                  <li>Después del pago, <strong>vuelve a esta pestaña</strong></li>
                  <li>Tu pedido se procesará automáticamente</li>
                </ol>
              </div>
              
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  router.push('/dashboard');
                }}
                className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Ver mis pedidos
              </button>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  )
}
export default CartPage