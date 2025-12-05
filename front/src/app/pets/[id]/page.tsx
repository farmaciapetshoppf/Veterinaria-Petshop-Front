'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Image from 'next/image'
import img from "@/src/assets/dogCat.jpg"

const APIURL = process.env.NEXT_PUBLIC_API_URL

interface Owner {
    id: string
    uid: string
    name: string
    email: string
    user: string
    phone: string
    country: string
    address: string
    city: string
    profileImageUrl: string
    role: string
    isDeleted: boolean
    deletedAt: string | null
}

interface Pet {
    id: string
    nombre: string
    especie: string
    sexo: string
    tamano: string
    esterilizado: string
    status: string
    fecha_nacimiento: string
    fecha_fallecimiento: string | null
    breed: string
    image: string | null
    owner: Owner
    mother: Pet | null
    father: Pet | null
    appointments: any[]
}

export default function PetDetailPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [pet, setPet] = useState<Pet | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const res = await fetch(`${APIURL}/pets/${id}`, { 
                    credentials: 'include' 
                })
                if (!res.ok) throw new Error('Error al obtener la mascota')
                const { data } = await res.json()
                setPet(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchPet()
    }, [id])

    const handleDelete = async () => {
        try {
            const res = await fetch(`${APIURL}/pets/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            })
            if (!res.ok) throw new Error('Error al eliminar la mascota')
            toast.success('Mascota eliminada con éxito')
            router.push('/dashboard') // redirige al perfil
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const handleUpdate = async () => {
        try {
            const updatedData = {
                nombre: 'Rey',
                especie: 'PERRO',
                sexo: 'MACHO',
                tamano: 'MEDIANO',
                esterilizado: 'SI',
                status: 'VIVO',
                fecha_nacimiento: '2020-01-15',
                fecha_fallecimiento: null,
                breed: '1',
                image: null,
            }

            const res = await fetch(`${APIURL}/pets/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedData),
            })

            if (!res.ok) throw new Error('Error al modificar la mascota')
            const { data } = await res.json()
            setPet(data)
            toast.success('Mascota modificada con éxito')
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Cargando información de la mascota...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">Error: {error}</p>
            </div>
        )
    }

    if (!pet) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Mascota no encontrada</p>
            </div>
        )
    }

    const getPetAge = () => {
        const start = new Date(pet.fecha_nacimiento).getTime()
        const end = pet.fecha_fallecimiento
            ? new Date(pet.fecha_fallecimiento).getTime()
            : Date.now()
        return Math.floor((end - start) / (1000 * 60 * 60 * 24 * 365.25))
    }

    return (
        <div className="max-w-2xl mx-auto bg-linear-to-br from-orange-100 via-orange-200 to-orange-300
         rounded-lg shadow-md p-6 mt-21 border border-amber-600">
            <h1 className="text-3xl font-bold flex justify-center text-gray-900 mb-4">{pet.nombre}</h1>

            <div className='flex justify-evenly'>
                <div >
                    <p className="text-gray-700 mb-2"><span className="font-semibold">Especie:</span> {pet.especie}</p>
                    <p className="text-gray-700 mb-2"><span className="font-semibold">Raza:</span> {pet.breed || 'No especificada'}</p>
                    <p className="text-gray-700 mb-2"><span className="font-semibold">Sexo:</span> {pet.sexo}</p>
                    <p className="text-gray-700 mb-2"><span className="font-semibold">Tamaño:</span> {pet.tamano}</p>
                    <p className="text-gray-700 mb-2"><span className="font-semibold">Esterilizado:</span> {pet.esterilizado}</p>
                    <p className="text-gray-700 mb-2"><span className="font-semibold">Estado:</span> {pet.status}</p>
                    <p className="text-gray-700 mb-2"><span className="font-semibold">Edad:</span> {getPetAge()} años</p>
                    <p className="text-gray-700 mb-2"><span className="font-semibold">Fecha de nacimiento:</span> {new Date(pet.fecha_nacimiento).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                    <Image src={img} width={200} height={200} alt='mascota'
                    className='rounded-full '
                    />
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex space-x-4 mt-6">
                <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    Eliminar Mascota
                </button>
                <button
                    onClick={handleUpdate}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Modificar Mascota
                </button>
            </div>
        </div>
    )
}
