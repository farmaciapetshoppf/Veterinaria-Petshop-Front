"use client"

import Carousel from '../app/components/Carousel/Carousel'
import HomeCategories from '../app/components/HomeCategories/HomeCategories'
import Delivery from '../app/components/Delivery/Delivery'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();

  return (
    <div className='pt-20 bg-orange-200'>


      <Carousel />

      {/* Banner de envío con código postal */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Icono y texto principal */}
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1">¡Envíos a todo el país!</h2>
                <p className="text-blue-100 text-sm md:text-base">Ingresá tu código postal y calculá el costo de envío</p>
              </div>
            </div>

            {/* Botón CTA */}
            <button 
              onClick={() => router.push('/cart')}
              className="group bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-xl flex items-center gap-3 whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Calcular envío</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Características adicionales */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-white text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Envío rápido y seguro</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Seguimiento en tiempo real</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Retiro por sucursal disponible</span>
            </div>
          </div>
        </div>
      </div>

      {/* TODO: texto rosa si quieren lo cambiamos */}
      <p className=' flex justify-center bg-cyan-700 text-black font-bold p-6 w-full'>
        Gestiona turnos, segui el calendario de vacunacion y además distrutá de nuestra tienda
      </p>

      <HomeCategories />

      <Delivery />

    </div>
  );
}
