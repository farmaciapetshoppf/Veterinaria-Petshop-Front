import Image from 'next/image'
import React from 'react'

function CardLogistics() {
    return (
        <div className='flex items-center flex-col'>
            <div className='mr-2 flex justify-center items-center bg-amber-200 w-52 h-52 rounded-full'>
                <Image src="https://placehold.co/100x100/png" width={100} height={100} alt="aa" />
            </div>
            <p>Retiro</p>
        </div>
    )
}

export default CardLogistics
