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
import { getGoogleAuthUrl, login, loginVeterinarian } from '@/src/services/user.services'
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
                  profileImageUrl: response.profileImageUrl,
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

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            const { url } = await getGoogleAuthUrl();
            toast.success("Ingresando con Google...");
            window.location.href = url;
        } catch (error) {
            console.error("Error al obtener URL de autenticación:", error);
            toast.error("No se pudo iniciar el proceso de autenticación con Google");
        } finally {
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
            toast.success("Se ha ingresado exitosamente");

            setGoogleLoading(false);
        }
    };

    return (
        <div className='flex md:justify-around justify-center items-center bg-linear-to-r 
        from-orange-300 via-orange-300 to-orange-200 mt-20 rounded-2xl'>

            <div className='hidden lg:block'>
                <Image src={dogCat} alt="dogCat" width={800} height={800} className='rounded-2xl' />
            </div>

            <div className='flex flex-col ms-10 items-center rounded-2xl
            justify-center p-4 border'
                style={{ background: `url(${background.src})` }}>

                <p className='text-5xl mt-4 text-black'>Ingresá</p>

                <p className='text-black mt-4'>¿No tienes cuenta?
                    <Link href="/auth/register" className='text-blue-500 cursor-pointer'> ¡Registrate!</Link>
                </p>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validateLoginForm}
                    validateOnMount={true}
                    onSubmit={async (values) => {
                        try {
                            let response: IUser;
                            let isVeterinarian = false;
                            
                            console.log('🚀 Iniciando proceso de login...');
                            
                            // Intentar login como usuario normal primero
                            try {
                                console.log('👤 Intentando login como usuario normal...');
                                response = await login(values);
                                console.log('✅ Login normal exitoso');
                            } catch (normalLoginError: any) {
                                console.log('❌ Login normal falló:', normalLoginError.message);
                                
                                // Solo intentar como veterinario si el error indica que no es usuario normal
                                // NO hacer fallback si es error de contraseña incorrecta
                                const errorMsg = normalLoginError.message?.toLowerCase() || '';
                                
                                if (errorMsg.includes('password') || errorMsg.includes('contraseña') || 
                                    errorMsg.includes('incorrect') || errorMsg.includes('incorrecta')) {
                                    // Es un error de contraseña, NO intentar como veterinario
                                    console.error('🔒 Error de contraseña, no intentando como veterinario');
                                    throw normalLoginError;
                                }
                                
                                // Intentar como veterinario
                                console.log('🩺 Intentando login como veterinario...');
                                try {
                                    response = await loginVeterinarian(values);
                                    isVeterinarian = true;
                                    // IMPORTANTE: El backend ahora devuelve requirePasswordChange
                                    response.role = 'veterinarian';
                                    console.log('✅ Login veterinario exitoso. RequirePasswordChange:', response.requirePasswordChange);
                                } catch (vetError: any) {
                                    console.error('❌ Login veterinario también falló:', vetError.message);
                                    // Si ambos fallan, lanzar el error original del usuario normal
                                    throw normalLoginError;
                                }
                            }
                            
                            console.log('📦 Respuesta completa del login:', response);
                            console.log('🎭 Rol recibido:', response.role);
                            console.log('🔄 RequirePasswordChange:', response.requirePasswordChange);
                            console.log('🔍 Todas las propiedades de response:', Object.keys(response));
                            
                            // Obtener el token de localStorage (se guardó en el servicio login)
                            const token = localStorage.getItem('authToken') || '';
                            console.log('🔑 Token desde localStorage:', token ? token.substring(0, 30) + '...' : 'NO HAY TOKEN');

                            const formatted: IUserSession = {
                                token: token,
                                user: {
                                    id: response.id || '',
                                    uid: response.uid || response.id || '',
                                    name: response.name || '',
                                    email: response.email || '',
                                    user: response.user || response.email || '',
                                    phone: response.phone || '',
                                    country: response.country || '',
                                    address: response.address || '',
                                    city: response.city || '',
                                    role: response.role || 'user',
                                    isDeleted: response.isDeleted || false,
                                    deletedAt: response.deletedAt || null,
                                    pets: response.pets || [],
                                    requirePasswordChange: response.requirePasswordChange
                                }
                            };

                            console.log('✅ Usuario formateado:', formatted);
                            console.log('✅ Rol en usuario formateado:', formatted.user.role);
                            
                            // IMPORTANTE: Guardar el usuario en el contexto
                            setUserData(formatted);
                            
                            // Verificar que el token esté guardado (warning, no error crítico)
                            const savedToken = localStorage.getItem('authToken');
                            console.log('💾 Token guardado en localStorage:', savedToken ? 'SÍ' : 'NO');
                            
                            if (!savedToken) {
                                console.warn('⚠️ WARNING: Token no encontrado inmediatamente, pero continuando...');
                            }
                            
                            // Delay para que React actualice el estado
                            await new Promise(resolve => setTimeout(resolve, 200));
                            
                            console.log('🔍 VERIFICANDO REDIRECCIÓN:');
                            console.log('   - response.role:', response.role);
                            console.log('   - response.requirePasswordChange:', response.requirePasswordChange);
                            console.log('   - ¿Es veterinario?:', response.role === 'veterinarian');
                            console.log('   - ¿Requiere cambio?:', response.requirePasswordChange === true);
                            
                            // Si es veterinario con contraseña temporal, redirigir a cambiar contraseña
                            if (response.role === 'veterinarian' && response.requirePasswordChange) {
                                console.log('🔐 ✅ Redirigiendo a cambio de contraseña...');
                                window.location.href = '/change-password';
                            } else {
                                console.log('🏠 Redirigiendo a home...');
                                console.log('   - Razón: rol=' + response.role + ', requirePasswordChange=' + response.requirePasswordChange);
                                window.location.href = '/';
                            }

                        } catch (error: any) {
                            console.error('❌ Error en login:', error);
                            alert("Error al iniciar sesión: " + (error.message || "Credenciales inválidas"));
                        }
                    }}
                >
                    {({ isValid, isSubmitting }) => (
                        <Form className="flex flex-col justify-between my-6 rounded-2xl p-2">

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
                                className='bg-white border rounded hover:bg-sky-500
                                p-3 w-70 flex self-center justify-center cursor-pointer
                                disabled:opacity-50 disabled:cursor-not-allowed'>
                                <Image
                                    src={googleLogo}
                                    width={25}
                                    height={25}
                                    alt='Google Logo'
                                    className='mr-5 w-7 h-7 self-center'
                                />
                                {googleLoading ? "Cargando..." : "Ingresá con Google"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default LoginView