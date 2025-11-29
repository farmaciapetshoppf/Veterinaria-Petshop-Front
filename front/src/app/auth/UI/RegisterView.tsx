'use client'

import { Form, Formik } from 'formik'
import FieldFormikCustom from '../../components/FieldFormikCustom/FieldFormikCustom';
import SubmitFormikButton from '../../components/SubmitFormikButton/SubmitFormikButton';
import { validateSchemaRegister } from '@/src/utils/validate';
import Link from 'next/link';
import { register } from '@/src/services/user.services';
import { useRouter } from 'next/navigation';
import PasswordFieldFormik from '../../components/PaswordField/PasswordField';
import dogCat from "@/src/assets/dogPC.jpg"
import Image from 'next/image';

function RegisterView() {

    const router = useRouter();

    return (
        <div className='flex justify-evenly items-center bg-orange-200
         rounded-2xl'>
            <div className='hidden mt-20 lg:block'> {/* se oculta cuando el width es menor a 1024px */}
                <Image src={dogCat} alt="dogCat" width={350} height={350} className='rounded-2xl' />
            </div>


            <div className='flex flex-col items-center justify-center bg-orange-200 pt-20'>

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
                        user: "",
                        phone: "",
                        country: "",
                        address: "",
                        city: "",
                        confirmPassword: "",
                    }}
                    /* TODO: quedaria agregar campos para validacion, quiza usar un campo
                     nombre y otro apellido y unirlo manualmente para mantener arquitectura nombre+apellido */
                    validationSchema={validateSchemaRegister}
                    validateOnMount={true}

                    onSubmit={async (values, { resetForm }) => {
                        // no envia el confirmPassword al backend (generaba conlfico)
                        const { confirmPassword, ...payload } = values;
                        await register(payload)
                        resetForm();
                        router.push("/auth/login")

                    }}
                >
                    {({ isValid, isSubmitting }) => (
                        <Form
                            className="flex flex-col justify-between my-6 border-2 rounded-2xl bg-white border-gray-300"
                        >
                            <FieldFormikCustom label="Nombre y Apellido:" nameField="name" type="text" placeholder="Juan Gutierrez" />

                            <FieldFormikCustom label="Email:" nameField="email" type="email" placeholder="juanGutierrez82@mail.com" />

                            <FieldFormikCustom label="Nombre de usuario:" nameField="user" type="text" placeholder="JGuttierrez" />

                            {/* <FieldFormikCustom label="Contraseña:" nameField="password" type="password" placeholder="********" /> */}

                            <PasswordFieldFormik label="Contraseña:" nameField="password" type="password" placeholder="********" />

                            <FieldFormikCustom label="Confirmar contraseña:" nameField="confirmPassword" type="password" placeholder="********" />

                            <FieldFormikCustom label="Numero de telefono:" nameField="phone" type="text" placeholder="155 555 5555" />

                            <FieldFormikCustom label="Pais:" nameField="country" type="text" placeholder="Argentina" />

                            <FieldFormikCustom label="Ciudad:" nameField="city" type="text" placeholder="Pringles" />

                            <FieldFormikCustom label="Direccion:" nameField="address" type="text" placeholder="Av Mitre 123" />

                            <SubmitFormikButton text="Guardar" disabled={!isValid || isSubmitting} />
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default RegisterView
