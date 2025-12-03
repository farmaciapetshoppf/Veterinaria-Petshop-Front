'use client'

import { Form, Formik } from 'formik'
import FieldFormikCustom from '../../components/FieldFormikCustom/FieldFormikCustom';
import SubmitFormikButton from '../../components/SubmitFormikButton/SubmitFormikButton';
import { validateSchemaRegister } from '@/src/utils/validate';
import Link from 'next/link';
import { register } from '@/src/services/user.services';
import { useRouter } from 'next/navigation';
import PasswordFieldFormik from '../../components/PaswordField/PasswordField';
import background from "@/src/assets/huellasFondo.png"
import catFood from "@/src/assets/gatoComida.png"
import Image from 'next/image';

function RegisterView() {

    const router = useRouter();

    return (
        <div className='flex md:justify-around justify-center items-center bg-linear-to-r 
        from-orange-300 via-orange-300 to-orange-200 mt-20
         rounded-2xl'>

            <div className='hidden lg:block  '> {/* se oculta cuando el width es menor a 1024px */}
                <Image src={catFood} alt="dogCat" width={500} height={700} className='rounded-2xl' />
            </div>

            <div className='flex flex-col ms-10 items-center rounded-2xl
            justify-center p-4 border'
            style={{background:`url(${background.src})`, backgroundSize: "cover"}}>
                

                <p className='text-5xl mt-4 text-black'>Crear una cuenta</p>

                <p className='text-black mt-4'>¿Ya tiene cuenta?
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
                            className="flex flex-col justify-between my-6 rounded-2xl p-2"
                        >
                            <FieldFormikCustom label="Nombre y Apellido:" nameField="name" type="text" placeholder="Juan Gutierrez" />

                            <FieldFormikCustom label="Email:" nameField="email" type="email" placeholder="juanGutierrez82@mail.com" />

                            {/* <FieldFormikCustom label="Nombre de usuario:" nameField="user" type="text" placeholder="JGuttierrez" /> */}

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
