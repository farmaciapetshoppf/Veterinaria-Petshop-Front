'use client';

import React, { useEffect, useState } from 'react'
import ClientDashboard from './ClientDashboard/ClientDashboard'
import VetDashboard from './VetDashboard/VetDashboard'
import AdminDashboard from './AdminDashboard/AdminDashboard'
import { useRole } from '@/src/hooks/useRole'
import { useAuth } from '@/src/context/AuthContext'
import { getVeterinarianById } from '@/src/services/veterinarian.admin.services'

function Page() {
    const { isAdmin, isVeterinarian } = useRole();
    const { userData } = useAuth();
    const [veterinarianData, setVeterinarianData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchVeterinarianData = async () => {
            if (isVeterinarian() && userData?.user?.id) {
                try {
                    const token = localStorage.getItem('authToken') || '';
                    const response = await getVeterinarianById(userData.user.id, token);
                    console.log('📋 Datos del veterinario desde backend:', response);
                    setVeterinarianData(response);
                } catch (error) {
                    console.error('Error al obtener datos del veterinario:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchVeterinarianData();
    }, [userData?.user?.id]); // Solo depende del ID del usuario
    
    // Renderizar según el rol del usuario
    if (isAdmin()) {
        return <AdminDashboard />
    }
    
    if (isVeterinarian()) {
        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando perfil...</p>
                    </div>
                </div>
            );
        }

        const formattedVeterinarian = {
            name: veterinarianData?.data?.name || veterinarianData?.name || userData?.user?.name || 'Veterinario',
            email: veterinarianData?.data?.email || veterinarianData?.email || userData?.user?.email || '',
            phone: veterinarianData?.data?.phone || veterinarianData?.phone || '',
            specialty: veterinarianData?.data?.specialty || veterinarianData?.specialty || 'No especificada',
            license: veterinarianData?.data?.matricula || veterinarianData?.matricula || 'N/A',
            address: veterinarianData?.data?.address || veterinarianData?.address || 'No especificada'
        };

        return <VetDashboard veterinarian={formattedVeterinarian} />
    }
    
    return <ClientDashboard />
}

export default Page
