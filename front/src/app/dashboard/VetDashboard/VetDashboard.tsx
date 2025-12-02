'use client'

import React, { useState } from 'react'

interface VetAppointment {
  id: string
  date: string
  time: string
  petName: string
  petOwner: string
  service: string
  status: 'pending' | 'completed' | 'cancelled'
  notes?: string
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
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const mockAppointments: VetAppointment[] = [
    {
      id: '1',
      date: '2025-12-02',
      time: '09:00',
      petName: 'Max',
      petOwner: 'Juan Pérez',
      service: 'Control general',
      status: 'pending',
      notes: 'Primera consulta'
    },
    {
      id: '2',
      date: '2025-12-02',
      time: '10:30',
      petName: 'Luna',
      petOwner: 'María González',
      service: 'Vacunación',
      status: 'pending'
    },
    {
      id: '3',
      date: '2025-12-03',
      time: '14:00',
      petName: 'Rocky',
      petOwner: 'Carlos López',
      service: 'Cirugía menor',
      status: 'pending'
    },
    {
      id: '4',
      date: '2025-12-04',
      time: '11:00',
      petName: 'Michi',
      petOwner: 'Ana Martínez',
      service: 'Desparasitación',
      status: 'pending'
    },
    {
      id: '5',
      date: '2025-12-05',
      time: '16:00',
      petName: 'Toby',
      petOwner: 'Luis Fernández',
      service: 'Control dental',
      status: 'pending'
    },
    {
      id: '6',
      date: '2025-12-06',
      time: '10:00',
      petName: 'Nina',
      petOwner: 'Sofia Ruiz',
      service: 'Consulta dermatológica',
      status: 'pending'
    },
    {
      id: '7',
      date: '2025-12-06',
      time: '15:00',
      petName: 'Buddy',
      petOwner: 'Pedro Gómez',
      service: 'Corte de uñas',
      status: 'pending'
    }
  ]

  const getWeekDays = () => {
    const today = new Date()
    const weekDays = []
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - dayOfWeek + 1)

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday)
      day.setDate(monday.getDate() + i)
      weekDays.push(day)
    }
    return weekDays
  }

  const weekDays = getWeekDays()
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return mockAppointments.filter(app => app.date === dateString)
  }

  const filteredAppointments = selectedDate
    ? mockAppointments.filter(app => app.date === selectedDate)
    : mockAppointments

  return (
    <div className="bg-white pt-20 min-h-screen">
      <div className="pt-6 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard Veterinario
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Bienvenido, Dr./Dra. {veterinarian.name}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Mi Perfil
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Nombre</label>
                    <p className="mt-1 text-sm text-gray-900">{veterinarian.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Matrícula</label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold">{veterinarian.license}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Especialidad</label>
                    <p className="mt-1 text-sm text-gray-900">{veterinarian.specialty}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{veterinarian.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Teléfono</label>
                    <p className="mt-1 text-sm text-gray-900">{veterinarian.phone}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Consultorio</label>
                    <p className="mt-1 text-sm text-gray-900">{veterinarian.address}</p>
                  </div>
                </div>

                <button className="mt-6 w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors text-sm font-medium">
                  Editar Perfil
                </button>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Resumen Semanal</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Total turnos</span>
                      <span className="text-lg font-bold text-gray-900">{mockAppointments.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Pendientes</span>
                      <span className="text-lg font-bold text-orange-500">
                        {mockAppointments.filter(app => app.status === 'pending').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Turnos de la Semana
                </h2>
                
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, index) => {
                    const appointments = getAppointmentsForDate(day)
                    const dateString = day.toISOString().split('T')[0]
                    const isSelected = selectedDate === dateString
                    const isToday = day.toDateString() === new Date().toDateString()
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(dateString)}
                        className={`p-3 rounded-lg text-center transition-all ${
                          isSelected
                            ? 'bg-orange-500 text-white shadow-lg'
                            : isToday
                            ? 'bg-blue-100 text-blue-900 border-2 border-blue-500'
                            : 'bg-white border border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="text-xs font-medium mb-1">
                          {daysOfWeek[index]}
                        </div>
                        <div className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {day.getDate()}
                        </div>
                        {appointments.length > 0 && (
                          <div className={`text-xs mt-1 ${isSelected ? 'text-white' : 'text-orange-600'}`}>
                            {appointments.length} turno{appointments.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setSelectedDate(null)}
                  className="mt-4 text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  Ver todos los turnos
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {selectedDate 
                    ? `Turnos del ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'long' 
                      })}`
                    : 'Todos los Turnos'}
                </h2>
                
                <div className="space-y-4">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`rounded-lg p-5 border-2 transition-all ${
                          appointment.status === 'pending'
                            ? 'bg-white border-orange-400 hover:shadow-md'
                            : 'bg-gray-100 border-gray-300 opacity-60'
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
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              appointment.status === 'pending'
                                ? 'bg-orange-100 text-orange-800'
                                : appointment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {appointment.status === 'pending'
                              ? 'Pendiente'
                              : appointment.status === 'completed'
                              ? 'Completado'
                              : 'Cancelado'}
                          </span>
                        </div>

                        <div className="border-t border-gray-200 pt-3 space-y-2">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Servicio:</span> {appointment.service}
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Fecha:</span>{' '}
                            {new Date(appointment.date).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 italic mt-2 p-2 bg-gray-50 rounded">
                              <span className="font-medium">Notas:</span> {appointment.notes}
                            </p>
                          )}
                        </div>

                        {appointment.status === 'pending' && (
                          <div className="mt-4 flex space-x-3">
                            <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-medium">
                              ✓ Completar
                            </button>
                            <button className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm font-medium">
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
      </div>
    </div>
  )
}
