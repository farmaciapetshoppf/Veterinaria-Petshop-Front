
import React from 'react'
import Button from '../Button/Button'

function CardCategory() {
  return (
    <div className="bg-[url('https://picsum.photos/1200/800')] 
    m-4 rounded-2xl h-50 w-40 flex items-center justify-center
    ">
      <div>
        <Button className="text-black ">categoria</Button>
      </div>
    </div>
  )
}

export default CardCategory
