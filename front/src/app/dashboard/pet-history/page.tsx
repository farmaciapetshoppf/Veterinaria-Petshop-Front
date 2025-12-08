'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PetSearchBar from '@/src/app/components/PetSearchBar/PetSearchBar';
import { Pet, getPetMedicalHistory } from '@/src/app/services/pet.services';

export default function PetMedicalHistoryPage() {
  const router = useRouter();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePetSelect = async (pet: Pet) => {
    setSelectedPet(pet);
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken') || '';
      const history = await getPetMedicalHistory(pet.id, token);
      setMedicalHistory(history);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedPet(null);
    setMedicalHistory(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'scheduled':
        return 'Programado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="bg-gray-50 pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-orange-500 hover:text-orange-600 font-semibold mb-4 flex items-center gap-2"
          >
            ← Volver al Calendario
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Historial Médico de Mascotas</h1>
          <p className="text-gray-600 mt-2">Busca una mascota para ver su historial médico completo</p>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-8">
          <PetSearchBar onSelectPet={handlePetSelect} />
        </div>

        {/* Mascota seleccionada */}
        {selectedPet && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header con info de la mascota */}
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-orange-600">
                    {selectedPet.name.charAt(0)}
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{selectedPet.name}</h2>
                    <p className="text-orange-100">
                      {selectedPet.species} • {selectedPet.breed} • {selectedPet.age} años
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClearSelection}
                  className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                >
                  Buscar otra mascota
                </button>
              </div>
            </div>

            {/* Historial médico */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando historial médico...</p>
                  </div>
                </div>
              ) : medicalHistory ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Consultas y Tratamientos</h3>
                  
                  {selectedPet.appointments && selectedPet.appointments.length > 0 ? (
                    <div className="space-y-4">
                      {selectedPet.appointments.map((appointment, index) => (
                        <div
                          key={appointment.id || index}
                          className="bg-gray-50 rounded-lg p-5 border-2 border-gray-200 hover:border-orange-300 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {appointment.service}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Veterinario: {appointment.veterinarian}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </span>
                          </div>

                          <div className="border-t border-gray-300 pt-3">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Fecha:</span>{' '}
                              {new Date(appointment.date).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">No hay consultas registradas para esta mascota</p>
                    </div>
                  )}

                  {/* Información adicional del historial */}
                  {medicalHistory?.vaccinations && medicalHistory.vaccinations.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Vacunaciones</h3>
                      <div className="space-y-2">
                        {medicalHistory.vaccinations.map((vaccine: any, index: number) => (
                          <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{vaccine.name}</p>
                                <p className="text-sm text-gray-600">
                                  Aplicada: {new Date(vaccine.date).toLocaleDateString('es-ES')}
                                </p>
                              </div>
                              {vaccine.nextDue && (
                                <div className="text-sm bg-blue-100 px-3 py-1 rounded-full">
                                  <span className="text-blue-800 font-medium">
                                    Próxima: {new Date(vaccine.nextDue).toLocaleDateString('es-ES')}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {medicalHistory?.allergies && medicalHistory.allergies.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">⚠️ Alergias</h3>
                      <div className="flex flex-wrap gap-2">
                        {medicalHistory.allergies.map((allergy: string, index: number) => (
                          <span key={index} className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-medium">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {medicalHistory?.medications && medicalHistory.medications.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">💊 Medicamentos Actuales</h3>
                      <div className="space-y-3">
                        {medicalHistory.medications.map((medication: any, index: number) => (
                          <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <p className="font-medium text-gray-900 mb-1">{medication.name}</p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Dosis:</span> {medication.dosage}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Duración:</span> {medication.duration}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {medicalHistory?.notes && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">📋 Notas Clínicas</h3>
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <p className="text-gray-700 leading-relaxed">{medicalHistory.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No se pudo cargar el historial médico</p>
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedPet && (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
            <p className="text-gray-600 text-lg">
              Busca una mascota para ver su historial médico completo
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
