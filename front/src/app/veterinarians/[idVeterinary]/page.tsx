'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { IVeterinary } from '../../interfaces/veterinary.interface';
import { getVeterinaryById } from '../../services/veterinary.services';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export default function VeterinaryDetailPage() {
  const params = useParams();
  const idVeterinary = params.idVeterinary as string;
  
  const [veterinary, setVeterinary] = useState<IVeterinary | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Generar próximos 7 días
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
      });
    }
    return days;
  };

  // Horarios disponibles (mock)
  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00', available: true },
    { id: '2', time: '10:00', available: true },
    { id: '3', time: '11:00', available: false },
    { id: '4', time: '12:00', available: true },
    { id: '5', time: '14:00', available: true },
    { id: '6', time: '15:00', available: true },
    { id: '7', time: '16:00', available: false },
    { id: '8', time: '17:00', available: true },
  ];

  useEffect(() => {
    const fetchVeterinary = async () => {
      try {
        const data = await getVeterinaryById(idVeterinary);
        setVeterinary(data);
        setSelectedDate(getNextDays()[0].value);
      } catch (error) {
        console.error('Error al cargar veterinario:', error);
      } finally {
        setLoading(false);
      }
    };

    if (idVeterinary) {
      fetchVeterinary();
    }
  }, [idVeterinary]);

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona una fecha y hora');
      return;
    }
    alert(`Turno reservado con ${veterinary?.name} para el ${selectedDate} a las ${selectedTime}`);
  };

  // Función helper para convertir imagen a src
  const getImageSrc = (image: any): string | any => {
    if (!image) return '/next.svg';
    if (typeof image === 'string') {
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
      }
    }
    return image;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!veterinary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">Veterinario no encontrado</p>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-linear-to-b from-amber-50 to-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            
            {/* Información del veterinario - Izquierda */}
            <div className="md:w-1/3 bg-linear-to-br from-amber-100 to-amber-50 p-8">
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 rounded-full overflow-hidden bg-white shadow-lg mb-6">
                  <Image
                    src={getImageSrc(veterinary.image)}
                    alt={veterinary.name}
                    width={192}
                    height={192}
                    className="object-cover w-full h-full"
                  />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  {veterinary.name}
                </h1>
                
                <p className="text-lg text-orange-400 font-medium mb-4">
                  {veterinary.specialty}
                </p>

                <div className="w-full space-y-4 text-sm">
                  <div className="flex items-center justify-center text-gray-700">
                    <span className="font-semibold mr-2">Experiencia:</span>
                    <span>{veterinary.experience} años</span>
                  </div>
                  
                  <div className="pt-4 border-t border-amber-200">
                    <p className="text-gray-700 text-center">{veterinary.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sistema de reserva de turnos - Derecha */}
            <div className="md:w-2/3 p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Reservar Turno</h2>
              
              {veterinary.available ? (
                <>
                  {/* Selector de fecha */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecciona una fecha</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {getNextDays().map((day) => (
                        <button
                          key={day.value}
                          onClick={() => setSelectedDate(day.value)}
                          className={`p-3 rounded-lg text-center transition ${
                            selectedDate === day.value
                              ? 'bg-amber-400 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <div className="text-xs font-medium capitalize">{day.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selector de horario */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecciona un horario</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`p-3 rounded-lg font-medium transition ${
                            selectedTime === slot.time
                              ? 'bg-amber-400 text-white'
                              : slot.available
                              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              : 'bg-gray-50 text-gray-400 cursor-not-allowed line-through'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resumen y botón de confirmación */}
                  {selectedDate && selectedTime && (
                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Resumen de tu turno</h4>
                      <div className="space-y-2 text-gray-700">
                        <p><span className="font-medium">Veterinario:</span> {veterinary.name}</p>
                        <p><span className="font-medium">Especialidad:</span> {veterinary.specialty}</p>
                        <p><span className="font-medium">Fecha:</span> {new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p><span className="font-medium">Hora:</span> {selectedTime}</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleBookAppointment}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-4 px-6 rounded-lg transition shadow-md hover:shadow-lg"
                  >
                    Confirmar Reserva
                  </button>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">Este veterinario no está disponible actualmente</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
