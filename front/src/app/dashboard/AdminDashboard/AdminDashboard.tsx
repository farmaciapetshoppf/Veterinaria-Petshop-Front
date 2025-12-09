'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { IProduct } from "@/src/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Appointment {
  id: string;
  date: string;
  time: string;
  pet?: {
    name: string;
    user?: {
      name: string;
    };
  };
  veterinarian?: {
    name: string;
  };
  status: string;
  reason?: string;
}

interface Order {
  id: string;
  createdAt?: string;
  total?: string;
  status: string;
  paymentMethod?: string;
  notes?: string;
  mercadoPagoId?: string;
  mercadoPagoStatus?: string;
  buyer?: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  };
  items?: Array<{
    id?: string;
    product?: {
      id?: string;
      name: string;
      description?: string;
      price?: string;
      imgUrl?: string;
    };
    quantity: number;
    unitPrice: string;
  }>;
}

interface CategorySales {
  categoryName: string;
  totalSales: number;
  productCount: number;
  orderCount: number;
}

export default function AdminDashboard() {
  const { userData } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'orders' | 'store'>('appointments');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imgUrl: ''
  });

  useEffect(() => {
    if (userData?.token) {
      loadAppointments();
      loadOrders();
      loadProducts();
    }
  }, [userData]);

  const loadAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const response = await fetch(`${API_URL}/appointments/AllAppointments`, {
        credentials: 'include',
        headers: {
          ...(userData?.token && { Authorization: `Bearer ${userData.token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await fetch(`${API_URL}/sale-orders`, {
        credentials: 'include',
        headers: {
          ...(userData?.token && { Authorization: `Bearer ${userData.token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        const ordersArray = Array.isArray(data) ? data : data.data || [];
        setOrders(ordersArray);
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await fetch(`${API_URL}/products`, {
        credentials: 'include',
        headers: {
          ...(userData?.token && { Authorization: `Bearer ${userData.token}` }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      console.log('📤 Creando producto...');
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(userData?.token && { Authorization: `Bearer ${userData.token}` }),
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          imgUrl: formData.imgUrl || 'https://via.placeholder.com/150',
        }),
      });

      console.log('📥 Respuesta del servidor:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Producto creado:', result);
        alert('Producto creado exitosamente');
        setShowCreateModal(false);
        setFormData({ name: '', description: '', price: '', stock: '', imgUrl: '' });
        loadProducts();
      } else {
        const error = await response.json();
        console.error('❌ Error del servidor:', error);
          alert(`Error al crear producto: ${error.message || JSON.stringify(error)}`);
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('Error al crear producto');
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct || !formData.name || !formData.price || !formData.stock) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      console.log('📤 Actualizando producto:', selectedProduct.id);

      const response = await fetch(`${API_URL}/products/${selectedProduct.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(userData?.token && { Authorization: `Bearer ${userData.token}` }),
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          imgUrl: formData.imgUrl || undefined,
        }),
      });

      console.log('📥 Respuesta del servidor:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Producto actualizado:', result);
        
        // El backend devuelve { message: '...', data: { producto actualizado } }
        const updatedProduct = result.data || result;
        
        // Actualizar el producto en el estado local
        setProducts(prevProducts => 
          prevProducts.map(p => 
            p.id === selectedProduct.id 
              ? { 
                  ...p, 
                  name: updatedProduct.name || formData.name,
                  description: updatedProduct.description || formData.description,
                  price: updatedProduct.price || parseFloat(formData.price),
                  stock: updatedProduct.stock || parseInt(formData.stock),
                  image: updatedProduct.image || p.image
                }
              : p
          )
        );
        
        alert('Producto actualizado exitosamente');
        setShowEditModal(false);
        setSelectedProduct(null);
        setFormData({ name: '', description: '', price: '', stock: '', imgUrl: '' });
      } else {
        const error = await response.json();
        console.error('❌ Error del servidor:', error);
        alert(error.message || 'Error al actualizar producto');
      }
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error);
      alert('Error al actualizar producto');
    }
  };

  const handleDeleteProduct = async (productId: string | number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          ...(userData?.token && { Authorization: `Bearer ${userData.token}` }),
        },
      });

      if (response.ok) {
        alert('Producto eliminado exitosamente');
        loadProducts();
      } else {
        const error = await response.json();
        alert(error.message || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar producto');
    }
  };

  const openEditModal = (product: IProduct) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      imgUrl: product.imgUrl || ''
    });
    setShowEditModal(true);
  };

  const getImageSrc = (image: string | any) => {
    if (!image) return 'https://placehold.co/400x400/f59e0b/white?text=Sin+Imagen';
    if (typeof image === 'string') {
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
      } else {
        return `${API_URL}${image}`;
      }
    }
    return image;
  };

  const getStatusColor = (status: string | boolean) => {
    // Si es boolean, convertir a string equivalente
    if (typeof status === 'boolean') {
      const statusStr = status ? 'pending' : 'cancelled';
      return getStatusColor(statusStr); // Recursión con el string
    }
    
    switch (status.toLowerCase()) {
      case 'completed':
      case 'completado':
      case 'confirmed':
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-amber-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Bienvenido, {userData?.user?.name}</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`${
                activeTab === 'appointments'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all`}
            >
              📅 Turnos de Veterinarios
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`${
                activeTab === 'orders'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all`}
            >
              🛒 Historial de Compras
            </button>
            <button
              onClick={() => setActiveTab('store')}
              className={`${
                activeTab === 'store'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all`}
            >
              🏪 Administración de Store
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'appointments' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Turnos de Todos los Veterinarios</h2>
            {loadingAppointments ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center py-8 text-gray-500">
                  No hay turnos registrados
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="bg-linear-to-br from-white to-amber-50 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-amber-200 hover:border-amber-400 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Fecha</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(appointment.date).toLocaleDateString('es-AR')}
                        </p>
                        <p className="text-sm text-amber-600">{appointment.time}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {typeof appointment.status === 'boolean' 
                          ? (appointment.status ? 'Pendiente' : 'Cancelado')
                          : appointment.status
                        }
                      </span>
                    </div>
                    
                    <div className="space-y-3 border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Veterinario</p>
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.veterinarian?.name || 'No especificado'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Mascota</p>
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.pet?.name || 'No especificado'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Dueño</p>
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.pet?.user?.name || 'No especificado'}
                        </p>
                      </div>
                      
                      {appointment.reason && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Motivo</p>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {appointment.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Historial de Compras</h2>
            {loadingOrders ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center py-8 text-gray-500">
                  No hay compras registradas
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-linear-to-r from-white to-orange-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-4 border border-amber-200 hover:border-orange-400 transform hover:scale-[1.01]">
                    <div className="flex items-center justify-between gap-4">
                      {/* Orden y Fecha */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="shrink-0">
                          <p className="text-xs text-gray-500 uppercase">Orden</p>
                          <p className="text-sm font-semibold text-gray-900">
                            #{order.id?.substring(0, 8) || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-AR') : 'Sin fecha'}
                          </p>
                        </div>
                        
                        {/* Cliente */}
                        <div className="shrink-0 border-l border-gray-200 pl-4">
                          <p className="text-xs text-gray-500 uppercase">Cliente</p>
                          <p className="text-sm font-medium text-gray-900">
                            {order.buyer?.name || 'No especificado'}
                          </p>
                          {order.buyer?.email && (
                            <p className="text-xs text-gray-500">{order.buyer.email}</p>
                          )}
                        </div>
                        
                        {/* Productos */}
                        {order.items && order.items.length > 0 && (
                          <div className="flex-1 min-w-0 border-l border-gray-200 pl-4">
                            <p className="text-xs text-gray-500 uppercase mb-1">Productos</p>
                            <div className="flex flex-wrap gap-1">
                              {order.items.slice(0, 2).map((item, index) => (
                                <span key={index} className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded">
                                  {item.product?.name || 'Producto'} (x{item.quantity})
                                </span>
                              ))}
                              {order.items.length > 2 && (
                                <span className="text-xs text-gray-500 italic px-2 py-1">
                                  +{order.items.length - 2} más
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Total y Estado */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right border-l border-gray-200 pl-4">
                          <p className="text-xs text-gray-500 uppercase">Total</p>
                          <p className="text-xl font-bold text-amber-600">
                            ${order.total ? parseFloat(order.total).toLocaleString('es-AR', { minimumFractionDigits: 2 }) : '0.00'}
                          </p>
                        </div>
                        
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(order.status || 'pending')}`}>
                          {order.status || 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'store' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-linear-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                ➕ Crear Producto
              </button>
            </div>
            
            {/* Barra de búsqueda */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-amber-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              {searchTerm && (
                <p className="mt-2 text-sm text-gray-600">
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Vista de Productos */}
            <div>
              {loadingProducts ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No se encontraron productos' : 'No hay productos registrados'}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-linear-to-r from-white to-orange-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-4 border border-amber-200 hover:border-orange-400">
                      <div className="flex items-center justify-between gap-4">
                        {/* Imagen y nombre del producto */}
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="shrink-0 w-20 h-20 bg-white rounded-lg overflow-hidden border-2 border-amber-200">
                            <img
                              src={getImageSrc(product.image)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 uppercase">Producto</p>
                            <p className="font-bold text-gray-900 truncate">{product.name}</p>
                            <p className="text-sm text-gray-600 truncate">{product.description}</p>
                          </div>
                        </div>

                        {/* ID del producto */}
                        <div className="shrink-0 border-l border-gray-200 pl-4">
                          <p className="text-xs text-gray-500 uppercase">ID</p>
                          <p className="text-sm font-mono text-gray-700">
                            {typeof product.id === 'string' ? product.id.slice(0, 8) : product.id}
                          </p>
                        </div>

                        {/* Stock */}
                        <div className="shrink-0 border-l border-gray-200 pl-4">
                          <p className="text-xs text-gray-500 uppercase">Stock</p>
                          <p className={`text-lg font-bold ${
                            product.stock > 10 ? 'text-green-600' :
                            product.stock > 0 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {product.stock}
                          </p>
                        </div>

                        {/* Precio */}
                        <div className="text-right border-l border-gray-200 pl-4 shrink-0">
                          <p className="text-xs text-gray-500 uppercase">Precio</p>
                          <p className="text-xl font-bold text-amber-600">
                            ${typeof product.price === 'number' ? product.price.toLocaleString('es-AR', { minimumFractionDigits: 2 }) : product.price}
                          </p>
                        </div>

                        {/* Estado del stock */}
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap shrink-0 ${
                          product.stock > 10 ? 'bg-green-100 text-green-800' :
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 10 ? 'Disponible' :
                           product.stock > 0 ? 'Poco Stock' :
                           'Sin Stock'}
                        </span>

                        {/* Botones de acción */}
                        <div className="flex gap-2 shrink-0 border-l border-gray-200 pl-4">
                          <button
                            onClick={() => openEditModal(product)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                            title="Editar producto"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                            title="Eliminar producto"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Crear Producto */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Crear Nuevo Producto</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({ name: '', description: '', price: '', stock: '', image: null });
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  placeholder="Nombre del producto"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  placeholder="Descripción del producto"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Precio *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                    placeholder="20.99"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stock *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">URL de la Imagen</label>
                <input
                  type="text"
                  value={formData.imgUrl}
                  onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {formData.imgUrl && (
                  <div className="mt-2">
                    <img src={formData.imgUrl} alt="Vista previa" className="w-32 h-32 object-cover rounded-lg" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateProduct}
                  className="flex-1 bg-linear-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Crear Producto
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '', description: '', price: '', stock: '', image: null });
                  }}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Producto */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Editar Producto</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProduct(null);
                  setFormData({ name: '', description: '', price: '', stock: '', image: null });
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  placeholder="Nombre del producto"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  placeholder="Descripción del producto"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Precio *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                    placeholder="20.99"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stock *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">URL de la Imagen</label>
                <input
                  type="text"
                  value={formData.imgUrl}
                  onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {formData.imgUrl && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
                    <img src={formData.imgUrl} alt="Vista previa" className="w-32 h-32 object-cover rounded-lg" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                )}
              </div>

              {/* Imagen actual */}
              {selectedProduct.imgUrl && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Imagen Actual</label>
                  <img
                    src={getImageSrc(selectedProduct.imgUrl)}
                    alt={selectedProduct.name}
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateProduct}
                  className="flex-1 bg-linear-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    setFormData({ name: '', description: '', price: '', stock: '', imgUrl: '' });
                  }}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
