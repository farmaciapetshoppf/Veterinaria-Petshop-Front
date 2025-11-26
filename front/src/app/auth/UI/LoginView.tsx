'use client'

import {Form, Formik } from 'formik'
import React from 'react'
import FieldFormikCustom from '../../components/FieldFormikCustom/FieldFormikCustom'
import SubmitFormikButton from '../../components/SubmitFormikButton/SubmitFormikButton'
import { validateLoginForm } from '@/src/utils/validate'

function LoginView() {
  return (
    <div className=''>
        <Formik
        /* TODO: hacer validateLoginForm y el AuthContext */
            initialValues={{email:'' , password: ''}}
            validationSchema={validateLoginForm}
            onSubmit={ async (values) => {
                alert("Login enviado "+values.email+ "  "+values.password);
                
            }}
            /* validate={validateLoginForm}
            onSubmit={async (values) => {
                const response = await login(values)
                const {token, user} = response
                setUserData({token,user})
                
            }} */
            >
            {({ errors }) => (
            <Form className="flex flex-col justify-center items-center my-6 h-160">
                <FieldFormikCustom label="Email" nameField="email" type="email" placeholder="johnHandcock@mail.com"/>
                <FieldFormikCustom label="Password" nameField="password" type="password" placeholder="******"/>
                <SubmitFormikButton text="Login" disabled={errors.email || errors.password ? true : false} />
            </Form>
            )}
        </Formik>
    </div>
  )
}

export default LoginView
