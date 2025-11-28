'use client'

import { Form, Formik } from 'formik'
import React from 'react'
import FieldFormikCustom from '../../components/FieldFormikCustom/FieldFormikCustom'
import SubmitFormikButton from '../../components/SubmitFormikButton/SubmitFormikButton'
import { validateLoginForm } from '@/src/utils/validate'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import googleLogo from "@/src/assets/googleLogo.png"
import { useAuth } from '@/src/context/AuthContext'
import { login } from '@/src/services/user.services'
import PasswordFieldFormik from '../../components/PaswordField/PasswordField'

function LoginView() {

    const { data: session } = useSession()
    /* Llega a traerme lo de google 
    console.log(session?.user);*/

    const {setUserData} = useAuth();

    return (
        <div className='flex flex-col items-center justify-center bg-white'>

            <p className='text-5xl mt-4 text-black'>Ingresá</p>

            <p className='text-black mt-4'>¿No tienes cuenta?
                <Link href="/auth/register"
                    className='text-blue-400 cursor-pointer'> ¡Registrate!</Link>
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
                    const { token, user } = response
                    setUserData({ token, user })
                }}
            >
                {({ isValid, isSubmitting }) => (
                    <Form className="flex flex-col justify-between my-6 border-2 border-gray-300 p-7">

                        <FieldFormikCustom label="Email" nameField="email" type="email" placeholder="johnHandcock@mail.com" />

                        {/* <FieldFormikCustom label="Contraseña" nameField="password" type="password" placeholder="******" /> */}

                        <PasswordFieldFormik label="Contraseña:" nameField="password" type="password" placeholder="********"/>

                        <SubmitFormikButton text="Ingresar" 
                        disabled={!isValid || isSubmitting} />

                        <button onClick={() => signIn()} className='bg-sky-400 hover:bg-sky-500
                        p-3 w-52 flex self-center rounded
                        justify-center cursor-pointer'>
                            <Image src={googleLogo}
                                width={25} height={25} alt='Google Logo'
                                className='mr-5 w-7 h-7 self-center'
                            />
                            Ingresá con Google
                        </button>
                    </Form>
                )}



            </Formik>


        </div>
    )
}

export default LoginView
