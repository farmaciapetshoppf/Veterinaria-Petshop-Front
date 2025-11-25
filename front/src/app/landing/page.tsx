"use client"
import React from 'react'
import Carousel from '../components/Carousel/Carousel'
import HomeCategories from '../components/HomeCategories/HomeCategories'
import Delivery from '../components/Delivery/Delivery'

function Landing() {
    return (
        <div className='flex items-center flex-col'>

            <Carousel />

            <p className='bg-pink-300 text-white font-bold p-6 w-full flex justify-center'>
                Gestiona turnos, segui el calendario de vacunacion y además distrutá de nuestra tienda
            </p>

            <HomeCategories />

            <Delivery />

        </div>
    )
}

export default Landing
