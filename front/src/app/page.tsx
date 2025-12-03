"use client"

import Carousel from '../app/components/Carousel/Carousel'
import HomeCategories from '../app/components/HomeCategories/HomeCategories'
import Delivery from '../app/components/Delivery/Delivery'
import { useAuth } from '../context/AuthContext'

export default function Home() {

  const { userData } = useAuth();

  return (
    <div className='pt-20 bg-orange-200'>


      <Carousel />

      <h1>{userData?.user?.address}</h1>
      <h1>{userData?.user?.name}</h1>
      <h1>{userData?.user?.email}</h1>
      <h1>{userData?.user?.phone}</h1>
      <h1>{userData?.user?.id}</h1>

      {/* TODO: texto rosa si quieren lo cambiamos */}
      <p className=' flex justify-center bg-pink-300 text-black font-bold p-6 w-full'>
        Gestiona turnos, segui el calendario de vacunacion y además distrutá de nuestra tienda
      </p>

      <HomeCategories />

      <Delivery />

    </div>
  );
}
