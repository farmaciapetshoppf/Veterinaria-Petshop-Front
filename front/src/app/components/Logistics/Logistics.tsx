import React from 'react'
import CardLogistics from '../CardLogistics/CardLogistics'

function Logistics() {
  {/* <div className='flex justify-evenly'> */ }
  {/* TODO: esto sera un mapeo */ }
  return (
    <div className='flex flex-wrap justify-center
      sm:flex-row sm:justify-between sm:me-3 sm:ms-3 no-scrollbar'>
      <CardLogistics />
      <CardLogistics/>
      <CardLogistics/>
    </div >
  )
}

export default Logistics
