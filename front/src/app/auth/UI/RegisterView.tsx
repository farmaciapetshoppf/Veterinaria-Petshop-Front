'use client'

import { Form, Formik } from 'formik'
import React from 'react'
import FieldFormikCustom from '../../components/FieldFormikCustom/FieldFormikCustom';
import SubmitFormikButton from '../../components/SubmitFormikButton/SubmitFormikButton';
import { validateSchemaRegister } from '@/src/utils/validate';
import Link from 'next/link';

function RegisterView() {
    return (
            <div className='flex flex-col items-center justify-center bg-gray-500'>


                <p className='text-white border-red-500'>Ya tiene cuenta? 
                    <Link href="/auth/login" className='text-blue-500'> ¡Inicie Sesion!</Link>
                </p>


                <Formik
                    initialValues={{ name: "", email: "", password: "", confirmPassword: "", address: "", phone: "" }}
                    validationSchema={validateSchemaRegister}
                    onSubmit={async (values) => {
                        alert("Login enviado " + values.name + "  " + values.email + "  " + values.password);

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
                            className="flex flex-col justify-center items-center my-6 h-160 "
                        >
                            <FieldFormikCustom label="Email:" nameField="email" type="email" placeholder="johnHandcock@mail.com" />

                            <FieldFormikCustom label="Password:" nameField="password" type="password" placeholder="*******" />

                            <FieldFormikCustom label="Confirm Password:" nameField="confirmPassword" type="password" placeholder="*******" />

                            <FieldFormikCustom label="Full Name:" nameField="name" type="text" placeholder="John Handcock" />

                            <FieldFormikCustom label="Address:" nameField="address" type="text" placeholder="123 Av Mitre" />

                            <FieldFormikCustom label="Phone Number:" nameField="phone" type="text" placeholder="155 555 5555" />

                            <SubmitFormikButton text="Register" disabled={
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
