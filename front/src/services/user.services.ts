"use client";

import { ILoginProps, IRegister } from "@/src/types/index";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function register(userData: IRegister) {
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
      throw new Error(err.message || "Register failed");
    }

    const result = await response.json();
    alert("Usuario registrado con éxito");
    return result;
  } catch (error: any) {
    alert("Error al registrarse, intentelo nuevamente");
    throw error;
  }
}

export async function login(userData: ILoginProps) {
  try {  
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
      alert("Error al ingresar: " + (error.message || "Credenciales inválidas"));
      throw new Error(error.message || "Fallo al ingresar");
    }

    const result = await response.json();
    alert("Se ha logueado con éxito");
    console.log("1111"+result);
    
    return result;
  } catch (error: any) {
    throw error;
  }
}

export async function getGoogleAuthUrl() {
  try {
    const res = await fetch(`${APIURL}/auth/google/url`);
    if (!res.ok) throw new Error("Error solicitando URL de autenticación");
    return res.json();
  } catch (error) {
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
    throw new Error("Información de autenticación no encontrada");
  }

  try {
    const response = await fetch(callbackUrl, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {/* 
      const errorData = await response.json();
      console.error("❌ Error de autenticación:", errorData); */
      throw new Error("Error en la autenticación");
    }
    
    const response2 = await response.json();
    return response2;
  } catch (error) {
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
    throw error;
  }
}

export async function getUserById(id: string) {
  try {    
    const response = await fetch(`${APIURL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to get user information");
    }

    const userData = await response.json();
    return { data: userData };
  } catch (error) {
    throw error;
  }
}