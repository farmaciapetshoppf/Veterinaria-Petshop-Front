const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Mock de mascotas temporario
const MOCK_PETS: Pet[] = [
  {
    id: 'mock-1',
    name: 'Luna',
    species: 'Perro',
    breed: 'Labrador',
    age: 3,
    appointments: [
      {
        id: 'apt-1',
        date: '2024-12-15',
        veterinarian: 'Dr. García',
        service: 'Vacunación',
        status: 'scheduled'
      }
    ]
  },
  {
    id: 'mock-2',
    name: 'Michi',
    species: 'Gato',
    breed: 'Siamés',
    age: 2,
    appointments: [
      {
        id: 'apt-2',
        date: '2024-11-20',
        veterinarian: 'Dra. Martínez',
        service: 'Control general',
        status: 'completed'
      }
    ]
  },
  {
    id: 'mock-3',
    name: 'Rocky',
    species: 'Perro',
    breed: 'Bulldog',
    age: 5,
    appointments: []
  }
];

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
  // TEMPORARIO: Usar mock mientras se arregla el backend
  console.log('⚠️ USANDO MOCK DE MASCOTAS (temporario)')
  return MOCK_PETS;

  /* TODO: Descomentar cuando el backend funcione correctamente
  try {
    console.log('Obteniendo mascotas del usuario:', userId)
    const url = `${API_URL}/users/${userId}`;
    console.log('URL:', url)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('Respuesta getUserPets status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error('Error al obtener las mascotas del usuario');
    }

    const result = await response.json();
    console.log('Datos del usuario con mascotas:', result)
    
    // El backend devuelve {message: '...', data: {id, name, ..., pets: [...]}}
    const userData = result.data || result;
    const pets = userData.pets || [];
    
    console.log('Array de mascotas:', pets)
    console.log('Cantidad de mascotas:', pets.length)
    if (pets.length > 0) {
      console.log('Ejemplo de mascota:', pets[0])
      console.log('Campos de la mascota:', Object.keys(pets[0]))
    }
    
    return Array.isArray(pets) ? pets : [];
  } catch (error) {
    console.error('Error fetching pets:', error);
    return [];
  }
  */
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
  // TEMPORARIO: Simular creación de mascota
  console.log('⚠️ SIMULANDO CREACIÓN DE MASCOTA (temporario)')
  console.log('Datos recibidos:', petData)
  
  const newMockPet: Pet = {
    id: `mock-${Date.now()}`,
    name: petData.nombre,
    species: petData.especie,
    breed: 'Raza desconocida', // El mock no tiene breed en el form
    age: new Date().getFullYear() - new Date(petData.fecha_nacimiento).getFullYear(),
    appointments: []
  };
  
  MOCK_PETS.push(newMockPet);
  console.log('✅ Mascota mock creada:', newMockPet)
  return newMockPet;

  /* TODO: Descomentar cuando el backend funcione correctamente
  try {
    console.log('Enviando petición a:', `${API_URL}/pets/NewPet?userId=${userId}`)
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
    console.log('Mascota creada exitosamente:', result)
    console.log('Datos de la mascota:', result.data || result)
    
    // El backend devuelve {message: '...', data: {...}}
    // Devolvemos solo la data
    return result.data || result;
  } catch (error) {
    console.error('Error creating pet:', error);
    return null;
  }
  */
};
