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
import { updateUserProfile } from '@/src/services/user.services';
import Image from 'next/image'

export default function ClientDashboard() {
  const { userData, setUserData, activeTab, setActiveTab } = useAuth()
  const [pets, setPets] = useState<IPet[]>([])
  const [showNewPetModal, setShowNewPetModal] = useState(false)
  const [creatingPet, setCreatingPet] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleSaveProfile = async (data: any) => {
    try {
      const updated = await updateUserProfile(userData!.user.id, data)
      // Actualizar el estado global con los nuevos datos
      setUserData({
        ...userData!,
        user: {
          ...userData!.user,
          ...data,
        },

      });
      if (updated) {
        toast.success("Perfil actualizado correctamente");
        setOpenEdit(false)
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      toast.error("Error al intentar editar perfil: Intentelo más tarde");
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
    ownerId: userData!.user.id!
  });

  const handleCreatePet = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingPet(true);

    const newPet = await createPet(newPetForm, userData!.user!.id); // tu lógica
    setPets(prev => [...prev, newPet as IPet])
    setCreatingPet(false);
    setShowNewPetModal(false);
    window.location.reload();
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
    <div className="pt-20 min-h-screen bg-orange-200">
      <div className="pt-6 pb-16">
        <div className="mx-auto  px-4 sm:px-6 md:px-8">

          {/* Header del Dashboard */}
          <div className="">
            <p className="mt-2 text-3xl text-black">
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
                  } whitespace-nowrap cursor-pointer py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Mi Perfil
              </button>
              <button
                onClick={() => setActiveTab('pets')}
                className={`${activeTab === 'pets'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap cursor-pointer py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Mis Mascotas
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`${activeTab === 'orders'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 cursor-pointer px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Mis Compras
              </button>
            </nav>
          </div>

          {/* Contenido según el tab activo */}
          <div className="md:grid md:grid-cols-3  md:gap-x-8">

            {/* PERFIL */}
            {activeTab === 'profile' && (
              <div className="md:col-span-2">
                <div className="bg-white border border-cyan-700 rounded-xl shadow-lg overflow-hidden">

                  <div className="px-8 pb-8">
                    {/* Foto de perfil */}
                    <div className="relative  mb-6">
                      <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-gray-600 shadow-lg">
                        {userData.user.profileImageUrl ? (
                          <Image
                            src={userData.user.profileImageUrl}
                            width={128}
                            height={128}
                            alt="ProfilePicture"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          userData.user.name?.charAt(0) || 'C'
                        )}
                      </div>

                      {/* Botón lápiz */}
                      <label
                        htmlFor="profileImageUpload"
                        className="absolute bottom-2 left-25 bg-orange-500 p-2
                         rounded-full shadow-md cursor-pointer hover:bg-orange-600 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-1.414.586H9v-2z"
                          />
                        </svg>
                      </label>

                      <input
                        id="profileImageUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (!e.target.files || e.target.files.length === 0) return;
                          const file = e.target.files[0];
                          await handleSaveProfile({ profileImage: file });
                        }}
                      />
                    </div>

                    {/* Información personal */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Nombre Completo
                          </label>
                          <p className="mt-2 text-lg text-gray-900">{userData.user.name}</p>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Email
                          </label>
                          <p className="mt-2 text-lg text-gray-900">{userData.user.email}</p>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Teléfono
                          </label>
                          <p className="mt-2 text-lg text-gray-900">{userData.user.phone || 'No especificado'}</p>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Dirección
                          </label>
                          <p className="mt-2 text-lg text-gray-900">{userData.user.address || 'No especificada'}</p>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Ciudad
                          </label>
                          <p className="mt-2 text-lg text-gray-900">
                            {userData.user.country && userData.user.city
                              ? `${userData.user.country} - ${userData.user.city}`
                              : 'No especificada'}
                          </p>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex gap-4 pt-6 border-t">
                        <button
                          onClick={() => setOpenEdit(true)}
                          className="flex-1 px-4 py-2 cursor-pointer
                          rounded-md bg-linear-to-r from-orange-500 to-amber-500 text-white
                          hover:bg-linear-to-r hover:from-orange-600 hover:to-amber-600 hover:text-black
                           transition-colors"
                        >
                          Editar Perfil
                        </button>
                      </div>
                    </div>

                    {/* Modal de edición */}
                    <EditProfileModal
                      open={openEdit}
                      onClose={() => setOpenEdit(false)}
                      user={userData.user}
                      onSave={handleSaveProfile}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MASCOTAS Y TURNOS */}
            {activeTab === 'pets' && (
              <div className="md:col-span-2">
                {

                  pets.length == 0 ? (
                    <p className="text-gray-500 text-center py-8">No tienes mascotas registradas
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 ">
                      {pets.map((pet) => (
                        <CardPet key={pet.id} {...pet} />
                      ))}
                    </div>
                  )}

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
                  ownerId: userData.user.id
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
                  <div className="border-b border-cyan-700 pb-4">
                    <p className="text-sm text-gray-600">Mascotas registradas</p>
                    <p className="text-2xl font-bold text-gray-900">{pets.length}</p>
                  </div>

                  <div className="border-b border-cyan-700  pb-4">
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

                <button
                  onClick={() => setShowNewPetModal(true)}
                  className=" px-4 py-3 ml-3
                  rounded-md bg-linear-to-r from-orange-500 to-amber-500 flex self-center mt-4 text-white
                  hover:bg-linear-to-r hover:from-orange-600 hover:to-amber-600 hover:text-black
                  transition-colors cursor-pointer font-medium"
                >
                  Agregar Nueva Mascota
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
