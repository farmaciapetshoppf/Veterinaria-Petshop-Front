'use client'

import { Form, Formik } from 'formik'
import React from 'react'
import FieldFormikCustom from '../../components/FieldFormikCustom/FieldFormikCustom'
import SubmitFormikButton from '../../components/SubmitFormikButton/SubmitFormikButton'
import { validateLoginForm } from '@/src/utils/validate'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import googleLogo from "@/src/assets/googleLogo.png"
import { useAuth } from '@/src/context/AuthContext'
import { getGoogleAuthUrl, login } from '@/src/services/user.services'
import PasswordFieldFormik from '../../components/PaswordField/PasswordField'
import dogCat from "@/src/assets/dogCat.png"
import background from "@/src/assets/huellasFondo.png"

function LoginView() {
    const { setUserData } = useAuth();
    const router = useRouter();
    const [googleLoading, setGoogleLoading] = React.useState(false);

    // Función para obtener datos completos del usuario después del login
    const fetchUserData = async () => {
        try {
            const res = await fetch(`http://localhost:3000/auth/me`, {
                credentials: "include",
            });

            if (!res.ok) {
                console.error("Error al obtener datos del usuario");
                return null;
            }

            const user = await res.json();
            console.log("✅ Datos completos del usuario:", user);
            
            const formattedUser = {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone || null,
                    address: user.address || null,
                    role: user.role
                }
            };
            
            return formattedUser;
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            return null;
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            const { url } = await getGoogleAuthUrl();
            window.location.href = url;
        } catch (error) {
            console.error("Error al obtener URL de autenticación:", error);
            alert("No se pudo iniciar el proceso de autenticación con Google");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className='flex md:justify-around justify-center items-center bg-linear-to-r 
        from-orange-300 via-orange-300 to-orange-200 mt-20 rounded-2xl'>

            <div className='hidden lg:block'>
                <Image src={dogCat} alt="dogCat" width={800} height={800} className='rounded-2xl' />
            </div>

            <div className='flex flex-col ms-10 items-center rounded-2xl
            justify-center p-4 border'
                style={{ background: `url(${background.src})` }}>

                <p className='text-5xl mt-4 text-black'>Ingresá</p>

                <p className='text-black mt-4'>¿No tienes cuenta?
                    <Link href="/auth/register" className='text-blue-500 cursor-pointer'> ¡Registrate!</Link>
                </p>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validateLoginForm}
                    validateOnMount={true}
                    onSubmit={async (values) => {
                        try {
                            console.log("🔐 Iniciando login...");
                            
                            // 1. Hacer login (esto setea la cookie)
                            const response = await login(values);
                            console.log('📝 Login response:', response);

                            // 2. Obtener datos completos del usuario desde /auth/me
                            const userData = await fetchUserData();
                            
                            if (userData) {
                                console.log("💾 Guardando userData completo:", userData);
                                setUserData(userData);
                                
                                // Esperar un momento para que el estado se actualice
                                await new Promise(resolve => setTimeout(resolve, 100));
                                
                                console.log("✅ Login exitoso, redirigiendo...");
                                router.push('/');
                            } else {
                                // Fallback si falla fetchUserData
                                console.warn("⚠️ Usando datos parciales del login");
                                setUserData({
                                    user: {
                                        id: response.id,
                                        name: response.email?.split('@')[0] || 'Usuario',
                                        email: response.email,
                                        phone: null,
                                        address: null,
                                        role: response.role || 'user'
                                    }
                                });
                                router.push('/');
                            }
                        } catch (error) {
                            console.error("❌ Error en login:", error);
                            alert("Error al iniciar sesión. Por favor, intenta nuevamente.");
                        }
                    }}
                >
                    {({ isValid, isSubmitting }) => (
                        <Form className="flex flex-col justify-between my-6 rounded-2xl p-2">

                            <FieldFormikCustom 
                                label="Email:" 
                                nameField="email" 
                                type="email" 
                                placeholder="johnHandcock@mail.com" 
                            />

                            <PasswordFieldFormik 
                                label="Contraseña:" 
                                nameField="password" 
                                type="password" 
                                placeholder="********" 
                            />

                            <SubmitFormikButton 
                                text={isSubmitting ? "Ingresando..." : "Ingresar"}
                                disabled={!isValid || isSubmitting} 
                            />

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={googleLoading}
                                className='bg-white border rounded hover:bg-sky-500
                                p-3 w-70 flex self-center justify-center cursor-pointer
                                disabled:opacity-50 disabled:cursor-not-allowed'>
                                <Image 
                                    src={googleLogo}
                                    width={25} 
                                    height={25} 
                                    alt='Google Logo'
                                    className='mr-5 w-7 h-7 self-center'
                                />
                                {googleLoading ? "Cargando..." : "Ingresá con Google"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default LoginView