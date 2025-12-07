'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/src/context/AuthContext'
import { useRouter } from 'next/navigation'
import CompleteTurnModal, { MedicalRecordData } from '@/src/app/components/CompleteTurnModal/CompleteTurnModal'
import { addMedicalRecord } from '@/src/app/services/pet.services'

interface VetAppointment {
  id: string
  date: string
  time: string
  petName: string
  petOwner: string
  service: string
  status: 'pending' | 'completed' | 'cancelled'
  notes?: string
  petId?: string
}

interface VetDashboardProps {
  veterinarian: {
    name: string
    email: string
    phone: string
    specialty: string
    license: string
    address: string
  }
}

export default function VetDashboard({ veterinarian }: VetDashboardProps) {
  const { userData } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<VetAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<VetAppointment | null>(null);

  // TODO: Reemplazar con llamada real al backend
  useEffect(() => {
    const fetchAppointments = async () => {
      // Aquí irá la llamada al backend para obtener turnos del veterinario
      // const token = localStorage.getItem('authToken');
      // const response = await getAppointmentsByVetId(veterinarian.id, token);
      
      // Por ahora usamos mock
      const mockAppointments: VetAppointment[] = [
        {
          id: '1',
          date: '2025-12-07',
          time: '09:00',
          petName: 'Max',
          petOwner: 'Juan Pérez',
          service: 'Control general',
          status: 'pending',
          notes: 'Primera consulta',
          petId: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'
        },
        {
          id: '2',
          date: '2025-12-07',
          time: '10:30',
          petName: 'Luna',
          petOwner: 'María González',
          service: 'Vacunación',
          status: 'pending',
          petId: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q'
        },
        {
          id: '3',
          date: '2025-12-10',
          time: '14:00',
          petName: 'Rocky',
          petOwner: 'Carlos López',
          service: 'Cirugía menor',
          status: 'pending',
          petId: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r'
        },
        {
          id: '4',
          date: '2025-12-15',
          time: '11:00',
          petName: 'Michi',
          petOwner: 'Ana Martínez',
          service: 'Desparasitación',
          status: 'pending',
          petId: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s'
        },
      ];
      
      setAppointments(mockAppointments);
      setLoading(false);
    };

    fetchAppointments();
  }, [veterinarian]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Agregar días vacíos al principio
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Agregar días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getAppointmentsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(app => app.date === dateString);
  };

  const getAppointmentsForSelectedDate = () => {
    return getAppointmentsForDate(selectedDate);
  };

  const handleCompleteAppointment = (appointment: VetAppointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    if (confirm('¿Estás seguro de que deseas cancelar este turno?')) {
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'cancelled' as const }
            : apt
        )
      );
    }
  };

  const handleSubmitMedicalRecord = async (medicalData: MedicalRecordData) => {
    if (!selectedAppointment) return;

    const token = localStorage.getItem('authToken') || '';
    
    const recordData = {
      petId: selectedAppointment.petId || '',
      appointmentId: selectedAppointment.id,
      diagnosis: medicalData.diagnosis,
      treatment: medicalData.treatment,
      medications: medicalData.medications,
      observations: medicalData.observations,
      nextAppointment: medicalData.nextAppointment,
      vaccinations: medicalData.vaccinations,
      weight: medicalData.weight,
      temperature: medicalData.temperature,
    };

    const success = await addMedicalRecord(recordData, token);
    
    if (success) {
      // Actualizar estado del turno
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, status: 'completed' as const }
            : apt
        )
      );
    }
  };

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentMonth(newDate);
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <div className="bg-gray-50 pt-20 min-h-screen">
      <div className="pt-6 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Mi Calendario de Turnos
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Gestiona tus citas y consultas veterinarias
            </p>
          </div>

          <div className="space-y-6">
              {/* CALENDARIO MENSUAL */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 border border-gray-300"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => {
                        setCurrentMonth(new Date());
                        setSelectedDate(new Date());
                      }}
                      className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 border border-gray-300 text-sm"
                    >
                      Hoy
                    </button>
                    <button
                      onClick={() => changeMonth(1)}
                      className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 border border-gray-300"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Nombres de días */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Días del mes */}
                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth(currentMonth).map((day, index) => {
                    if (!day) {
                      return <div key={`empty-${index}`} className="aspect-square" />;
                    }

                    const dayAppointments = getAppointmentsForDate(day);
                    const hasAppointments = dayAppointments.length > 0;

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square p-2 rounded-lg text-center transition-all relative ${
                          isSelected(day)
                            ? 'bg-orange-500 text-white shadow-lg'
                            : isToday(day)
                            ? 'bg-blue-100 text-blue-900 border-2 border-blue-500'
                            : 'bg-white border border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className={`text-sm font-semibold ${isSelected(day) ? 'text-white' : 'text-gray-900'}`}>
                          {day.getDate()}
                        </div>
                        {hasAppointments && (
                          <div className={`text-xs mt-1 ${isSelected(day) ? 'text-white' : 'text-orange-600'} font-medium`}>
                            {dayAppointments.length}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TURNOS DEL DÍA SELECCIONADO */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Turnos del {selectedDate.toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })}
                </h2>
                
                <div className="space-y-4">
                  {getAppointmentsForSelectedDate().length > 0 ? (
                    getAppointmentsForSelectedDate().map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`bg-gray-50 rounded-lg p-5 border-2 transition-all ${
                          appointment.status === 'completed'
                            ? 'border-green-300 bg-green-50'
                            : appointment.status === 'cancelled'
                            ? 'border-red-300 bg-red-50'
                            : 'border-orange-200 hover:border-orange-400 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {appointment.petName}
                              </h3>
                              <span className="text-sm font-medium text-orange-600">
                                {appointment.time}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Dueño: {appointment.petOwner}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {appointment.status === 'completed'
                              ? '✓ Completado'
                              : appointment.status === 'cancelled'
                              ? '✕ Cancelado'
                              : 'Pendiente'}
                          </span>
                        </div>

                        <div className="border-t border-gray-200 pt-3 space-y-2">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Servicio:</span> {appointment.service}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 italic mt-2 p-2 bg-white rounded">
                              <span className="font-medium">Notas:</span> {appointment.notes}
                            </p>
                          )}
                        </div>

                        {appointment.status === 'pending' && (
                          <div className="mt-4 flex space-x-3">
                            <button 
                              onClick={() => handleCompleteAppointment(appointment)}
                              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
                            >
                              ✓ Completar Consulta
                            </button>
                            <button 
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm font-medium"
                            >
                              ✕ Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No hay turnos programados para esta fecha
                    </p>
                  )}
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* Modal para completar consulta */}
      {selectedAppointment && (
        <CompleteTurnModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAppointment(null);
          }}
          onSubmit={handleSubmitMedicalRecord}
          appointment={{
            id: selectedAppointment.id,
            petName: selectedAppointment.petName,
            petOwner: selectedAppointment.petOwner,
            service: selectedAppointment.service,
            date: new Date(selectedAppointment.date).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            time: selectedAppointment.time
          }}
        />
      )}
    </div>
  )
}
