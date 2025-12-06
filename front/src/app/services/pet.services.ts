import { IPet } from "@/src/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Pet {
  id: string
  name: string
  species: string
  breed: string
  age: number
  appointments: Appointment[]
}

export interface Appointment {
  id: string
  date: string
  veterinarian: string
  service: string
  status: 'completed' | 'scheduled' | 'cancelled'
}

export interface NewPetData {
  nombre: string
  especie: string
  sexo: 'MACHO' | 'HEMBRA'
  tamano: 'PEQUENO' | 'MEDIANO' | 'GRANDE'
  esterilizado: 'SI' | 'NO'
  status: 'VIVO' | 'FALLECIDO'
  fecha_nacimiento: string
  ownerId: string
}

export const createPet = async (petData: NewPetData, userId: string): Promise<IPet | null> => {

  try {
    console.log('Datos:', petData)
    petData.ownerId = userId
    console.log('User ID:', userId)
    
    const response = await fetch(`${API_URL}/pets/NewPet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(petData),
    });

    console.log('Respuesta status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error del servidor:', errorText)
      throw new Error(`Error al crear la mascota: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Mascota creada exitosamente:', result)
    console.log('Datos de la mascota:', result.data || result)
    
    // El backend devuelve {message: '...', data: {...}}
    // Devolvemos solo la data
    return result.data || result;
  } catch (error) {
    console.error('Error creating pet:', error);
    return null;
  }
};
