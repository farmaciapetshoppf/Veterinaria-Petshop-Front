'use client'

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react"
import { IUserSession } from "../types";

export interface IAuthContextProps {
    userData: IUserSession | null,
    setUserData: (userData : IUserSession | null) => void
    logout: () => void
}

export const AuthContext = createContext<IAuthContextProps>({
    userData: null,
    setUserData: () => {},
    logout: () => {}
});

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [userData, setUserData] = useState<IUserSession | null>(null);
    const router = useRouter();

    useEffect(() => {
        if(userData){
            localStorage.setItem("userSession",JSON.stringify({
                token: userData.token,
                user: userData.user
            }))
        }
    }, [userData])

    /* TODO ver si este error no afecta setUserData(data)*/
    useEffect(() => {
        const storedData = localStorage.getItem("userSession")
        if (storedData) {
            try {
                const data = JSON.parse(storedData)
                // Solo setear userData si tiene datos válidos
                if (data && data.user && data.token) {
                    setUserData(data)
                } else {
                    // Limpiar localStorage si los datos no son válidos
                    localStorage.removeItem("userSession")
                }
            } catch (error) {
                console.error('Error parsing userSession:', error)
                localStorage.removeItem("userSession")
            }
        }
    }, [])

    const logout = () => {
        setUserData(null)
        localStorage.removeItem("userSession")
        localStorage.removeItem("cart")
        router.push("/")
    }

    return (
        <AuthContext.Provider value={{userData, setUserData, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)