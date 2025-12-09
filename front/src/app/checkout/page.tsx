"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";
import MercadoPagoCheckout from "../components/MercadoPagoCheckout/MercadoPagoCheckout";
import { useEffect } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getTotal, clearCart } = useCart();
  const { userData } = useAuth();

  useEffect(() => {
    // Redirigir si no hay usuario o carrito vacío
    if (!userData) {
      toast.error("Debes iniciar sesión para continuar");
      router.push("/auth/login?redirect=/checkout");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Tu carrito está vacío");
      router.push("/store");
    }
  }, [userData, cartItems, router]);

  const handlePaymentSuccess = async (paymentId: string) => {
    console.log("✅ Pago exitoso! ID:", paymentId);
    
    toast.custom(() => (
      <div className="flex items-center gap-3 rounded-md border border-green-800 bg-green-100 px-4 py-2 text-green-900">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <div className="text-sm font-medium">¡Pago realizado con éxito!</div>
      </div>
    ), { duration: 4000 });

    // Limpiar el carrito
    await clearCart();
    
    // Redirigir al dashboard después de 2 segundos
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  const handlePaymentError = (error: any) => {
    console.error("❌ Error en el pago:", error);
    
    toast.custom(() => (
      <div className="flex flex-col gap-1 rounded-md border border-red-800 bg-red-100 px-4 py-2 text-red-900">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="text-sm font-medium">Error al procesar el pago</div>
        </div>
        <div className="text-xs text-red-800">{error.message || "Intenta nuevamente"}</div>
      </div>
    ), { duration: 6000 });
  };

  if (!userData || cartItems.length === 0) {
    return null;
  }

  const total = getTotal();
  
  console.log('🛒 CHECKOUT - Items en carrito:', cartItems);
  console.log('📊 CHECKOUT - Total calculado:', total);
  cartItems.forEach(item => {
    console.log(`  📦 ${item.name}: precio=$${item.price}, cantidad=${item.quantity || 1}, subtotal=$${Number(item.price) * (item.quantity || 1)}`);
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-amber-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Resumen del pedido */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Finalizar compra</h1>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-amber-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Resumen del pedido
            </h2>
            
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-amber-100">
                  <div className="flex flex-col">
                    <span className="text-gray-700 font-medium">{item.name}</span>
                    <span className="text-xs text-gray-500">
                      ${Number(item.price).toLocaleString()} × {item.quantity || 1}
                    </span>
                  </div>
                  <span className="font-bold text-amber-600">
                    ${(Number(item.price) * (item.quantity || 1)).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t-2 border-amber-200 pt-4 mt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-amber-600 text-2xl">${total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de pago */}
        <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-orange-200">
          <MercadoPagoCheckout
            amount={total}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>

        {/* Botón volver */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/cart")}
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 font-semibold text-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
