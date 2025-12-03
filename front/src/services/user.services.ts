

"use client";
import { ILoginProps, IRegister } from "@/src/types/index";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export async function register(userData: IRegister) {
  /* TODO: borrar los console log cuando no sirvan mas */
  console.log(userData);
  console.log(APIURL);

  try {
    const response = await fetch(`${APIURL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });
    /* TODO: borrar este !response.ok cuando ya pueda registrar correctamente (validacion de contraseña) */
    if (!response.ok) {
      const err = await response.json();
      console.log("Backend error:", err);
      throw new Error("Register failed");
    }

    if (response.ok) {
      alert("Usuario registrado con exito");
      return response.json();
    } else {
      alert("Fallo al registrarse");
      throw new Error("Fallo en el servidor al intentar ingresar");
    }
  } catch (error: any) {
    throw new Error(error);
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
    if (response.ok) {
      alert("Se ha logeado con exito");
      return response.json();
    } else {
      alert("Fallo al ingresar");
      throw new Error("Fallo en el servidor al intentar ingresar");
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

// Eliminamos las funciones antiguas de manejo de token y añadimos las nuevas

export async function getGoogleAuthUrl() {
  const res = await fetch(`${APIURL}/auth/google/url`);
  if (!res.ok) throw new Error("Error solicitando URL de autenticación");
  return res.json();
}

// Función para manejar el callback de autenticación
export async function handleAuthCallback() {
  // Obtener el código de la URL o el hash
  const code = new URLSearchParams(window.location.search).get("code");
  const hash = window.location.hash;

  let callbackUrl = `${APIURL}/auth/callback`;
  
  if (code) {
    callbackUrl += `?code=${code}`;
  } else if (hash) {
    callbackUrl += `?hash=${encodeURIComponent(hash)}`;
  } else {
    console.error("No se encontró código o hash en la URL");
    throw new Error("Información de autenticación no encontrada");
  }

  try {
    // Enviar el código o hash al backend
    const response = await fetch(callbackUrl, {
      method: "GET",
      credentials: "include", // Para incluir cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error de autenticación:", errorData);
      throw new Error("Error en la autenticación");
    }
    const response2 = await response.json();    
    return response2
  } catch (error) {
    console.error("Error en el proceso de autenticación:", error);
    throw error;
  }
}

// Mantener la función anterior para compatibilidad, pero actualizada
export async function sendTokenToBackend(token: string) {
  try {
    const response = await fetch(`${APIURL}/auth/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Para recibir cookies
      body: JSON.stringify({ access_token: token }),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function getUserById(id:string) {
  try{
    const response = await fetch(`${APIURL}/users/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user information");
    }

  }catch (e){
    console.log(e);
    
  }
}
