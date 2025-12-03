'use client'

import { Form, Formik } from 'formik'
import React from 'react'
import FieldFormikCustom from '../../components/FieldFormikCustom/FieldFormikCustom'
import SubmitFormikButton from '../../components/SubmitFormikButton/SubmitFormikButton'
import { validateLoginForm } from '@/src/utils/validate'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
/* import { signIn, useSession } from 'next-auth/react' */
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

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            const { url } = await getGoogleAuthUrl();
            window.location.href = url; // Redirigir al usuario a la URL de autenticación de Google
        } catch (error) {
            console.error("Error al obtener URL de autenticación:", error);
            alert("No se pudo iniciar el proceso de autenticación con Google");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className='flex md:justify-around justify-center items-center bg-linear-to-r 
        from-orange-300 via-orange-300 to-orange-200 mt-20
         rounded-2xl'
        >

            <div className='hidden lg:block'>
                <Image src={dogCat} alt="dogCat" width={800} height={800} className='rounded-2xl' />
            </div>

            <div className='flex flex-col ms-10 items-center rounded-2xl
            justify-center p-4 border'
                style={{ background: `url(${background.src})` }}
            >

                <p className='text-5xl mt-4 text-black'>Ingresá</p>

                <p className='text-black mt-4'>¿No tienes cuenta?
                    <Link href="/auth/register"
                        className='text-blue-500 cursor-pointer'> ¡Registrate!</Link>
                </p>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validateLoginForm}
                    validateOnMount={true}
                    onSubmit={async (values) => {
                        try {
                            const response = await login(values)
                            console.log('Login response inicial:', response)

                            // Obtener datos completos del usuario
                            const { getUserById } = await import('@/src/services/user.services')
                            const result = await getUserById(response.id)
                            console.log('Datos completos del usuario:', result)

                            if (result && result.data) {
                                const userData = result.data
                                setUserData({
                                    token: response.id || '',
                                    user: {
                                        id: userData.id,
                                        name: userData.name || userData.user || response.email.split('@')[0],
                                        // user es el username
                                        email: userData.email,
                                        address: userData.address || '',
                                        phone: userData.phone || ''
                                    }
                                })
                            } else {
                                // Fallback si falla getUserById
                                setUserData({
                                    token: response.id || '',
                                    user: {
                                        id: response.id,
                                        name: response.email.split('@')[0],
                                        email: response.email,
                                        address: '',
                                        phone: ''
                                    }
                                })
                            }
                        } catch (e) {
                            console.log(e);

                        }

                        // Redirigir al home después del login exitoso
                        router.push('/')
                    }}
                >
                    {({ isValid, isSubmitting }) => (
                        <Form className="flex flex-col justify-between my-6 rounded-2xl p-2"
                        >

                            <FieldFormikCustom label="Email:" nameField="email" type="email" placeholder="johnHandcock@mail.com" />

                            <PasswordFieldFormik label="Contraseña:" nameField="password" type="password" placeholder="********" />

                            <SubmitFormikButton text="Ingresar"
                                disabled={!isValid || isSubmitting} />

                            <button
                                type="button" // Importante: añadir type="button" para que no envíe el formulario
                                onClick={handleGoogleLogin}
                                disabled={googleLoading}
                                className='bg-white border rounded hover:bg-sky-500
                        p-3 w-70 flex self-center
                        justify-center cursor-pointer'>
                                <Image src={googleLogo}
                                    width={25} height={25} alt='Google Logo'
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
