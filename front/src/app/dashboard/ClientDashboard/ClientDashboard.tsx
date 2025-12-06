'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import { createPet, NewPetData } from '@/src/app/services/pet.services'
import { IPet } from '@/src/types'
import CardPet from '../../components/CardPet/CardPet'
import NewPetModal from '../../components/NewPetModal/NewPetModal'
import EditProfileModal from '../../components/EditProfileModal/EditProfileModal'
import OrderList from '../../components/OrderList/OrderList'
import { toast } from 'react-toastify'

export default function ClientDashboard() {
  const { userData, setUserData } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'pets' | 'orders'>('profile')
  const [pets, setPets] = useState<IPet[]>([])
  const [showNewPetModal, setShowNewPetModal] = useState(false)
  const [creatingPet, setCreatingPet] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleSaveProfile = async (data: any) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("country", data.country);
    formData.append("address", data.address);
    formData.append("city", data.city);

    // Si hay imagen seleccionada
    if (data.profileImage) {
      formData.append("profileImage", data.profileImage);
    }

    const res = await fetch(`http://localhost:3000/users/${userData!.user.id}`, {
      method: "PATCH",
      body: formData
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error del servidor:", errorText);
      toast.error("Error al intentar editar perfil");
      return;
    }

    const updated = await res.json();
    if (updated){
      toast.success("Perfil editado con exito")
    }

    setUserData({
      ...userData!,
      user: {
        ...userData!.user,
        ...data,
      },
    });

  } catch (err) {
    toast.error("Error al intentar editar perfil: Intentelo más tarde");
    throw err;
  } finally {
    setOpenEdit(false)
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
    breed: ""
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
    <div className="pt-20 min-h-screen bg-linear-to-br from-orange-100 via-orange-200
               to-orange-200">
      <div className="pt-6 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">

          {/* Header del Dashboard */}
          <div className="">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Mi Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Bienvenido, {userData.user.name}
            </p>
          </div>

          {/* Tabs de navegación */}
          <div className="border-b border-cyan-700 mb-8">
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
                <div className="bg-gre rounded-lg border border-gray-400 p-6">
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
                    className="px-4 py-2 mt-10
                    rounded-md bg-linear-to-r from-orange-500 to-amber-500 text-white cursor-pointer
                    hover:bg-linear-to-r hover:from-orange-600 hover:to-amber-600 hover:text-black
                     "
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
              <div className="md:col-span-2 space-y-6">
                {
                  pets.length == 0 ? (
                    <p className="text-gray-500 text-center py-8">No tienes mascotas registradas
                    </p>
                  ) : (
                    pets.map((pet) => (
                      <CardPet key={pet.id} {...pet} />
                    )))}
                <button
                  onClick={() => setShowNewPetModal(true)}
                  className="w-full  px-4 py-3 
                  rounded-md bg-linear-to-r from-orange-500 to-amber-500 text-white
                hover:bg-linear-to-r hover:from-orange-600 hover:to-amber-600 hover:text-black
                   transition-colors 
                    cursor-pointer font-medium"
                >
                  Agregar Nueva Mascota
                </button>
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
                <h2 className="text-xl font-bold mb-4">Órdenes</h2>
                <OrderList orders={userData?.user.buyerSaleOrders || []} />
              </div>
            )}

            {/* Sidebar derecha - Resumen rápido */}
            <div className="mt-8 md:mt-0">
              <div className="bg-linear-to-br from-orange-100 via-orange-200
               to-orange-200 border border-gray-400  rounded-lg p-6 sticky top-24">
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

                <button className="mt-6 w-full px-4 py-2
                rounded-md bg-linear-to-r from-orange-500 to-amber-500 text-white
                hover:bg-linear-to-r hover:from-orange-600 hover:to-amber-600 hover:text-black
                 transition-colors text-sm font-medium
                 cursor-pointer
                 ">
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
