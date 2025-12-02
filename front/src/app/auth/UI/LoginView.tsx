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
import { login } from '@/src/services/user.services'
import PasswordFieldFormik from '../../components/PaswordField/PasswordField'
import dogCat from "@/src/assets/dogCat.jpg"

function LoginView() {

    /* const { data: session } = useSession() */
    /* Llega a traerme lo de google 
    console.log(session?.user);*/

    const { setUserData } = useAuth();
    const router = useRouter();

    return (
        <div className='flex justify-evenly items-center bg-orange-200
         rounded-2xl pt-20'>
            <div className='hidden lg:block'> {/* se oculta cuando el width es menor a 1024px */}
                <Image src={dogCat} alt="dogCat" width={350} height={350} className='rounded-2xl'/>
            </div>

            <div className='flex flex-col items-center justify-center bg-orange-200'>

                <p className='text-5xl mt-4 text-black'>Ingresá</p>

                <p className='text-black mt-4'>¿No tienes cuenta?
                    <Link href="/auth/register"
                        className='text-blue-500 cursor-pointer'> ¡Registrate!</Link>
                </p>


                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validateLoginForm}
                    validateOnMount={true}
                    /* onSubmit={async (values) => {
                        alert("Login enviado " + values.email + "  " + values.password);
    
                    }} */

                    onSubmit={async (values) => {
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
                                    name: userData.user || userData.name || response.email.split('@')[0], // user es el username
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
                        
                        // Redirigir al home después del login exitoso
                        router.push('/')
                    }}
                >
                    {({ isValid, isSubmitting }) => (
                        <Form className="flex flex-col justify-between my-6 border-2 rounded-2xl bg-white border-gray-300 p-7">

                            <FieldFormikCustom label="Email:" nameField="email" type="email" placeholder="johnHandcock@mail.com" />

                            {/* <FieldFormikCustom label="Contraseña" nameField="password" type="password" placeholder="******" /> */}

                            <PasswordFieldFormik label="Contraseña:" nameField="password" type="password" placeholder="********" />

                            <SubmitFormikButton text="Ingresar"
                                disabled={!isValid || isSubmitting} />

                            {/* <button onClick={() => signIn()} className='bg-sky-400 hover:bg-sky-500
                        p-3 w-52 flex self-center rounded
                        justify-center cursor-pointer'>
                                <Image src={googleLogo}
                                    width={25} height={25} alt='Google Logo'
                                    className='mr-5 w-7 h-7 self-center'
                                />
                                Ingresá con Google
                            </button> */}
                        </Form>
                    )}



                </Formik>


            </div>
        </div>
    )
}

export default LoginView
