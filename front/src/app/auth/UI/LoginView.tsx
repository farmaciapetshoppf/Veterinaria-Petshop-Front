'use client'

import { Form, Formik } from 'formik'
import React from 'react'
import FieldFormikCustom from '../../components/FieldFormikCustom/FieldFormikCustom'
import SubmitFormikButton from '../../components/SubmitFormikButton/SubmitFormikButton'
import { validateLoginForm } from '@/src/utils/validate'
import Link from 'next/link'
import Image from 'next/image'
import googleLogo from "@/src/assets/googleLogo.png"
import { useAuth } from '@/src/context/AuthContext'
import { getGoogleAuthUrl, login } from '@/src/services/user.services'
import PasswordFieldFormik from '../../components/PaswordField/PasswordField'
import dogCat from "@/src/assets/dogCat.png"
import background from "@/src/assets/huellasFondo.png"
import { IUser, IUserSession } from '@/src/types'
import { toast } from 'react-toastify'

function LoginView() {
  const { setUserData } = useAuth();
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const { url } = await getGoogleAuthUrl();
      if (url) {
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
        toast.success("Se ha ingresado exitosamente");
      }
      window.location.href = url;
    } catch (error) {
      console.error("Error al obtener URL de autenticación:", error);
      toast.error("No se pudo iniciar con Google");
    } finally {

      setGoogleLoading(false);
    }
  };

  return (
    <div
      className="flex md:justify-around justify-center items-center 
      bg-linear-to-r from-orange-300 via-orange-300 to-orange-200
      mt-20 rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Imagen lateral */}
      <div className="hidden lg:block">
        <Image
          src={dogCat}
          alt="dogCat"
          width={800}
          height={800}
          className="rounded-2xl "
        />
      </div>

      {/* Formulario */}
      <div
        className="flex flex-col md:mr-10 my-3 items-center rounded-3xl 
        justify-center p-4 bg-white/80 backdrop-blur-sm shadow-lg"
        style={{
          backgroundImage: `url(${background.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.9)",
        }}
      >
        <p className="text-4xl md:text-5xl text-shadow-2xs
       text-shadow-amber-600 font-extrabold
        text-black mt-2 drop-shadow-md">
          Ingresá
        </p>

        <p className="border-2 border-cyan-700 p-2 rounded-3xl mt-2
       bg-white  text-lg font-medium">
          ¿No tienes cuenta?
          <Link
            href="/auth/register"
            className="text-blue-600 font-semibold hover:underline ml-2"
          >
            ¡Registrate!
          </Link>
        </p>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validateLoginForm}
          validateOnMount={true}
          onSubmit={async (values) => {
            try {
              const response: IUser = await login(values);
              const formatted: IUserSession = {
                token: "",
                user: {
                  id: response.id,
                  uid: response.uid,
                  name: response.name,
                  email: response.email,
                  user: response.user,
                  phone: response.phone,
                  country: response.country,
                  address: response.address,
                  city: response.city,
                  role: response.role,
                  isDeleted: response.isDeleted,
                  deletedAt: response.deletedAt,
                  pets: response.pets,
                  buyerSaleOrders: response.buyerSaleOrders,
                },
              };
              setUserData(formatted);
              toast.success("Se ha logueado con éxito");
              window.location.href = "/";
            } catch (error) {
              toast.error("Error al iniciar sesión. Por favor, intenta nuevamente.");
            }
          }}
        >
          {({ isValid, isSubmitting }) => (
            <Form className="flex flex-col gap-6 my-6 w-100 max-w-md">
              <FieldFormikCustom
                label="Email:"
                nameField="email"
                type="email"
                placeholder="johnHandcock@mail.com"
              />

              <PasswordFieldFormik
                label="Contraseña:"
                nameField="password"
                type="password"
                placeholder="********"
              />

              <SubmitFormikButton
                text={isSubmitting ? "Ingresando..." : "Ingresar"}
                disabled={!isValid || isSubmitting}
              />

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="flex items-center justify-center gap-3
                bg-white border rounded-lg shadow-md
                hover:bg-sky-100 transition-colors
                p-3 w-full
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image
                  src={googleLogo}
                  width={25}
                  height={25}
                  alt="Google Logo"
                  className="w-7 h-7"
                />
                {googleLoading ? "Cargando..." : "Ingresá con Google"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );

}

export default LoginView