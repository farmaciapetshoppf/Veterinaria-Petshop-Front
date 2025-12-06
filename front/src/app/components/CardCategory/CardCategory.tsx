import React from 'react'
import { ICategoryBasic } from '@/src/types'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const CardCategory: React.FC<ICategoryBasic> = ({ name, image }) => {

  const router = useRouter();

  const handleClick = () => {
    const encoded = encodeURIComponent(name.toLowerCase());
    router.push(`/store?category=${encoded}`);
  };

  /* Boton que redirige a la categoria seleccionada */
  return (
    <button
      onClick={handleClick}
      className="
        relative
        m-4 
        rounded-2xl 
        h-50 w-40 
        flex items-center justify-center 
        cursor-pointer
        overflow-hidden
        group
        transition-transform duration-300
      "
    >
      {/* Fondo con imagen */}
      <Image
        src={typeof image === 'string' ? image : image.src} // aquí puede ser la import local o la URL de la API
        alt={name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />

      {/* Contenido */}
       <div className="relative z-10">
        <p className='bg-orange-200 p-4 rounded-3xl font-bold text-[20px] group-hover:bg-orange-300'>
          {name}
        </p>
      </div> {/*
      <div
        className="
          absolute inset-0
          opacity-0
          group-hover:opacity-100
          transition-opacity duration-300
          z-50
        "
      >
      Aumenta el tamaño de la tarjeta
        <div
          className="
            fixed inset-10
            bg-white
            rounded-2xl
            shadow-2xl
            flex items-center justify-center
            transform scale-0
            group-hover:scale-50
            transition-transform duration-300
          "
        >
          <Image
            src={typeof image === 'string' ? image : image.src}
            alt={name}
            fill
            className="object-cover rounded-2xl"
          />
          <p className="absolute bottom-4 left-4 bg-orange-200 
          p-4 rounded-3xl font-bold text-[24px]">
            {name}
          </p>
        </div>
      </div> */}
    </button>
  )
}

export default CardCategory