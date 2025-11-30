import React from 'react'
import Image from 'next/image'
import gatoCaja from "@/src/assets/gatoCaja.jpg"
import { subtle } from 'crypto'

function Banner() {

    const title = "Elegí la forma de envio que quieras"
    const subTitle = "Compra de una manera sensilla sin moverte de tu casa, selecciona si retiras por nuestra sucursal, si te lo enviamos con nuestra logistica o a traves del correo Andreani"

    return (
        <div className=" bg-amber-600 p-4 rounded-2xl
         w-96 h-160 sm:justify-evenly sm:items-center mb-10
         flex flex-col justify-evenly items-center
         ">
            <div className="flex flex-col justify-evenly h-full font-bold">
                <p className='text-4xl'>{title}</p>
                <p className='my-5'>{subTitle}</p>
            </div>
            <div>
                <Image src={gatoCaja} width={300} height={400} alt="gatito"
                className='rounded-2xl'
                />
            </div>
        </div>
    )
}

export default Banner
