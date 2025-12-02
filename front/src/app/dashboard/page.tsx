import React from 'react'
import dashboard2 from '../../assets/dashboard2.png'
import WorkInProgress from '../components/WorkInProgress/WorkInProgress'
import ClientDashboard from './ClientDashboard/ClientDashboard'
import VetDashboard from './VetDashboard/VetDashboard'

function Page() {
    // Mock veterinarian data - esto vendría del backend/sesión
    const mockVeterinarian = {
        name: "María García",
        email: "dra.garcia@vetclinic.com",
        phone: "+54 11 9876-5432",
        specialty: "Medicina General",
        license: "MP 12345",
        address: "Av. Libertador 5678, CABA, Argentina"
    }
    
    // TODO: Determinar el rol del usuario desde el contexto de autenticación
    const isVeterinarian = false // Cambiar según el rol del usuario
    
    // Renderizar según el rol del usuario
    if (isVeterinarian) {
        return <VetDashboard veterinarian={mockVeterinarian} />
    }
    
    return <ClientDashboard /> //<WorkInProgress image={dashboard2}/>//
    
}

export default Page
