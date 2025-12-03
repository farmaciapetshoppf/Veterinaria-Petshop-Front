'use client'

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react"
import { IUserSession } from "../types";

const API = process.env.NEXT_PUBLIC_API_URL

export interface IAuthContextProps {
    userData: IUserSession | null,
    setUserData: (userData: IUserSession | null) => void
    logout: () => void
    isLoading: boolean
}

export const AuthContext = createContext<IAuthContextProps>({
    userData: null,
    setUserData: () => { },
    logout: () => { },
    isLoading: true
});

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [userData, setUserData] = useState<IUserSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {    
            console.log("🔍 Ejecutando checkSession");
            
            try {
                const res = await fetch(`${API}/auth/me`, {
                    credentials: "include",
                });

                console.log("📡 Status de respuesta:", res.status);

                if (!res.ok) {
                    console.log("❌ Respuesta no OK");
                    setUserData(null);
                    return;
                }

                const user = await res.json();
                console.log("✅ Usuario recibido del backend:", user);
                
                // IMPORTANTE: Asegurarse que el formato coincida con IUserSession
                const formattedUser: IUserSession = {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone || null,
                        address: user.address || null,
                        role: user.role
                    }
                };
                
                console.log("📦 userData formateado:", formattedUser);
                setUserData(formattedUser);
                console.log("💾 setUserData ejecutado");
                
            } catch (err) {
                console.error("❌ Error al verificar sesión:", err);
                setUserData(null);
            } finally {
                console.log("🏁 Finalizando checkSession, isLoading = false");
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    // Log para debug cuando userData cambia
    useEffect(() => {
        console.log("🔄 userData cambió a:", userData);
    }, [userData]);

    const logout = async () => {
        try {
            await fetch(`${API}/auth/signout`, {
                method: "POST",
                credentials: "include"
            });
            console.log("🚪 Logout exitoso");
        } catch (err) {
            console.error("❌ Error al hacer logout:", err);
        } finally {
            setUserData(null);
            router.push("/");
        }
    };

    // CRÍTICO: El loading va DENTRO del Provider
    return (
        <AuthContext.Provider value={{ userData, setUserData, logout, isLoading }}>
            {isLoading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando sesión...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
}