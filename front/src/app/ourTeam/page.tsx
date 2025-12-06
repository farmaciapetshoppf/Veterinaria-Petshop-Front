import OurTeamClient from "./OurTeamClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default async function OurTeam() {
  let vets = [];
  
  try {
    // Intentar obtener veterinarios del backend
    const response = await fetch(`${API_URL}/veterinarians`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      vets = data;
    } else {
      console.log('No se pudieron cargar veterinarios del backend');
    }
  } catch (error) {
    console.error('Error al cargar veterinarios:', error);
  }
  
  // Convertir a formato IVeterinarian
  const formattedVets = vets.map((vet: any) => ({
    id: vet.id.toString(),
    name: vet.name,
    email: vet.email || '',
    matricula: vet.matricula || '',
    description: vet.description || '',
    phone: vet.phone || '',
    time: vet.time || new Date().toISOString(),
    isActive: vet.isActive !== undefined ? vet.isActive : true,
  }));
  
  return <OurTeamClient initialVets={formattedVets} />;
}
