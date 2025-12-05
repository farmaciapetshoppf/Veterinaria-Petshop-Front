# Integración de MercadoPago

## 📋 Configuración

### 1. Variable de entorno
Ya está agregada en `.env.local`:
```
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=YOUR_PUBLIC_KEY
```

**⚠️ IMPORTANTE:** Reemplaza `YOUR_PUBLIC_KEY` con tu clave pública de MercadoPago.

Para obtenerla:
1. Ve a https://www.mercadopago.com.ar/developers
2. Navega a "Credenciales"
3. Copia tu "Public Key" (para testing usa las credenciales de prueba)

### 2. Reiniciar el servidor
Después de modificar el `.env.local`, reinicia el servidor:
```bash
npm run dev
```

## 🔧 Uso en componentes

### Opción 1: Hook personalizado (Recomendado)

```tsx
import { useMercadoPago } from "@/src/hooks/useMercadoPago";

function MyComponent() {
  const { mp, isLoading, error } = useMercadoPago();

  if (isLoading) return <div>Cargando MercadoPago...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Usar mp aquí
  return <div>MercadoPago listo!</div>;
}
```

### Opción 2: Importación directa

```tsx
import { initMercadoPago } from "@/src/services/mercadopago.services";

// Dentro de tu componente o función
const mp = await initMercadoPago();
```

## 💳 Ejemplo de integración en el carrito

Aquí tienes un ejemplo de cómo integrar MercadoPago en tu flujo de checkout:

```tsx
'use client';

import { useMercadoPago } from "@/src/hooks/useMercadoPago";
import { createPaymentPreference } from "@/src/services/mercadopago.services";

function CartPage() {
  const { mp, isLoading } = useMercadoPago();
  const { cartItems, getTotal } = useCart();

  const handleMercadoPagoCheckout = async () => {
    if (!mp || !userData?.user) {
      alert("Por favor inicia sesión");
      return;
    }

    try {
      // Crear preferencia de pago en tu backend
      const preference = await createPaymentPreference({
        items: cartItems.map(item => ({
          title: item.name,
          quantity: 1,
          unit_price: Number(item.price),
          currency_id: "ARS"
        })),
        payer: {
          name: userData.user.name,
          email: userData.user.email
        },
        back_urls: {
          success: `${window.location.origin}/payment/success`,
          failure: `${window.location.origin}/payment/failure`,
          pending: `${window.location.origin}/payment/pending`
        }
      });

      // Redirigir a MercadoPago
      if (preference.init_point) {
        window.location.href = preference.init_point;
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Error al procesar el pago");
    }
  };

  return (
    <button 
      onClick={handleMercadoPagoCheckout}
      disabled={isLoading || cartItems.length === 0}
    >
      Pagar con MercadoPago
    </button>
  );
}
```

## 🎨 Botón de MercadoPago personalizado

```tsx
<button
  onClick={handleMercadoPagoCheckout}
  className="flex items-center justify-center gap-2 bg-[#009EE3] hover:bg-[#0084C7] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
  disabled={isLoading}
>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.95 17.4l-4.95-4.95-4.95 4.95L6 16.35l4.95-4.95L6 6.45 7.05 5.4l4.95 4.95 4.95-4.95L18 6.45l-4.95 4.95 4.95 4.95-1.05 1.05z"/>
  </svg>
  {isLoading ? "Cargando..." : "Pagar con MercadoPago"}
</button>
```

## 🔐 Backend necesario

Tu backend debe tener un endpoint para crear preferencias:

```
POST /payments/create-preference
```

Este endpoint debe:
1. Recibir los items y datos del comprador
2. Usar el SDK de MercadoPago del backend para crear una preferencia
3. Retornar el `init_point` para redirigir al usuario

## 📱 Flujo completo

1. Usuario agrega productos al carrito
2. Usuario hace clic en "Pagar con MercadoPago"
3. Frontend llama a `createPaymentPreference()`
4. Backend crea la preferencia con MercadoPago
5. Frontend redirige al usuario a MercadoPago (`init_point`)
6. Usuario completa el pago en MercadoPago
7. MercadoPago redirige a tu URL de éxito/fallo
8. Tu backend recibe un webhook con el estado del pago
9. Actualizas el estado de la orden

## 🔗 URLs útiles

- Documentación: https://www.mercadopago.com.ar/developers/es/docs
- SDK JS: https://github.com/mercadopago/sdk-js
- Credenciales de prueba: https://www.mercadopago.com.ar/developers/es/docs/credentials
