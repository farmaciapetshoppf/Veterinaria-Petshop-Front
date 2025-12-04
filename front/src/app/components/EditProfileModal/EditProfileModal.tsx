"use client";

import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    phone: string | null;
    country: string | null;
    address: string | null;
    city: string | null;
  };
  onSave: (data: {
    name: string;
    phone: string | null;
    country: string | null;
    address: string | null;
    city: string | null;
  }) => Promise<void>;
}

export default function EditProfileModal({ open, onClose, user, onSave }: Props) {
  const [form, setForm] = React.useState({
    name: user.name,
    phone: user.phone ?? "",
    country: user.country ?? "",
    address: user.address ?? "",
    city: user.city ?? "",
  });

  const [loading, setLoading] = React.useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await onSave(form);
    setLoading(false);
    onClose();
  };

  const updateField = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="text"
              value={form.phone ?? ""}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium mb-1">País</label>
            <input
              type="text"
              value={form.country ?? ""}
              onChange={(e) => updateField("country", e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Dirección</label>
            <input
              type="text"
              value={form.address ?? ""}
              onChange={(e) => updateField("address", e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-1">Ciudad</label>
            <input
              type="text"
              value={form.city ?? ""}
              onChange={(e) => updateField("city", e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border rounded-md"
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
