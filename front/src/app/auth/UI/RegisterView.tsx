'use client'

import { Form, Formik } from 'formik'
import React from 'react'
import FieldFormikCustom from '../../components/FieldFormikCustom/FieldFormikCustom';
import SubmitFormikButton from '../../components/SubmitFormikButton/SubmitFormikButton';
import { validateSchemaRegister } from '@/src/utils/validate';
import Link from 'next/link';
import { register } from '@/src/services/user.services';

function RegisterView() {
    return (
        <div className='flex flex-col items-center justify-center bg-white'>

            <p className='text-5xl mt-4 text-black'>Crear una cuenta</p>

            <p className='text-black '>¿Ya tiene cuenta?
                <Link href="/auth/login"
                    className='text-blue-500 cursor-pointer'> ¡Inicia Sesion!</Link>
            </p>

            <Formik
                initialValues={{ 
                    name: "",
                    email: "",
                    password: "",
                    user:"",
                    phone: "",
                    country:"",
                    address: "",
                    city:"",
                    confirmPassword: "",
                 }}
                /* TODO: quedaria agregar campos para validacion, quiza usar un campo
                 nombre y otro apellido y unirlo manualmente para mantener arquitectura nombre+apellido */
                validationSchema={validateSchemaRegister}

                onSubmit={async (values, { resetForm }) => {
                    await register(values)
                    /* resetForm(); */
                    /* router.push("/auth/login") 
                    TODO: agregar routing */
                }}
            >
                {({ errors }) => (
                    <Form
                        className="flex flex-col justify-between my-6 border-2 p-7"
                    >
                        <FieldFormikCustom label="Nombre y Apellido:" nameField="name" type="text" placeholder="Juan Gutierrez" />

                        <FieldFormikCustom label="Email:" nameField="email" type="email" placeholder="juanGutierrez82@mail.com" />

                        <FieldFormikCustom label="Nombre de usuario:" nameField="user" type="text" placeholder="JGuttierrez" />

                        <FieldFormikCustom label="Contraseña:" nameField="password" type="password" placeholder="********" />

                        <FieldFormikCustom label="Confirmar contraseña:" nameField="confirmPassword" type="password" placeholder="********" />

                        <FieldFormikCustom label="Numero de telefono:" nameField="phone" type="text" placeholder="155 555 5555" />

                        <FieldFormikCustom label="Pais:" nameField="country" type="text" placeholder="Argentina" />

                        <FieldFormikCustom label="Ciudad:" nameField="city" type="text" placeholder="" />

                        <FieldFormikCustom label="Direccion:" nameField="address" type="text" placeholder="123 Av Mitre" />

                        <SubmitFormikButton text="Guardar" disabled={
                            errors.name
                                || errors.email
                                || errors.user
                                || errors.password
                                || errors.confirmPassword
                                || errors.phone
                                || errors.country
                                || errors.city
                                || errors.address

                                ? true : false} />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default RegisterView
