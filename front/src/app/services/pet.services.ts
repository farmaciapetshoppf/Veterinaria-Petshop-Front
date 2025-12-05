import { IPet } from "@/src/types";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  especie: "PERRO" | "GATO" | "AVE" | "ROEDOR" | "REPTIL" | "OTRO"
  sexo: 'MACHO' | 'HEMBRA'
  tamano: 'PEQUENO' | 'MEDIANO' | 'GRANDE'
  esterilizado: 'SI' | 'NO'
  status: 'VIVO' | 'FALLECIDO'
  fecha_nacimiento: string
  breed: string
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
      toast.error('No se pudo crear la mascota, intente nuevamente')
      throw new Error(`Error al crear la mascota: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    toast.success('Mascota creada exitosamente')
    /* console.log('Datos de la mascota:', result.data || result) */
    
    // El backend devuelve {message: '...', data: {...}}
    // Devolvemos solo la data
    return result.data || result;
  } catch (error) {
    console.error('Error creating pet:', error);
    toast.error('No se pudo crear la mascota, intente nuevamente')
    return null;
  }
};
