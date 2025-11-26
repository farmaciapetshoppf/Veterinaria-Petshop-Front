/* import { ILoginProps, ILoginPropsErrors } from "../types"; */
import * as Yup from 'yup';

const required= 'Campo obligatorio'
const equalPasswords= 'Las constraseñas deben coincidir'
const onlyNumbers= 'Solo se permiten números'
const lenghtPassword= 'La contraseña debe tener mínimo 6 caracteres'
const invalidEmail= 'Formato de email inválido'

export const validateLoginForm = Yup.object({
        email: Yup.string()
        /* .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) */
        .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/, invalidEmail)
        .required(required),
        password: Yup.string().min(6, lenghtPassword).required(required)
})

export const validateSchemaRegister = Yup.object({
        email: Yup.string().matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/, invalidEmail).required(required),
        password: Yup.string().min(6, lenghtPassword ).required(required),
        confirmPassword: Yup.string().oneOf([Yup.ref('password')], equalPasswords),
        name: Yup.string().required(required),
        address: Yup.string().required(required),
        phone: Yup.string().required(required).matches(/^[0-9]+$/, onlyNumbers)
    })