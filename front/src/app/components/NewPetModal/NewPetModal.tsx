"use client";

import React from "react";
import Select from 'react-select'

const customStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: '#FFDCA8',
    borderRadius: '1rem',
    borderColor: '#0e7490', // cyan-700
    padding: '0.25rem',
    boxShadow: 'none',
    '&:hover': { borderColor: '#f97316' }, // orange-500
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? '#0e7490' : '#FFDCA8', // amber-200
    borderRadius: state.isFocused ? '1rem' : '',
    color: '#1f2937', // gray-800
  }),
}

const especieOptions = [
  { value: 'PERRO', label: 'Perro' },
  { value: 'GATO', label: 'Gato' },
  { value: 'AVE', label: 'Ave' },
  { value: 'ROEDOR', label: 'Roedor' },
  { value: 'REPTIL', label: 'Reptil' },
  { value: 'OTRO', label: 'Otro' },
]

const sexoOptions = [
  { value: 'MACHO', label: 'Macho' },
  { value: 'HEMBRA', label: 'Hembra' },
]

const tamanoOptions = [
  { value: 'PEQUENO', label: 'Pequeño' },
  { value: 'MEDIANO', label: 'Mediano' },
  { value: 'GRANDE', label: 'Grande' },
]

const esterilizadoOptions = [
  { value: 'SI', label: 'Sí' },
  { value: 'NO', label: 'No' },
]

const statusOptions = [
  { value: 'VIVO', label: 'Vivo' },
  { value: 'FALLECIDO', label: 'Fallecido' },
]


interface NewPetForm {
  nombre: string;
  especie: "PERRO" | "GATO" | "AVE" | "ROEDOR" | "REPTIL" | "OTRO";
  sexo: "MACHO" | "HEMBRA";
  tamano: "PEQUENO" | "MEDIANO" | "GRANDE";
  esterilizado: "SI" | "NO";
  status: "VIVO" | "FALLECIDO";
  fecha_nacimiento: string;
  breed: string;
}

interface Props {
  open: boolean;
  creating: boolean;
  form: NewPetForm;
  setForm: (data: NewPetForm) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function NewPetModal({
  open,
  creating,
  form,
  setForm,
  onClose,
  onSubmit,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Achicamos el modal: max-w-sm y menos padding */}
      <div className="absolute inset-0 bg-cyan-700/40 backdrop-blur-sm"/>
      <div className="relative bg-orange-200 p-6 rounded-2xl w-full max-w-md mx-4 shadow-lg z-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Agregar Nueva Mascota
        </h3>

        <form onSubmit={onSubmit} className="space-y-3">
          <form onSubmit={onSubmit} className="space-y-3">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre"
                className="w-full border border-cyan-700 p-2 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Especie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mt-1">Especie</label>
              <Select
                styles={customStyles}
                options={especieOptions}
                value={especieOptions.find(opt => opt.value === form.especie)}
                onChange={(selected) => {
                  if (selected) setForm({ ...form, especie: selected.value })
                }}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Seleccionar especie"
              />
            </div>

            {/* Sexo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mt-1">Sexo</label>
              <Select
                styles={customStyles}
                options={sexoOptions}
                value={sexoOptions.find(opt => opt.value === form.sexo)}
                onChange={(selected) => {
                  if (selected) setForm({ ...form, sexo: selected.value })
                }}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Seleccionar sexo"
              />
            </div>

            {/* Tamaño */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mt-1">Tamaño</label>
              <Select
                styles={customStyles}
                options={tamanoOptions}
                value={tamanoOptions.find(opt => opt.value === form.tamano)}
                onChange={(selected) => {
                  if (selected) setForm({ ...form, tamano: selected.value })
                }}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Seleccionar tamaño"
              />
            </div>

            {/* Esterilizado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mt-1">Esterilizado</label>
              <Select
                styles={customStyles}
                options={esterilizadoOptions}
                value={esterilizadoOptions.find(opt => opt.value === form.esterilizado)}
                onChange={(selected) => {
                  if (selected) setForm({ ...form, esterilizado: selected.value })
                }}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="¿Está esterilizado?"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mt-1">Estado</label>
              <Select
                styles={customStyles}
                options={statusOptions}
                value={statusOptions.find(opt => opt.value === form.status)}
                onChange={(selected) => {
                  if (selected) setForm({ ...form, status: selected.value })
                }}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Estado actual"
              />
            </div>

            {/* Fecha nacimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
              <input
                type="date"
                required
                value={form.fecha_nacimiento}
                onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
                className="w-full border border-cyan-700 p-2 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </form>


          {/* Botones */}
          <div className="flex space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={creating}
              className="flex-1 px-3 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={creating}
              className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
            >
              {creating ? "Creando..." : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
