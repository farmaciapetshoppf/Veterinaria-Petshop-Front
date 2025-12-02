import { ILoginProps, IRegister } from "@/src/types/index"

const APIURL = process.env.NEXT_PUBLIC_API_URL

export async function register(userData: IRegister) {
    /* TODO: borrar los console log cuando no sirvan mas */
        console.log(userData);
        console.log(APIURL);
        
    try{
        const response = await fetch(`${APIURL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            
            body: JSON.stringify(userData)
        })
        /* TODO: borrar este !response.ok cuando ya pueda registrar correctamente (validacion de contraseña) */
        if (!response.ok) {
            const err = await response.json();
            console.log("Backend error:", err);
            throw new Error("Register failed");
        }

        if(response.ok){
            alert("Usuario registrado con exito")
            return response.json()
        }else {
            alert("Fallo al registrarse")
            throw new Error("Fallo en el servidor al intentar ingresar")
        }
    }catch(error: any){
        throw new Error(error)
    }
} 

export async function login(userData: ILoginProps) {
    console.log(userData);
    console.log(APIURL);
    try{
        const response = await fetch(`${APIURL}/auth/signin`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(userData)
        })
        if(response.ok){
            alert("Se ha logeado con exito")
            return response.json()
        }else {
            
            alert("Fallo al ingresar")
            throw new Error("Fallo en el servidor al intentar ingresar")
        }
    }catch(error: any){
        throw new Error(error)
    }
}

export async function getUserById(userId: string) {
    try{
        const response = await fetch(`${APIURL}/users/${userId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json"
            }
        })
        if(response.ok){
            return response.json()
        }else {
            throw new Error("Error al obtener datos del usuario")
        }
    }catch(error: any){
        console.error('Error getting user:', error)
        return null
    }
}