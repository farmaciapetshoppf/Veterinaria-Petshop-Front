'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import { createPet, NewPetData } from '@/src/app/services/pet.services'
import { getOrderHistory } from '@/src/services/order.services'
import { IPet } from '@/src/types'
import CardPet from '../../components/CardPet/CardPet'
import HistoryOrders from './HistoryOrders'

interface Order {
  id: string
  createdAt: string
  total: number
  status: string
  items: OrderItem[]
}

interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  product: {
    id: string
    name: string
    description: string
    price: number
    imgUrl: string
  }
}

export default function ClientDashboard() {
  const { userData } = useAuth()

  const [activeTab, setActiveTab] = useState<'profile' | 'pets' | 'orders'>('profile')
  const [pets, setPets] = useState<IPet[]>([])
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
    fecha_nacimiento: ''
  })

  const [creatingPet, setCreatingPet] = useState(false)

  // Cargar mascotas desde userData al entrar al dashboard
  useEffect(() => {
    if (userData?.user?.pets) {
      setPets(userData.user.pets)
    }
  }, [userData])

  // Cargar órdenes desde el historial cuando se cambia a la pestaña de órdenes
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab !== 'orders') return
      
      if (!userData?.user?.id) return

      setLoadingOrders(true)
      try {
        const historyData = await getOrderHistory(String(userData.user.id), userData.token || '')
        const ordersData = historyData.data || historyData
        setOrders(Array.isArray(ordersData) ? ordersData : [])
      } catch (error) {
        console.error('Error al cargar historial de órdenes:', error)
        setOrders([])
      } finally {
        setLoadingOrders(false)
      }
    }

    fetchOrders()
  }, [activeTab, userData?.user?.id, userData?.token])

  if (!userData) {
    return (
      <div className="bg-white pt-20 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Debes iniciar sesión para ver tu dashboard</p>
      </div>
    )
  }

  const handleCreatePet = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingPet(true)

    const petData: NewPetData = { ...newPetForm }

    const newPet = await createPet(petData, String(userData.user.id))

    if (newPet) {
      // ⭐ Actualización en tiempo real
      setPets(prev => [...prev, newPet as IPet])

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
      alert('Error al crear la mascota.')
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
                className={`${activeTab === 'profile'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Mi Perfil
              </button>
              <button
                onClick={() => setActiveTab('pets')}
                className={`${activeTab === 'pets'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Mis Mascotas
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`${activeTab === 'orders'
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
                  {
                    pets.length == 0 ? (
                      <p className="text-gray-500 text-center py-8">No tienes mascotas registradas
                      </p>
                    ) : (
                      pets.map((pet) => (
                        <CardPet key={pet.id} {...pet} />  
                      )))}
                      {/* Turnos de esta mascota */}
                          {/* <div className="mt-4 border-t border-gray-200 pt-4">
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
                                    {appointment.status}
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
                      </div> */}
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
                <HistoryOrders />
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
                      {orders.filter((order) => order.status === 'PAID' || order.status === 'PENDING').length}
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
