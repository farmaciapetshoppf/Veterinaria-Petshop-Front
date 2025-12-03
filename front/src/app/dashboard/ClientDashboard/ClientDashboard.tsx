'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import { getPetsByUserId, createPet, Pet, Appointment, NewPetData } from '@/src/app/services/pet.services'
import { getAllOrders } from '@/src/services/order.services'

interface Order {
  id: string
  date: string
  total: number
  status: 'active' | 'delivered'
  items: OrderItem[]
}

interface OrderItem {
  productName: string
  quantity: number
  price: number
}

export default function ClientDashboard() {
  const { userData } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'pets' | 'orders'>('profile')
  const [pets, setPets] = useState<Pet[]>([])
  const [loadingPets, setLoadingPets] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [showNewPetModal, setShowNewPetModal] = useState(false)
  const [newPetForm, setNewPetForm] = useState<NewPetData>({
    nombre: '',
    especie: '',
    sexo: 'MACHO',
    tamano: 'MEDIANO',
    esterilizado: 'NO',
    status: 'VIVO',
    fecha_nacimiento: '',
  })
  const [creatingPet, setCreatingPet] = useState(false)

  // Cargar mascotas del backend
  useEffect(() => {
    try{
    const fetchPets = async () => {
      if (userData?.user?.id) {
        console.log('🐾 Cargando mascotas para usuario ID:', userData.user.id)
        setLoadingPets(true)
        const userPets = await getPetsByUserId(String(userData.user.id))
        console.log('🐾 Mascotas recibidas:', userPets)
        console.log('🐾 Tipo:', typeof userPets, 'Es array:', Array.isArray(userPets))
        setPets(Array.isArray(userPets) ? userPets : [])
        setLoadingPets(false)
      } else {
        console.log('❌ No hay userData o user.id')
      }
    }
    fetchPets()
  }catch(e){
    console.log("Error al obtener mascotas por userId"+e);
    
  }
  }, [userData])

  // Cargar órdenes del backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (userData?.token) {
        console.log('📦 Cargando órdenes del usuario')
        setLoadingOrders(true)
        try {
          const userOrders = await getAllOrders(userData.token)
          console.log('📦 Órdenes recibidas:', userOrders)
          // El backend puede devolver {data: [...]} o directamente [...]
          const ordersData = userOrders.data || userOrders
          setOrders(Array.isArray(ordersData) ? ordersData : [])
        } catch (error) {
          console.error('Error cargando órdenes:', error)
          setOrders([])
        }
        setLoadingOrders(false)
      }
    }

    fetchOrders()
  }, [userData])

  // Si no hay usuario autenticado, mostrar mensaje
  if (!userData) {
    return (
      <div className="bg-white pt-20 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Debes iniciar sesión para ver tu dashboard</p>
      </div>
    )
  }

  // Función para crear una nueva mascota
  const handleCreatePet = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userData?.user?.id) {
      alert('No se pudo obtener el ID del usuario')
      return
    }

    setCreatingPet(true)
    const petData: NewPetData = {
      ...newPetForm,
    }

    console.log('Enviando datos de mascota:', petData)

    const newPet = await createPet(petData, String(userData.user.id))
    
    if (newPet) {
      console.log('Mascota creada exitosamente, recargando lista...')
      // Recargar todas las mascotas desde el backend
      const updatedPets = await getPetsByUserId(String(userData.user.id))
      setPets(Array.isArray(updatedPets) ? updatedPets : [])
      
      setShowNewPetModal(false)
      setNewPetForm({ 
        nombre: '', 
        especie: '', 
        sexo: 'MACHO', 
        tamano: 'MEDIANO', 
        esterilizado: 'NO', 
        status: 'VIVO', 
        fecha_nacimiento: '' 
      })
      alert('¡Mascota creada exitosamente!')
    } else {
      alert('Error al crear la mascota. Por favor, intenta nuevamente.')
    }
    
    setCreatingPet(false)
  }

  return (
    <div className="bg-white pt-20 min-h-screen">
      <div className="pt-6 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          
          {/* Header del Dashboard */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Mi Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Bienvenido, {userData.user.name}
            </p>
          </div>

          {/* Tabs de navegación */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`${
                  activeTab === 'profile'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Mi Perfil
              </button>
              <button
                onClick={() => setActiveTab('pets')}
                className={`${
                  activeTab === 'pets'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Mis Mascotas
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`${
                  activeTab === 'orders'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Mis Compras
              </button>
            </nav>
          </div>

          {/* Contenido según el tab activo */}
          <div className="md:grid md:grid-cols-3 md:gap-x-8">
            
            {/* PERFIL */}
            {activeTab === 'profile' && (
              <div className="md:col-span-2">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Información Personal
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nombre completo</label>
                      <p className="mt-1 text-base text-gray-900">{userData.user.name}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-base text-gray-900">{userData.user.email}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Teléfono</label>
                      <p className="mt-1 text-base text-gray-900">{userData.user.phone || 'No especificado'}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Dirección</label>
                      <p className="mt-1 text-base text-gray-900">{userData.user.address || 'No especificada'}</p>
                    </div>
                  </div>

                  <button className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                    Editar Perfil
                  </button>
                </div>
              </div>
            )}

            {/* MASCOTAS Y TURNOS */}
            {activeTab === 'pets' && (
              <div className="md:col-span-2">
                <div className="space-y-6">
                  {loadingPets ? (
                    <p className="text-gray-500 text-center py-8">Cargando mascotas...</p>
                  ) : pets.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No tienes mascotas registradas</p>
                  ) : (
                    pets.map((pet) => (
                    <div key={pet.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{pet.name}</h2>
                          <p className="text-sm text-gray-600">
                            {pet.species} - {pet.breed} - {pet.age} años
                          </p>
                        </div>
                        <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                          Editar
                        </button>
                      </div>

                      {/* Turnos de esta mascota */}
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Turnos</h3>
                        <div className="space-y-3">
                          {pet.appointments && pet.appointments.length > 0 ? pet.appointments.map((appointment) => (
                            <div
                              key={appointment.id}
                              className="bg-white rounded-md p-4 border border-gray-200"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {appointment.service}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {appointment.veterinarian}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(appointment.date).toLocaleDateString('es-ES', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    appointment.status === 'scheduled'
                                      ? 'bg-blue-100 text-blue-800'
                                      : appointment.status === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {appointment.status === 'scheduled'
                                    ? 'Programado'
                                    : appointment.status === 'completed'
                                    ? 'Completado'
                                    : 'Cancelado'}
                                </span>
                              </div>
                            </div>
                          )) : (
                            <p className="text-sm text-gray-500">No hay turnos programados</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                  )}
                  
                  <button 
                    onClick={() => setShowNewPetModal(true)}
                    className="w-full bg-orange-500 text-white px-4 py-3 rounded-md hover:bg-orange-600 transition-colors font-medium"
                  >
                    + Agregar Nueva Mascota
                  </button>
                </div>
              </div>
            )}

            {/* Modal para agregar nueva mascota */}
            {showNewPetModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Agregar Nueva Mascota
                  </h3>
                  
                  <form onSubmit={handleCreatePet} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        required
                        value={newPetForm.nombre}
                        onChange={(e) => setNewPetForm({ ...newPetForm, nombre: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Especie
                      </label>
                      <input
                        type="text"
                        required
                        value={newPetForm.especie}
                        onChange={(e) => setNewPetForm({ ...newPetForm, especie: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Ej: Perro, Gato"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sexo *
                      </label>
                      <select
                        required
                        value={newPetForm.sexo}
                        onChange={(e) => setNewPetForm({ ...newPetForm, sexo: e.target.value as 'MACHO' | 'HEMBRA' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="MACHO">Macho</option>
                        <option value="HEMBRA">Hembra</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tamaño *
                      </label>
                      <select
                        required
                        value={newPetForm.tamano}
                        onChange={(e) => setNewPetForm({ ...newPetForm, tamano: e.target.value as 'PEQUENO' | 'MEDIANO' | 'GRANDE' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="PEQUENO">Pequeño</option>
                        <option value="MEDIANO">Mediano</option>
                        <option value="GRANDE">Grande</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Esterilizado
                      </label>
                      <select
                        required
                        value={newPetForm.esterilizado}
                        onChange={(e) => setNewPetForm({ ...newPetForm, esterilizado: e.target.value as 'SI' | 'NO' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="SI">Sí</option>
                        <option value="NO">No</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Nacimiento
                      </label>
                      <input
                        type="date"
                        required
                        value={newPetForm.fecha_nacimiento}
                        onChange={(e) => setNewPetForm({ ...newPetForm, fecha_nacimiento: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewPetModal(false)
                          setNewPetForm({ 
                            nombre: '', 
                            especie: '', 
                            sexo: 'MACHO', 
                            tamano: 'MEDIANO', 
                            esterilizado: 'NO', 
                            status: 'VIVO', 
                            fecha_nacimiento: '' 
                          })
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={creatingPet}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={creatingPet}
                      >
                        {creatingPet ? 'Creando...' : 'Agregar'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* COMPRAS */}
            {activeTab === 'orders' && (
              <div className="md:col-span-2">
                {/* Filtros de estado */}
                <div className="mb-6 flex space-x-4">
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium">
                    Todas
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
                    Activas
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
                    Entregadas
                  </button>
                </div>

                <div className="space-y-4">
                  {loadingOrders ? (
                    <p className="text-gray-500 text-center py-8">Cargando órdenes...</p>
                  ) : orders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No tienes órdenes registradas</p>
                  ) : (
                    orders.map((order) => (
                    <div key={order.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Orden #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {order.status === 'active' ? 'En proceso' : 'Entregada'}
                        </span>
                      </div>

                      {/* Items de la orden */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Productos</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-700">
                                {item.productName} x{item.quantity}
                              </span>
                              <span className="text-gray-900 font-medium">
                                ${item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total */}
                      <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-gray-900">${order.total}</span>
                      </div>

                      <button className="mt-4 w-full text-center text-sm text-orange-500 hover:text-orange-600 font-medium">
                        Ver detalles
                      </button>
                    </div>
                  ))
                  )}
                </div>
              </div>
            )}

            {/* Sidebar derecha - Resumen rápido */}
            <div className="mt-8 md:mt-0">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
                
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-sm text-gray-600">Mascotas registradas</p>
                    <p className="text-2xl font-bold text-gray-900">{pets.length}</p>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-4">
                    <p className="text-sm text-gray-600">Turnos programados</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Array.isArray(pets) ? pets.reduce(
                        (acc, pet) =>
                          acc +
                          (pet.appointments ? pet.appointments.filter((app) => app.status === 'scheduled').length : 0),
                        0
                      ) : 0}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Compras activas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {orders.filter((order) => order.status === 'active').length}
                    </p>
                  </div>
                </div>

                <button className="mt-6 w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors text-sm font-medium">
                  Agendar Turno
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
