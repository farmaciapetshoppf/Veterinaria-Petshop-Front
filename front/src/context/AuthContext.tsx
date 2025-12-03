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


    /* TODO: login with cookie */
    useEffect(() => {
        const checkSession = async () => {    
            console.log("ejecutando check");
                    
            setIsLoading(true)
            try {
                const res = await fetch(`http://localhost:3000/auth/me`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    console.log("!res.ok");
                    return;
                }

                const user = await res.json();
                setUserData(user);
                console.log(user); /* TODO: esto esta flama , lee desde el back toda la tada pero userData no la guarda */
                
            } catch (err) {
                console.log("salto error");
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    if (isLoading) {
        return <div>Cargando...</div>; // TODO un spinner
    }

    const logout = async () => {
        await fetch(`${API}/auth/logout`, {
            method: "POST",
            credentials: "include"
        });

        setUserData(null);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ userData, setUserData, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)