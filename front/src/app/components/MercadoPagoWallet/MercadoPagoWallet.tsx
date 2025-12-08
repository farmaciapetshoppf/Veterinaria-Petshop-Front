'use client';

import { useEffect } from 'react';

interface MercadoPagoWalletProps {
  preferenceId: string;
}

declare global {
  interface Window {
    MercadoPago: any;
  }
}

export default function MercadoPagoWallet({ preferenceId }: MercadoPagoWalletProps) {
  useEffect(() => {
    // Verificar si el script ya está cargado
    if (document.getElementById('mercadopago-sdk')) {
      initializeBrick();
      return;
    }

    // Cargar el SDK de MercadoPago
    const script = document.createElement('script');
    script.id = 'mercadopago-sdk';
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      console.log('ƒo. SDK de MercadoPago cargado');
      initializeBrick();
    };
    document.body.appendChild(script);

    return () => {
      // Limpiar el brick al desmontar
      const container = document.getElementById('wallet_container');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [preferenceId]);

  const initializeBrick = () => {
    const publicKey =
      process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ||
      process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
    
    if (!publicKey) {
      console.error(
        'ƒ?O Falta NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY (o NEXT_PUBLIC_MP_PUBLIC_KEY) en las variables de entorno'
      );
      return;
    }

    if (typeof window.MercadoPago === 'undefined') {
      console.error('ƒ?O MercadoPago SDK no está disponible');
      return;
    }

    try {
      const mp = new window.MercadoPago(publicKey, {
        locale: 'es-AR'
      });

      const bricksBuilder = mp.bricks();

      console.log('ÐYõñ Creando Wallet Brick con preferenceId:', preferenceId);

      bricksBuilder.create('wallet', 'wallet_container', {
        initialization: {
          preferenceId: preferenceId,
          redirectMode: 'blank' // Abrir en nueva ventana
        },
        customization: {
          texts: {
            valueProp: 'smart_option',
          },
        },
        callbacks: {
          onReady: () => {
            console.log('ƒo. Wallet Brick listo');
          },
          onSubmit: () => {
            console.log('ÐYs? Procesando pago...');
          },
          onError: (error: any) => {
            console.error('ƒ?O Error en Wallet Brick:', error);
          },
        },
      });
    } catch (error) {
      console.error('ƒ?O Error al inicializar MercadoPago Brick:', error);
    }
  };

  return (
    <div className="w-full">
      <div id="wallet_container" className="min-h-[200px]"></div>
    </div>
  );
}
