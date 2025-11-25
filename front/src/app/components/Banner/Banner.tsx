import React from 'react'
import Image from 'next/image'

function Banner() {
    return (
        <div className="flex bg-amber-600 p-4 rounded-2xl w-96 h-96 justify-evenly items-center">
            <div className="flex flex-col justify-evenly h-full">
                <p>texto 1</p>
                <p>texto 1</p>
            </div>
            <div>
                <Image src="https://placehold.co/300x400/png" width={300} height={400} alt="holi"/>
            </div>
        </div>
    )
}

export default Banner
