import React from 'react'
import Image, { StaticImageData } from 'next/image'

interface WorkInProgressProps {
    image: StaticImageData | string;
    alt?: string;
}

function WorkInProgress ({ image, alt = "estamos trabajando en eso amigo" }: WorkInProgressProps) {
    return (
        <div className='flex items-center justify-center min-h-screen bg-black  '>
            <div className='w-full max-w-3xl relative px-4'>
                <Image 
                    src={image}
                    alt={alt}
                    className='w-full h-auto object-contain'
                />
            </div>
        </div>
    )
}

export default WorkInProgress