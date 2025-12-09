'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { getOrderHistory } from '@/src/services/order.services';
import Image from 'next/image';

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  items: OrderItem[];
}

export default function HistoryOrders() {
  const { userData } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!userData?.user?.id) {
        console.log('❌ No hay userId en userData');
        setLoading(false);
        return;
      }

      try {
        console.log('🔄 Cargando historial para userId:', userData.user.id);
        setLoading(true);
        const result = await getOrderHistory(String(userData.user.id), userData.token || '');
        console.log('✅ Historial recibido:', result);
        console.log('📦 Cantidad de órdenes:', result?.length || 0);
        setOrders(result || []);
      } catch (err: any) {
        console.error('❌ Error al cargar historial:', err);
        setError(err.message || 'Error al cargar el historial de compras');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [userData?.user?.id, userData?.token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Debes iniciar sesión para ver tu historial de compras</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-24 w-24 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No hay compras registradas</h3>
        <p className="mt-2 text-sm text-gray-500">Cuando realices tu primera compra aparecerá aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Historial de Compras</h2>
        <span className="text-sm text-gray-500">{orders.length} {orders.length === 1 ? 'compra' : 'compras'}</span>
      </div>

      {orders.map((order) => (
        <div key={order.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Header de la orden */}
          <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Fecha de compra</p>
                <p className="text-base font-semibold text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-amber-600">${Number(order.total).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Items de la orden */}
          <div className="px-6 py-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Productos</h3>
            <div className="space-y-4">
              {order.items.map((item) => {
                // Validar que la imagen sea una URL válida
                const getValidImageUrl = () => {
                  const imgUrl = item.product.image;
                  if (!imgUrl || imgUrl === 'No image' || imgUrl === 'no image') {
                    return 'https://placehold.co/400x400/f59e0b/white?text=Sin+Imagen';
                  }
                  // Si es una URL válida (empieza con http:// o https://)
                  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
                    return imgUrl;
                  }
                  // Si es una ruta relativa, no es válida para Image de Next.js
                  return 'https://placehold.co/400x400/f59e0b/white?text=Sin+Imagen';
                };

                return (
                <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  {/* Imagen del producto */}
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={getValidImageUrl()}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Detalles del producto */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{item.product.name}</h4>
                    <p className="text-sm text-gray-500 truncate">{item.product.description}</p>
                    <p className="text-sm text-gray-600 mt-1">Cantidad: {item.quantity}</p>
                  </div>

                  {/* Precio */}
                  <div className="text-right shrink-0">
                    <p className="text-sm text-gray-500">${Number(item.unitPrice).toLocaleString()} c/u</p>
                    <p className="text-base font-semibold text-gray-900">
                      ${(Number(item.unitPrice) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* Footer con estado */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Pagado
              </span>
              <p className="text-xs text-gray-500">Order ID: {order.id.substring(0, 8)}...</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
