'use client'
import { useState } from 'react'
import { NewPetData } from '@/src/types' // importa tu interfaz

interface Props {
    open: boolean
    onClose: () => void
    pet: NewPetData
    onSave: (updatedData: NewPetData) => Promise<void>
}

export default function EditPetModal({ open, onClose, pet, onSave }: Props) {
    const inputStyle = "w-full border border-cyan-700 p-2 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"

    const [form, setForm] = useState<NewPetData>({
        nombre: pet?.nombre ?? '',
        especie: pet?.especie ?? 'PERRO',
        sexo: pet?.sexo ?? 'MACHO',
        tamano: pet?.tamano ?? 'MEDIANO',
        esterilizado: pet?.esterilizado ?? 'SI',
        status: pet?.status ?? 'VIVO',
        fecha_nacimiento: pet?.fecha_nacimiento ?? '',
        breed: pet?.breed ?? '',
    });

    if (!open) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value as any });
    };

    const handleSubmit = async () => {
        await onSave(form);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-cyan-700/40 backdrop-blur-sm" />
            <div className="relative bg-orange-200 p-6 rounded-2xl w-full max-w-md mx-4 shadow-lg z-10">
                <h2 className="text-xl font-bold mb-4">Editar Mascota</h2>

                <div className="flex flex-col gap-3">
                    <input
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className={inputStyle}
                    />

                    <select name="especie" value={form.especie} onChange={handleChange}
                        className={inputStyle}>
                        <option value="PERRO">Perro</option>
                        <option value="GATO">Gato</option>
                        <option value="AVE">Ave</option>
                        <option value="ROEDOR">Roedor</option>
                        <option value="REPTIL">Reptil</option>
                        <option value="OTRO">Otro</option>
                    </select>

                    <select name="sexo" value={form.sexo} onChange={handleChange}
                        className={inputStyle}>
                        <option value="MACHO">Macho</option>
                        <option value="HEMBRA">Hembra</option>
                    </select>

                    <select name="tamano" value={form.tamano} onChange={handleChange}
                        className={inputStyle}>
                        <option value="PEQUENO">Pequeño</option>
                        <option value="MEDIANO">Mediano</option>
                        <option value="GRANDE">Grande</option>
                    </select>

                    <select name="esterilizado" value={form.esterilizado} onChange={handleChange}
                        className={inputStyle}>
                        <option value="SI">Sí</option>
                        <option value="NO">No</option>
                    </select>

                    <select name="status" value={form.status} onChange={handleChange}
                        className={inputStyle}>
                        <option value="VIVO">Vivo</option>
                        <option value="FALLECIDO">Fallecido</option>
                    </select>

                    <input
                        type="date"
                        name="fecha_nacimiento"
                        value={form.fecha_nacimiento}
                        onChange={handleChange}
                        className={inputStyle}
                    />

                    <input
                        name="breed"
                        value={form.breed}
                        onChange={handleChange}
                        placeholder="Raza"
                        className={inputStyle}
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Guardar</button>
                </div>
            </div>
        </div>
    );
}
