const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Appointment {
  id: string;
  date: string;
  time: string;
  status: boolean;
  pet?: {
    id: string;
    nombre: string;
    especie: string;
    sexo: string;
    tamano: string;
    breed: string;
    image?: string | null;
    owner?: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      user?: string;
      address?: string;
      city?: string;
      country?: string;
      profileImageUrl?: string;
    };
  };
  veterinarian?: {
    id: string;
    name: string;
    email: string;
    matricula: string;
    description?: string;
    phone?: string;
    profileImageUrl?: string;
    isActive?: boolean;
  };
}

export interface CreateAppointmentDTO {
  userId: string;
  petId: string;
  veterinarianId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  detail?: string;
  status?: boolean;
}

/**
 * Obtener todos los turnos de un veterinario específico
 * @param veterinarianId ID del veterinario
 * @param token Token de autenticación
 */
export const getAppointmentsByVetId = async (
  veterinarianId: string,
  token: string
): Promise<Appointment[]> => {
  try {
    console.log('🔍 Obteniendo turnos del veterinario:', veterinarianId);
    
    // Obtener TODOS los appointments y filtrar por veterinario en el frontend
    const response = await fetch(`${API_URL}/appointments/AllAppointments`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('❌ Error al obtener turnos:', response.status);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Respuesta del backend:', result);
    console.log('📝 Mensaje del backend:', result.message);
    console.log('📦 Data del backend:', result.data);
    
    // El backend devuelve { message: string, data: Appointment[] }
    let allAppointments: Appointment[] = [];
    
    if (result.data && Array.isArray(result.data)) {
      allAppointments = result.data;
    } else if (Array.isArray(result)) {
      allAppointments = result;
    }
    
    console.log('📊 Total de turnos recibidos:', allAppointments.length);
    
    // Filtrar solo los turnos del veterinario especificado
    const vetAppointments = allAppointments.filter(
      (apt) => apt.veterinarian?.id === veterinarianId
    );
    
    console.log('✅ Turnos del veterinario filtrados:', vetAppointments.length);
    console.log('📋 Turnos:', vetAppointments);
    return vetAppointments;
  } catch (error) {
    console.error('❌ Error en getAppointmentsByVetId:', error);
    throw error;
  }
};

/**
 * Crear un nuevo turno
 * @param appointmentData Datos del turno a crear
 * @param token Token de autenticación
 */
export const createAppointment = async (
  appointmentData: CreateAppointmentDTO,
  token: string
): Promise<Appointment> => {
  try {
    console.log('📝 Creando turno:', appointmentData);
    
    const response = await fetch(`${API_URL}/appointments/NewAppointment`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error al crear turno:', error);
      throw new Error(error.message || 'Error al crear el turno');
    }

    const result = await response.json();
    console.log('✅ Turno creado:', result);
    
    // El backend devuelve { message: string, data: Appointment }
    return result.data || result;
  } catch (error) {
    console.error('❌ Error en createAppointment:', error);
    throw error;
  }
};
