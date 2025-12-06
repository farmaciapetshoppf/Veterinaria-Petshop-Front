const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ICreateVeterinarian {
  name: string;
  email: string;
  matricula: string;
  description: string;
  phone: string;
  time: string; // El backend espera ISO 8601
}

export interface IUpdateVeterinarian {
  name?: string;
  email?: string;
  matricula?: string;
  description?: string;
  phone?: string;
  time?: string;
  isActive?: boolean;
}

// Crear veterinario (solo admin)
export const createVeterinarian = async (data: ICreateVeterinarian, token: string) => {
  try {
    const response = await fetch(`${API_URL}/veterinarians`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear veterinario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createVeterinarian:", error);
    throw error;
  }
};

// Actualizar veterinario (solo admin)
export const updateVeterinarian = async (
  id: string,
  data: IUpdateVeterinarian,
  token: string
) => {
  try {
    const response = await fetch(`${API_URL}/veterinarians/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al actualizar veterinario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en updateVeterinarian:", error);
    throw error;
  }
};

// Eliminar veterinario (solo admin)
export const deleteVeterinarian = async (id: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/veterinarians/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al eliminar veterinario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en deleteVeterinarian:", error);
    throw error;
  }
};

// Activar/Desactivar veterinario (solo admin)
export const toggleVeterinarianStatus = async (id: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/veterinarians/${id}/toggle-status`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al cambiar estado del veterinario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en toggleVeterinarianStatus:", error);
    throw error;
  }
};

// Obtener todos los veterinarios (incluye inactivos para admin)
export const getAllVeterinariansAdmin = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/veterinarians`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener veterinarios");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getAllVeterinariansAdmin:", error);
    throw error;
  }
};
