"use client";

import React from "react";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Achicamos el modal: max-w-sm y menos padding */}
      <div className="bg-white rounded-lg p-4 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Agregar Nueva Mascota
        </h3>

        <form onSubmit={onSubmit} className="space-y-3">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Especie */}
          <div>
            <label className="block text-sm font-medium mb-1">Especie</label>
            <select
              required
              value={form.especie}
              onChange={(e) =>
                setForm({
                  ...form,
                  especie: e.target.value as
                    | "PERRO"
                    | "GATO"
                    | "AVE"
                    | "ROEDOR"
                    | "REPTIL"
                    | "OTRO",
                })
              }
              className="w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-orange-500"
            >
              <option value="PERRO">PERRO</option>
              <option value="GATO">GATO</option>
              <option value="AVE">AVE</option>
              <option value="REPTIL">REPTIL</option>
              <option value="ROEDOR">ROEDOR</option>
              <option value="OTRO">OTRO</option>
            </select>
          </div>

          {/* Raza */}
          <div>
            <label className="block text-sm font-medium mb-1">Raza</label>
            <input
              type="text"
              required
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
              className="w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Sexo */}
          <div>
            <label className="block text-sm font-medium mb-1">Sexo</label>
            <select
              required
              value={form.sexo}
              onChange={(e) =>
                setForm({ ...form, sexo: e.target.value as "MACHO" | "HEMBRA" })
              }
              className="w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-orange-500"
            >
              <option value="MACHO">Macho</option>
              <option value="HEMBRA">Hembra</option>
            </select>
          </div>

          {/* Tamaño */}
          <div>
            <label className="block text-sm font-medium mb-1">Tamaño</label>
            <select
              required
              value={form.tamano}
              onChange={(e) =>
                setForm({
                  ...form,
                  tamano: e.target.value as "PEQUENO" | "MEDIANO" | "GRANDE",
                })
              }
              className="w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-orange-500"
            >
              <option value="PEQUENO">Pequeño</option>
              <option value="MEDIANO">Mediano</option>
              <option value="GRANDE">Grande</option>
            </select>
          </div>

          {/* Esterilizado */}
          <div>
            <label className="block text-sm font-medium mb-1">Esterilizado</label>
            <select
              required
              value={form.esterilizado}
              onChange={(e) =>
                setForm({
                  ...form,
                  esterilizado: e.target.value as "SI" | "NO",
                })
              }
              className="w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-orange-500"
            >
              <option value="SI">Sí</option>
              <option value="NO">No</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              required
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as "VIVO" | "FALLECIDO",
                })
              }
              className="w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-orange-500"
            >
              <option value="VIVO">Vivo</option>
              <option value="FALLECIDO">Fallecido</option>
            </select>
          </div>

          {/* Fecha nacimiento */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              required
              value={form.fecha_nacimiento}
              onChange={(e) =>
                setForm({ ...form, fecha_nacimiento: e.target.value })
              }
              className="w-full px-2 py-1 border rounded-md focus:ring-2 focus:ring-orange-500"
            />
          </div>

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
