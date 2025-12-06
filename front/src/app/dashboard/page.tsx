'use client';

import React from 'react'
import ClientDashboard from './ClientDashboard/ClientDashboard'
import VetDashboard from './VetDashboard/VetDashboard'
import AdminDashboard from './AdminDashboard/AdminDashboard'
import { useRole } from '@/src/hooks/useRole'

function Page() {
    const { isAdmin, isVeterinarian } = useRole();
    
    // Mock veterinarian data - esto vendría del backend/sesión
    const mockVeterinarian = {
        name: "María García",
        email: "dra.garcia@vetclinic.com",
        phone: "+54 11 9876-5432",
        specialty: "Medicina General",
        license: "MP 12345",
        address: "Av. Libertador 5678, CABA, Argentina"
    }
    
    // Renderizar según el rol del usuario
    if (isAdmin()) {
        return <AdminDashboard />
    }
    
    if (isVeterinarian()) {
        return <VetDashboard veterinarian={mockVeterinarian} />
    }
    
    return <ClientDashboard />
}

export default Page
