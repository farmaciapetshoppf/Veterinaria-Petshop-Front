import React from 'react'
import CardLogistics from '../CardLogistics/CardLogistics'

function Logistics() {
  return (
    <div className='flex justify-evenly'>
        {/* TODO: esto sera un mapeo */}
      <CardLogistics/>
      <CardLogistics/>
      <CardLogistics/>
    </div>
  )
}

export default Logistics
