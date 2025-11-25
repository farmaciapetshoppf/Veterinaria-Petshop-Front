import React from 'react'
import Logistics from '../Logistics/Logistics'
import Banner from '../Banner/Banner'

function Delivery() {
  return (
    <div className='flex items-center justify-around w-full my-4'>
        <Logistics/>
        <Banner/>
    </div>
  )
}

export default Delivery
