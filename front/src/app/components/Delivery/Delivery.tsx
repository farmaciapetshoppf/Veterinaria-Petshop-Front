import React from 'react'
import Logistics from '../Logistics/Logistics'
import Banner from '../Banner/Banner'

function Delivery() {
  {/* <div className='flex items-center justify-around w-full my-4'> */}
  return (
    <div className='flex flex-wrap justify-center
    sm:flex-row sm:me-3 sm:ms-3 no-scrollbar space-y-7 mt-5'>
        <Logistics/>
        <Banner/>
    </div>
  )
}

export default Delivery
