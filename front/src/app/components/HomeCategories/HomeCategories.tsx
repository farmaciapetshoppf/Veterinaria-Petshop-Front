import Image from 'next/image'
import React from 'react'
import CardCategory from '../CardCategory/CardCategory'

function HomeCategories() {
  return (
    <div className="flex">
      <CardCategory></CardCategory>
      <CardCategory></CardCategory>
      <CardCategory></CardCategory>
      <CardCategory></CardCategory>
      <CardCategory></CardCategory>
    </div>
  )
}

export default HomeCategories
