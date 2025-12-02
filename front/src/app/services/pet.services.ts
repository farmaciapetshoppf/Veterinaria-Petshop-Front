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

export const getPetsByUserId = async (userId: string): Promise<Pet[]> => {
  try {
    console.log('Obteniendo todas las mascotas para filtrar por usuario:', userId)
    const url = `${API_URL}/pets/AllPets`;
    console.log('URL:', url)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('Respuesta getPets status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error('Error al obtener las mascotas');
    }

    const allPets = await response.json();
    console.log('Todas las mascotas:', allPets)
    
    // El backend devuelve {message: '...', data: [...]}
    const petsArray = allPets.data || allPets;
    
    // Ver estructura de la primera mascota para identificar el campo correcto
    if (petsArray.length > 0) {
      console.log('Ejemplo de mascota:', petsArray[0])
      console.log('Campos de la mascota:', Object.keys(petsArray[0]))
    }
    
    // Filtrar las mascotas del usuario específico
    const userPets = Array.isArray(petsArray) 
      ? petsArray.filter((pet: any) => {
          console.log(`Comparando pet userId: ${pet.userId || pet.user_id || pet.usuarioId} con ${userId}`)
          return pet.userId === userId || pet.user_id === userId || pet.usuarioId === userId
        })
      : [];
    
    console.log('Mascotas del usuario:', userPets)
    return userPets;
  } catch (error) {
    console.error('Error fetching pets:', error);
    return [];
  }
};

export interface NewPetData {
  nombre: string
  especie: string
  sexo: 'MACHO' | 'HEMBRA'
  tamano: 'PEQUENO' | 'MEDIANO' | 'GRANDE'
  esterilizado: 'SI' | 'NO'
  status: 'VIVO' | 'FALLECIDO'
  fecha_nacimiento: string
}

export const createPet = async (petData: NewPetData, userId: string): Promise<Pet | null> => {
  try {
    console.log('Enviando petición a:', `${API_URL}/pets/NewPet`)
    console.log('Datos:', petData)
    console.log('User ID:', userId)
    
    const response = await fetch(`${API_URL}/pets/NewPet?userId=${userId}`, {
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
    console.log('Mascota creada:', result)
    
    // El backend devuelve {message: '...', data: {...}}
    // Devolvemos solo la data
    return result.data || result;
  } catch (error) {
    console.error('Error creating pet:', error);
    return null;
  }
};
