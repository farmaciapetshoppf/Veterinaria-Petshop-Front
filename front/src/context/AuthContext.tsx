'use client'

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react"
import { ILoginProps, IUserSession } from "../types";

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

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
            
            try {
                console.log('🔍 Verificando sesión con API:', `${API}/auth/me`);
                
                // Intentar obtener el token de localStorage
                const token = localStorage.getItem('authToken') || '';
                
                const headers: HeadersInit = {
                    'Content-Type': 'application/json'
                };
                
                // Si hay token, agregarlo al header
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                    console.log('🔑 Enviando token en Authorization header');
                }
                
                const res = await fetch(`${API}/auth/me`, {
                    credentials: "include",
                    headers: headers
                });

                if (!res.ok) {
                    console.log('❌ No hay sesión activa (status:', res.status, ')');
                    setUserData(null);
                    localStorage.removeItem('authToken');
                    return;
                }

                const user = await res.json();
                console.log('✅ Sesión activa encontrada:', user.email);
                
                const formattedUser: IUserSession = {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone || null,
                        address: user.address || null,
                        role: user.role,
                        uid: user,
                        user: user.user,
                        country: user.country,
                        city: user.city,
                        isDeleted: user.isDeleted,
                        deletedAt: user.deletedAt,
                        pets: user.pets,
                        buyerSaleOrders: user.buyerSaleOrders,
                        profileImageUrl: user.profileImageUrl
                    },
                    token: token
                };
                
                setUserData(formattedUser);
            } catch (err) {
                setUserData(null);
            } finally {
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
        } catch (err) {
        } finally {
            // Limpiar el token de localStorage
            localStorage.removeItem('authToken');
            setUserData(null);
            router.push("/");
        }
    };

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