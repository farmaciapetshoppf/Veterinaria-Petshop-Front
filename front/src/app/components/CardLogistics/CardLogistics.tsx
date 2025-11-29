import Image, { StaticImageData } from 'next/image'
import React from 'react'

function CardLogistics({img, text} : {img: StaticImageData | string , text: string}) {
    return (
        <div className='flex flex-col items-center  mr-5'>
            <div className=' flex justify-center items-center bg-orange-500 
            mb-4  w-40 h-40 rounded-full'>
                <Image src={img} width={150} height={150} alt="aa" />
            </div>
            <p className='text-2xl'>{text}</p>
        </div>
    )
}

export default CardLogistics
