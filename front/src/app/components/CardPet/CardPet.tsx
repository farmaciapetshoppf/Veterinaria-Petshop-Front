import { IPet } from '@/src/types'
import React from 'react'
import Link from 'next/link'

const CardPet: React.FC<IPet> = (pet) => {
  const getPetAge = () => {
    const start = new Date(pet.fecha_nacimiento).getTime()
    const end = pet.fecha_fallecimiento
      ? new Date(pet.fecha_fallecimiento).getTime()
      : Date.now()
    return Math.floor((end - start) / (1000 * 60 * 60 * 24 * 365.25))
  }

  return (
    <Link href={`/pets/${pet.id}`} passHref>
      <div className="bg-linear-to-br from-orange-100 via-orange-200 to-orange-300 
      rounded-xl shadow-lg p-6 my-6 max-w-md mx-auto cursor-pointer
      border border-gray-400 hover:shadow-xl transition-shadow">
        <div className="flex flex-col items-center text-center">
          {/* Nombre principal */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{pet.nombre}</h2>

          {/* Línea decorativa */}
          <div className="w-12 h-1 bg-orange-500 rounded-full mb-4" />

          {/* Información estructurada */}
          <div className="text-sm text-gray-700 space-y-2">
            <p><span className="font-semibold text-gray-800">Raza:</span> {pet.breed || 'No especificada'}</p>
            <p><span className="font-semibold text-gray-800">Especie:</span> {pet.especie}</p>
            <p><span className="font-semibold text-gray-800">Edad:</span> {getPetAge()} años</p>
            <p><span className="font-semibold text-gray-800">Sexo:</span> {pet.sexo}</p>
            
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CardPet
