"use client";

import { ILoginProps, IRegister } from "@/src/types/index";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function register(userData: IRegister) {
  console.log("📝 Registrando usuario:", userData);
  console.log("🌐 API URL:", APIURL);

  try {
    const response = await fetch(`${APIURL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("❌ Backend error:", err);
      throw new Error(err.message || "Register failed");
    }

    const result = await response.json();
    alert("Usuario registrado con éxito");
    return result;
  } catch (error: any) {
    console.error("❌ Error en register:", error);
    alert("Error al registrarse: " + error.message);
    throw error;
  }
}

export async function login(userData: ILoginProps) {
  try {
    console.log("🔐 Intentando login con:", userData.email);
    
    const response = await fetch(`${APIURL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Error en login:", error);
      alert("Error al ingresar: " + (error.message || "Credenciales inválidas"));
      throw new Error(error.message || "Fallo al ingresar");
    }

    const result = await response.json();
    console.log("✅ Login exitoso:", result);
    alert("Se ha logueado con éxito");
    return result;
  } catch (error: any) {
    console.error("❌ Error en login:", error);
    throw error;
  }
}

export async function getGoogleAuthUrl() {
  try {
    const res = await fetch(`${APIURL}/auth/google/url`);
    if (!res.ok) throw new Error("Error solicitando URL de autenticación");
    return res.json();
  } catch (error) {
    console.error("❌ Error obteniendo Google Auth URL:", error);
    throw error;
  }
}

export async function handleAuthCallback() {
  const code = new URLSearchParams(window.location.search).get("code");
  const hash = window.location.hash;

  let callbackUrl = `${APIURL}/auth/callback`;
  
  if (code) {
    callbackUrl += `?code=${code}`;
  } else if (hash) {
    callbackUrl += `?hash=${encodeURIComponent(hash)}`;
  } else {
    console.error("❌ No se encontró código o hash en la URL");
    throw new Error("Información de autenticación no encontrada");
  }

  try {
    const response = await fetch(callbackUrl, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Error de autenticación:", errorData);
      throw new Error("Error en la autenticación");
    }
    
    const response2 = await response.json();
    console.log("✅ Callback exitoso:", response2);
    return response2;
  } catch (error) {
    console.error("❌ Error en el proceso de autenticación:", error);
    throw error;
  }
}

export async function sendTokenToBackend(token: string) {
  try {
    const response = await fetch(`${APIURL}/auth/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ access_token: token }),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error en sendTokenToBackend:", error);
    throw error;
  }
}

// FIX: Corregir getUserById para que realmente devuelva datos
export async function getUserById(id: string) {
  try {
    console.log("🔍 Obteniendo usuario por ID:", id);
    
    // Cambiar a GET en lugar de POST
    const response = await fetch(`${APIURL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("❌ Error al obtener usuario");
      throw new Error("Failed to get user information");
    }

    const userData = await response.json();
    console.log("✅ Usuario obtenido:", userData);
    return { data: userData };
  } catch (error) {
    console.error("❌ Error en getUserById:", error);
    throw error;
  }
}