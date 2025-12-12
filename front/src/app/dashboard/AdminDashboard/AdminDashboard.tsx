'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { IProduct } from "@/src/types";
import { toast } from "react-toastify";

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
  const [isCreating, setIsCreating] = useState(false);
  const [expandedOrderGroups, setExpandedOrderGroups] = useState<Record<string, boolean>>({
    today: true,
    week: false,
    month: false,
    older: false
  });
  const [expandedVetGroups, setExpandedVetGroups] = useState<Record<string, boolean>>({});
  const [orderFilters, setOrderFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'all',
    searchClient: '',
    category: 'all'
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    mainImage: null as File | null,
    additionalImages: [] as File[]
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
    if (!formData.name || !formData.price || !formData.stock || !formData.mainImage) {
      toast.warning('Por favor completa todos los campos obligatorios (nombre, precio, stock e imagen principal)');
      return;
    }

    if (isCreating) return; // Prevenir doble submit
    setIsCreating(true);

    try {
      console.log('📤 Creando producto...');
      console.log('📋 Datos del formulario:', {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        categoryId: formData.categoryId,
        hasMainImage: !!formData.mainImage,
        mainImageName: formData.mainImage?.name,
        additionalImagesCount: formData.additionalImages.length
      });
      
      const formDataToSend = new FormData();
      
      // IMPORTANTE: Algunos backends requieren que los archivos vayan AL FINAL
      // Primero todos los campos de texto
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('price', String(Number(formData.price)));
      formDataToSend.append('stock', String(Number(formData.stock)));
      if (formData.categoryId) formDataToSend.append('categoryId', formData.categoryId);
      
      // Luego los archivos
      formDataToSend.append('mainImage', formData.mainImage);
      
      // Agregar imágenes adicionales (solo si hay)
      if (formData.additionalImages.length > 0) {
        formData.additionalImages.forEach((file) => {
          formDataToSend.append('additionalImages', file);
        });
      }

      console.log('📦 Enviando con FormData');
      for (let pair of formDataToSend.entries()) {
        console.log(`  ${pair[0]}:`, pair[1]);
      }

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...(userData?.token && { Authorization: `Bearer ${userData.token}` }),
          // NO establecer Content-Type cuando usas FormData - el navegador lo hace automáticamente
        },
        body: formDataToSend,
      });

      console.log('📥 Respuesta del servidor:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Producto creado:', result);
        toast.success('Producto creado exitosamente');
        setShowCreateModal(false);
        setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', mainImage: null, additionalImages: [] });
        loadProducts();
      } else {
        let errorDetail;
        try {
          errorDetail = await response.json();
        } catch {
          errorDetail = { message: response.statusText };
        }
        console.error('❌ Error del servidor:', errorDetail);
        console.error('💡 Tamaño de mainImage:', formData.mainImage.size, 'bytes');
        console.error('💡 Tipo de mainImage:', formData.mainImage.type);
        toast.error(`Error al crear producto: ${errorDetail.message}`);
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      toast.error('Error al crear producto');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct || !formData.name || !formData.price || !formData.stock) {
      toast.warning('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      console.log('📤 Actualizando producto:', selectedProduct.id);

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      if (formData.categoryId) formDataToSend.append('categoryId', formData.categoryId);
      if (formData.mainImage) formDataToSend.append('mainImage', formData.mainImage);
      
      // Agregar imágenes adicionales
      formData.additionalImages.forEach((file) => {
        formDataToSend.append('additionalImages', file);
      });

      const response = await fetch(`${API_URL}/products/${selectedProduct.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          ...(userData?.token && { Authorization: `Bearer ${userData.token}` }),
        },
        body: formDataToSend,
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
        
        toast.success('Producto actualizado exitosamente');
        setShowEditModal(false);
        setSelectedProduct(null);
        setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', mainImage: null, additionalImages: [] });
      } else {
        const error = await response.json();
        console.error('❌ Error del servidor:', error);
        toast.error(error.message || 'Error al actualizar producto');
      }
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error);
      toast.error('Error al actualizar producto');
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
        toast.success('Producto eliminado exitosamente');
        loadProducts();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      toast.error('Error al eliminar producto');
    }
  };

  const openEditModal = (product: IProduct) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      categoryId: '',
      mainImage: null,
      additionalImages: []
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

  const toggleOrderGroup = (group: string) => {
    setExpandedOrderGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const toggleVetGroup = (vetId: string) => {
    setExpandedVetGroups(prev => ({
      ...prev,
      [vetId]: !prev[vetId]
    }));
  };

  const groupAppointmentsByVet = (appointments: Appointment[]) => {
    const vetGroups: Record<string, { vet: any; appointments: Appointment[] }> = {};

    appointments.forEach(appointment => {
      const vetId = appointment.veterinarian?.id || 'unknown';
      const vetName = appointment.veterinarian?.name || 'Sin veterinario asignado';
      
      if (!vetGroups[vetId]) {
        vetGroups[vetId] = {
          vet: {
            id: vetId,
            name: vetName,
            specialty: appointment.veterinarian?.specialty
          },
          appointments: []
        };
      }
      
      vetGroups[vetId].appointments.push(appointment);
    });

    // Ordenar citas por fecha dentro de cada grupo
    Object.values(vetGroups).forEach(group => {
      group.appointments.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateA.getTime() - dateB.getTime();
      });
    });

    return Object.values(vetGroups).sort((a, b) => 
      a.vet.name.localeCompare(b.vet.name)
    );
  };

  const filterOrders = (orders: Order[]) => {
    return orders.filter(order => {
      // Filtro por fecha
      if (orderFilters.startDate && order.createdAt) {
        const orderDate = new Date(order.createdAt);
        const startDate = new Date(orderFilters.startDate);
        if (orderDate < startDate) return false;
      }
      if (orderFilters.endDate && order.createdAt) {
        const orderDate = new Date(order.createdAt);
        const endDate = new Date(orderFilters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (orderDate > endDate) return false;
      }
      
      // Filtro por estado
      if (orderFilters.status !== 'all' && order.status?.toLowerCase() !== orderFilters.status.toLowerCase()) {
        return false;
      }
      
      // Filtro por cliente
      if (orderFilters.searchClient) {
        const searchTerm = orderFilters.searchClient.toLowerCase();
        const buyerName = order.buyer?.name?.toLowerCase() || '';
        const buyerEmail = order.buyer?.email?.toLowerCase() || '';
        if (!buyerName.includes(searchTerm) && !buyerEmail.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
  };

  const groupOrdersByDate = (orders: Order[]) => {
    const filteredOrders = filterOrders(orders);
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const groups: Record<string, Order[]> = {
      today: [],
      week: [],
      month: [],
      older: []
    };

    filteredOrders.forEach(order => {
      if (!order.createdAt) return;
      const orderDate = new Date(order.createdAt);
      if (orderDate >= today) {
        groups.today.push(order);
      } else if (orderDate >= weekAgo) {
        groups.week.push(order);
      } else if (orderDate >= monthAgo) {
        groups.month.push(order);
      } else {
        groups.older.push(order);
      }
    });

    const calculateTotal = (orders: Order[]) => 
      orders.reduce((sum, order) => sum + (parseFloat(order.total || '0')), 0);

    return [
      { title: 'Hoy', key: 'today', orders: groups.today, total: calculateTotal(groups.today) },
      { title: 'Última semana', key: 'week', orders: groups.week, total: calculateTotal(groups.week) },
      { title: 'Último mes', key: 'month', orders: groups.month, total: calculateTotal(groups.month) },
      { title: 'Anteriores', key: 'older', orders: groups.older, total: calculateTotal(groups.older) }
    ].filter(group => group.orders.length > 0);
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
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Turnos de Veterinarios</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {appointments.length} {appointments.length === 1 ? 'turno' : 'turnos'} agendados
                </p>
              </div>
            </div>

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
              <div className="space-y-4">
                {groupAppointmentsByVet(appointments).map((group) => {
                  const isExpanded = expandedVetGroups[group.vet.id] ?? true;

                  return (
                    <div key={group.vet.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      {/* Header del veterinario */}
                      <button
                        onClick={() => toggleVetGroup(group.vet.id)}
                        className="w-full bg-linear-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 hover:from-amber-100 hover:to-orange-100 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <svg
                              className={`w-5 h-5 text-amber-600 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="text-left">
                              <h3 className="text-lg font-bold text-gray-900">{group.vet.name}</h3>
                              <p className="text-sm text-gray-600">
                                {group.appointments.length} {group.appointments.length === 1 ? 'turno' : 'turnos'}
                                {group.vet.specialty && ` · ${group.vet.specialty}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">🩺</span>
                          </div>
                        </div>
                      </button>

                      {/* Contenido: turnos del veterinario */}
                      {isExpanded && (
                        <div className="divide-y divide-gray-100">
                          {group.appointments.map((appointment) => (
                            <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-start justify-between gap-4">
                                {/* Fecha y hora */}
                                <div className="flex items-start gap-4 flex-1">
                                  <div className="shrink-0">
                                    <div className="bg-amber-100 rounded-lg p-3 text-center min-w-[70px]">
                                      <p className="text-xs text-amber-700 font-medium uppercase">
                                        {new Date(appointment.date).toLocaleDateString('es-AR', { month: 'short' })}
                                      </p>
                                      <p className="text-2xl font-bold text-amber-900">
                                        {new Date(appointment.date).getDate()}
                                      </p>
                                      <p className="text-xs text-amber-600 font-medium">
                                        {appointment.time}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Información del turno */}
                                  <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-sm">🐾</span>
                                          <p className="text-sm font-semibold text-gray-900">
                                            {appointment.pet?.name || 'No especificado'}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs">👤</span>
                                          <p className="text-xs text-gray-600">
                                            {appointment.pet?.user?.name || 'No especificado'}
                                          </p>
                                        </div>
                                        {appointment.reason && (
                                          <div className="mt-2 bg-gray-50 rounded p-2">
                                            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Motivo</p>
                                            <p className="text-sm text-gray-700">{appointment.reason}</p>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Estado */}
                                      <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(appointment.status)}`}>
                                        {typeof appointment.status === 'boolean' 
                                          ? (appointment.status ? 'Pendiente' : 'Cancelado')
                                          : appointment.status
                                        }
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Historial de Compras</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {filterOrders(orders).length} de {orders.length} {orders.length === 1 ? 'orden' : 'órdenes'} · Total filtrado: ${filterOrders(orders).reduce((sum, order) => sum + parseFloat(order.total || '0'), 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Panel de Filtros */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h3 className="text-lg font-bold text-gray-900">Filtros</h3>
                {(orderFilters.startDate || orderFilters.endDate || orderFilters.status !== 'all' || orderFilters.searchClient) && (
                  <button
                    onClick={() => setOrderFilters({ startDate: '', endDate: '', status: 'all', searchClient: '', category: 'all' })}
                    className="ml-auto text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Fecha Desde */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Desde</label>
                  <input
                    type="date"
                    value={orderFilters.startDate}
                    onChange={(e) => setOrderFilters({ ...orderFilters, startDate: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Fecha Hasta */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hasta</label>
                  <input
                    type="date"
                    value={orderFilters.endDate}
                    onChange={(e) => setOrderFilters({ ...orderFilters, endDate: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                  <select
                    value={orderFilters.status}
                    onChange={(e) => setOrderFilters({ ...orderFilters, status: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  >
                    <option value="all">Todos</option>
                    <option value="pending">Pendiente</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>

                {/* Buscar Cliente */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Cliente</label>
                  <input
                    type="text"
                    placeholder="Buscar por nombre o email"
                    value={orderFilters.searchClient}
                    onChange={(e) => setOrderFilters({ ...orderFilters, searchClient: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Mostrar filtros activos */}
              {(orderFilters.startDate || orderFilters.endDate || orderFilters.status !== 'all' || orderFilters.searchClient) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Filtros activos:</p>
                  <div className="flex flex-wrap gap-2">
                    {orderFilters.startDate && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                        Desde: {new Date(orderFilters.startDate).toLocaleDateString('es-AR')}
                        <button onClick={() => setOrderFilters({ ...orderFilters, startDate: '' })} className="hover:text-amber-900">✕</button>
                      </span>
                    )}
                    {orderFilters.endDate && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                        Hasta: {new Date(orderFilters.endDate).toLocaleDateString('es-AR')}
                        <button onClick={() => setOrderFilters({ ...orderFilters, endDate: '' })} className="hover:text-amber-900">✕</button>
                      </span>
                    )}
                    {orderFilters.status !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                        Estado: {orderFilters.status}
                        <button onClick={() => setOrderFilters({ ...orderFilters, status: 'all' })} className="hover:text-amber-900">✕</button>
                      </span>
                    )}
                    {orderFilters.searchClient && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                        Cliente: "{orderFilters.searchClient}"
                        <button onClick={() => setOrderFilters({ ...orderFilters, searchClient: '' })} className="hover:text-amber-900">✕</button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

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
              <div className="space-y-4">
                {groupOrdersByDate(orders).map((group) => {
                  const isExpanded = expandedOrderGroups[group.key];

                  return (
                    <div key={group.key} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      {/* Header del grupo */}
                      <button
                        onClick={() => toggleOrderGroup(group.key)}
                        className="w-full bg-linear-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-100 hover:from-amber-100 hover:to-orange-100 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <svg
                              className={`w-5 h-5 text-amber-600 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="text-left">
                              <h3 className="text-lg font-bold text-gray-900">{group.title}</h3>
                              <p className="text-sm text-gray-600">
                                {group.orders.length} {group.orders.length === 1 ? 'orden' : 'órdenes'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-amber-600">
                              ${group.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Contenido del grupo (desplegable) */}
                      {isExpanded && (
                        <div className="divide-y divide-gray-100">
                          {group.orders.map((order) => (
                            <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between gap-4">
                                {/* Orden y Fecha */}
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                  <div className="shrink-0">
                                    <p className="text-xs text-gray-500 uppercase">Orden</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                      #{order.id?.substring(0, 8) || 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-AR', {
                                        day: '2-digit',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      }) : 'Sin fecha'}
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
                                          <span key={index} className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
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
                  );
                })}
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
                              src={getImageSrc(product.imgUrl || product.image)}
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
        <div className="fixed inset-0 bg-linear-to-br from-amber-900/40 via-orange-900/40 to-amber-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Crear Nuevo Producto</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', mainImage: null, additionalImages: [] });
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">Imagen Principal * (.jpg, .png, .webp)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setFormData({ ...formData, mainImage: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                />
                {formData.mainImage && (
                  <p className="text-xs text-green-600 mt-1">✓ Archivo seleccionado: {formData.mainImage.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Imágenes Adicionales (opcional) (.jpg, .png, .webp)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setFormData({ ...formData, additionalImages: files });
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                />
                {formData.additionalImages.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-green-600">✓ {formData.additionalImages.length} imagen(es) adicional(es) seleccionada(s):</p>
                    {formData.additionalImages.map((file, index) => (
                      <p key={index} className="text-xs text-gray-600 ml-4">• {file.name}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateProduct}
                  disabled={isCreating}
                  className="flex-1 bg-linear-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creando...' : 'Crear Producto'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', mainImage: null, additionalImages: [] });
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
        <div className="fixed inset-0 bg-linear-to-br from-amber-900/40 via-orange-900/40 to-amber-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">Editar Producto</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProduct(null);
                  setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', mainImage: null, additionalImages: [] });
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nueva Imagen Principal (opcional)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setFormData({ ...formData, mainImage: e.target.files?.[0] || null })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                />
                {formData.mainImage && (
                  <p className="text-xs text-green-600 mt-1">✓ Archivo seleccionado: {formData.mainImage.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nuevas Imágenes Adicionales (opcional)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setFormData({ ...formData, additionalImages: files });
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                />
                {formData.additionalImages.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-green-600">✓ {formData.additionalImages.length} imagen(es) adicional(es) seleccionada(s):</p>
                    {formData.additionalImages.map((file, index) => (
                      <p key={index} className="text-xs text-gray-600 ml-4">• {file.name}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Imagen actual */}
              {(selectedProduct.imgUrl || selectedProduct.image) && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Imagen Actual</label>
                  <img
                    src={getImageSrc(selectedProduct.imgUrl || selectedProduct.image)}
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
                    setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', mainImage: null, additionalImages: [] });
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
