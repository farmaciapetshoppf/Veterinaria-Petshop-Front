"use client";

import { useRequireRole } from "@/src/hooks/useRole";
import { useAuth } from "@/src/context/AuthContext";
import { useEffect, useState } from "react";
import {
  createVeterinarian,
  getAllVeterinariansAdmin,
  updateVeterinarian,
  deleteVeterinarian,
  toggleVeterinarianStatus,
  ICreateVeterinarian,
  IUpdateVeterinarian,
} from "@/src/services/veterinarian.admin.services";
import { IVeterinarian } from "@/src/types";

export default function VeterinarianManagement() {
  const { isLoading, hasAccess } = useRequireRole("admin");
  const { userData } = useAuth();
  const [veterinarians, setVeterinarians] = useState<IVeterinarian[]>([]);
  const [loadingVets, setLoadingVets] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVet, setEditingVet] = useState<IVeterinarian | null>(null);
  const [formData, setFormData] = useState<ICreateVeterinarian>({
    name: "",
    email: "",
    matricula: "",
    description: "",
    phone: "",
    time: "",
  });

  useEffect(() => {
    if (userData?.token) {
      loadVeterinarians();
    }
  }, [userData]);

  const loadVeterinarians = async () => {
    try {
      setLoadingVets(true);
      const data = await getAllVeterinariansAdmin(userData?.token || "");
      // Asegurarse de que data sea un array
      setVeterinarians(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar veterinarios:", error);
      setVeterinarians([]); // Set vacío en caso de error
    } finally {
      setLoadingVets(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convertir time a formato ISO 8601
      const dataToSend: ICreateVeterinarian = {
        ...formData,
        time: new Date().toISOString(),
      };
      const result = await createVeterinarian(dataToSend, userData?.token || "");
      
      // Mostrar el mensaje completo del backend (incluye contraseña temporal)
      if (result.message) {
        alert(result.message);
      } else if (result.temporaryPassword || result.password) {
        const tempPassword = result.temporaryPassword || result.password;
        alert(
          `✅ Veterinario creado exitosamente\n\n` +
          `📧 Email: ${result.email || formData.email}\n` +
          `🔑 Contraseña temporal: ${tempPassword}\n\n` +
          `⚠️ IMPORTANTE: Guarda esta contraseña, el veterinario debe cambiarla al iniciar sesión.`
        );
      } else {
        alert("Veterinario creado exitosamente");
      }
      
      setShowCreateForm(false);
      setFormData({
        name: "",
        email: "",
        matricula: "",
        description: "",
        phone: "",
        time: "",
      });
      loadVeterinarians();
    } catch (error: any) {
      alert(error.message || "Error al crear veterinario");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVet) return;

    try {
      const updateData: IUpdateVeterinarian = {
        name: formData.name,
        email: formData.email,
        matricula: formData.matricula,
        description: formData.description,
        phone: formData.phone,
        time: formData.time,
      };
      await updateVeterinarian(editingVet.id, updateData, userData?.token || "");
      alert("Veterinario actualizado exitosamente");
      setEditingVet(null);
      setFormData({
        name: "",
        email: "",
        matricula: "",
        description: "",
        phone: "",
        time: "",
      });
      loadVeterinarians();
    } catch (error: any) {
      alert(error.message || "Error al actualizar veterinario");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este veterinario?")) return;

    try {
      await deleteVeterinarian(id, userData?.token || "");
      alert("Veterinario eliminado exitosamente");
      loadVeterinarians();
    } catch (error: any) {
      alert(error.message || "Error al eliminar veterinario");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleVeterinarianStatus(id, userData?.token || "");
      loadVeterinarians();
    } catch (error: any) {
      alert(error.message || "Error al cambiar estado");
    }
  };

  const startEdit = (vet: IVeterinarian) => {
    setEditingVet(vet);
    setFormData({
      name: vet.name,
      email: vet.email,
      matricula: vet.matricula,
      description: vet.description,
      phone: vet.phone,
      time: vet.time,
    });
    setShowCreateForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-amber-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Gestión de Veterinarios
          </h1>
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setEditingVet(null);
              setFormData({
                name: "",
                email: "",
                matricula: "",
                description: "",
                phone: "",
                time: "",
              });
            }}
            className="bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            {showCreateForm ? "Cancelar" : "Crear Veterinario"}
          </button>
        </div>

        {/* Formulario de creación/edición */}
        {(showCreateForm || editingVet) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-amber-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingVet ? "Editar Veterinario" : "Crear Nuevo Veterinario"}
            </h2>
            <form onSubmit={editingVet ? handleUpdate : handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border-2 border-amber-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-2 border-amber-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Matrícula
                  </label>
                  <input
                    type="text"
                    value={formData.matricula}
                    onChange={(e) =>
                      setFormData({ ...formData, matricula: e.target.value })
                    }
                    className="w-full border-2 border-amber-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border-2 border-amber-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Horario
                  </label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="Ej: 9:00 - 18:00"
                    className="w-full border-2 border-amber-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full border-2 border-amber-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
                >
                  {editingVet ? "Actualizar" : "Crear"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingVet(null);
                    setFormData({
                      name: "",
                      email: "",
                      matricula: "",
                      description: "",
                      phone: "",
                      time: "",
                    });
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de veterinarios */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-amber-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Veterinarios Registrados
          </h2>
          {loadingVets ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
            </div>
          ) : veterinarians.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No hay veterinarios registrados
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-amber-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Matrícula
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Teléfono
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {veterinarians.map((vet) => (
                    <tr key={vet.id} className="hover:bg-amber-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{vet.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{vet.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{vet.matricula}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{vet.phone}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleToggleStatus(vet.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            vet.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {vet.isActive ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(vet)}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(vet.id)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
