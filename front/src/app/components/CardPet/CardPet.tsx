import { IPet } from '@/src/types'
import React from 'react'

const CardPet: React.FC<IPet> = (pet) => {


    const getPetAge = () => {
        const start = new Date(pet.fecha_nacimiento).getTime()
        const end = pet.fecha_fallecimiento
            ? new Date(pet.fecha_fallecimiento).getTime()
            : Date.now()
        return Math.floor((end - start) / (1000 * 60 * 60 * 24 * 365.25))
    }

    return (
        <div>
            <div key={pet.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{pet.nombre}</h2>
                        <p className="text-sm text-gray-600">
                            {pet.especie} - {pet.breed} -
                            {getPetAge()} años
                        </p>
                    </div>
                    <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                        Editar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardPet
