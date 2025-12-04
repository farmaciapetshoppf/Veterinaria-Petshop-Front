'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import { createPet, NewPetData } from '@/src/app/services/pet.services'
import { IPet, IProduct, Order } from '@/src/types'
import CardPet from '../../components/CardPet/CardPet'
import NewPetModal from '../../components/NewPetModal/NewPetModal'
import EditProfileModal from '../../components/EditProfileModal/EditProfileModal'

export default function ClientDashboard() {
  const { userData, setUserData } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'pets' | 'orders'>('profile')
  const [pets, setPets] = useState<IPet[]>([])
  const [showNewPetModal, setShowNewPetModal] = useState(false)
  const [creatingPet, setCreatingPet] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleSaveProfile = async (data: any) => {
    try {
      const res = await fetch(`https://localhost:3000/users/${userData!.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Error al actualizar el perfil");

      const updated = await res.json();

      // Actualizar el estado global con los nuevos datos
      setUserData({
        ...userData!,
        user: {
          ...userData!.user,
          ...data,
        },
      });

    } catch (err) {
      console.error(err);
      throw err; // Re-lanzar el error para que el modal lo maneje
    }
  };

  const [newPetForm, setNewPetForm] = useState<NewPetData>({
    nombre: "",
    especie: "PERRO",
    sexo: "MACHO",
    tamano: "MEDIANO",
    esterilizado: "SI",
    status: "VIVO",
    fecha_nacimiento: "2020-01-15",
    breed: "",
  });

  const handleCreatePet = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingPet(true);

    const newPet = await createPet(newPetForm, userData!.user!.id); // tu lógica
    setPets(prev => [...prev, newPet as IPet])
    setCreatingPet(false);
    setShowNewPetModal(false);
  };

  // Cargar mascotas desde userData al entrar al dashboard
  useEffect(() => {
    if (userData?.user?.pets) {
      setPets(userData.user.pets)
    }
  }, [userData])

  if (!userData) {
    return (
      <div className="bg-white pt-20 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Debes iniciar sesión para ver tu dashboard</p>
      </div>
    )
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

                  <button
                    onClick={() => setOpenEdit(true)}
                    className="px-4 py-2 mt-10 bg-orange-500 text-white rounded-md"
                  >
                    Editar Perfil
                  </button>

                  <EditProfileModal
                    open={openEdit}
                    onClose={() => setOpenEdit(false)}
                    user={userData.user}
                    onSave={handleSaveProfile}
                  />
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

            <NewPetModal
              open={showNewPetModal}
              creating={creatingPet}
              form={newPetForm}
              setForm={setNewPetForm}
              onClose={() => {
                setShowNewPetModal(false);
                setNewPetForm({
                  nombre: "",
                  especie: "PERRO",
                  sexo: "MACHO",
                  tamano: "MEDIANO",
                  esterilizado: "NO",
                  status: "VIVO",
                  fecha_nacimiento: "",
                  breed: "",
                });
              }}
              onSubmit={handleCreatePet}
            />

            {/* COMPRAS */}
            {activeTab === 'orders' && (
              <div className="md:col-span-2">
                {/* Filtros de estado */}
                <div className="mb-6 flex space-x-4">
                  {/* <button className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium">
                    Todas
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
                    Activas
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
                    Entregadas
                  </button> */}
                </div>
                {userData?.user.buyerSaleOrders.map((order) => (
                  <div key={order.id} className="border p-4 rounded-lg mb-4">
                    <h2 className="font-bold text-lg">Orden #{order.id}</h2>
                    <p>Total: ${order.total}</p>
                    <p>Estado: {order.status}</p>
                    <p>Fecha: {new Date(order.createdAt).toLocaleString()} hs</p>

                    {/* TODO: Modificar para usar el endpoing */}
                    <h3 className="mt-3 font-semibold">Items:</h3>
                    {order.items.map((item) => (
                      <div key={item.product.id} className="ml-4 mt-2">
                        <p>{item.product.name} - {item.product.description}</p>
                        <p>Precio unidad: ${item.product.price}</p>
                      </div>
                    ))}
                  </div>
                ))}
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
                      {userData.user.buyerSaleOrders.filter((order) => order.status === 'ACTIVE').length}
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
