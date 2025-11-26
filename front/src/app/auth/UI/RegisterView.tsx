'use client'

import { Form, Formik } from 'formik'
import React from 'react'
import FieldFormikCustom from '../../components/FieldFormikCustom/FieldFormikCustom';
import SubmitFormikButton from '../../components/SubmitFormikButton/SubmitFormikButton';
import { validateSchemaRegister } from '@/src/utils/validate';
import Link from 'next/link';

function RegisterView() {
    return (
            <div className='flex flex-col items-center justify-center bg-white'>

                <p className='text-5xl mt-4 text-black'>Crear una cuenta</p>

                <p className='text-black '>¿Ya tiene cuenta? 
                    <Link href="/auth/login" 
                    className='text-blue-500 cursor-pointer'> ¡Inicia Sesion!</Link>
                </p>

                <Formik
                    initialValues={{ name: "", lastname: "", email: "", password: "", confirmPassword: "", address: "", phone: "" }}
                    validationSchema={validateSchemaRegister}
                    onSubmit={async (values) => {
                        alert("Register enviado " + values.name + "  "+ values.lastname + "  " + values.email + "  " + values.password);

                    }}
                /*
                onSubmit={async (values, {resetForm}) => {
                    await register(values)
                    resetForm();
                    router.push("/auth/login")
                    }} */
                >
                    {({ errors }) => (
                        <Form
                            className="flex flex-col justify-between my-6 border-2 p-7"
                        >
                            <FieldFormikCustom label="Nombre:" nameField="name" type="text" placeholder="John" />

                            <FieldFormikCustom label="Apellido:" nameField="lastname" type="text" placeholder="Handcock" />
                            
                            <FieldFormikCustom label="Email:" nameField="email" type="email" placeholder="johnHandcock@mail.com" />

                            <FieldFormikCustom label="Contraseña:" nameField="password" type="password" placeholder="*******" />

                            <FieldFormikCustom label="Confirmar Contraseña:" nameField="confirmPassword" type="password" placeholder="*******" />

                            <FieldFormikCustom label="Direccion:" nameField="address" type="text" placeholder="123 Av Mitre" />

                            <FieldFormikCustom label="Numero de telefono :" nameField="phone" type="text" placeholder="155 555 5555" />

                            <SubmitFormikButton text="Guardar" disabled={
                                errors.email
                                    || errors.password
                                    || errors.confirmPassword
                                    || errors.address
                                    || errors.name
                                    || errors.phone

                                    ? true : false} />
                        </Form>
                    )}
                </Formik>
            </div>
    )
}

export default RegisterView
