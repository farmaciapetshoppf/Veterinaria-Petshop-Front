'use client'

import { Form, Formik } from 'formik'
import React from 'react'
import FieldFormikCustom from '../../components/FieldFormikCustom/FieldFormikCustom'
import SubmitFormikButton from '../../components/SubmitFormikButton/SubmitFormikButton'
import { validateLoginForm } from '@/src/utils/validate'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'

function LoginView() {

    const {data: session}=  useSession()

    return (
        <div className='flex flex-col items-center justify-center bg-white'>

            <p className='text-5xl mt-4 text-black'>Ingresá</p>

            <p className='text-black mt-4'>¿No tienes cuenta?
                <Link href="/auth/register"
                    className='text-blue-500 cursor-pointer'> ¡Registrate!</Link>
            </p>


            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validateLoginForm}
                onSubmit={async (values) => {
                    alert("Login enviado " + values.email + "  " + values.password);

                }}
            /*
            onSubmit={async (values) => {
                const response = await login(values)
                const {token, user} = response
                setUserData({token,user})
                
            }} */
            >
                {({ errors }) => (
                    <Form className="flex flex-col justify-between my-6 border-2 border-gray-300 p-7">

                        <FieldFormikCustom label="Email" nameField="email" type="email" placeholder="johnHandcock@mail.com" />

                        <FieldFormikCustom label="Contraseña" nameField="password" type="password" placeholder="******" />

                        <SubmitFormikButton text="Ingresar" disabled={errors.email || errors.password ? true : false} />

                        <button onClick={() => signIn()} className='bg-sky-600 p-3 w-1/2 flex self-center justify-center'>
                            Sign In with Google
                        </button>
                    </Form>
                )}



            </Formik>


        </div>
    )
}

export default LoginView
