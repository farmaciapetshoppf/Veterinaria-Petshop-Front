import React from 'react'
import { ICategoryBasic } from '@/src/types'
import { useRouter } from 'next/navigation'

const CardCategory: React.FC<ICategoryBasic> = ({ name , img}) => {

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
      "
    >
      {/* Fondo que hace el hover */}
      <div
        className="
          absolute inset-0 
          bg-[${img}] 
          bg-cover bg-center
          transition-transform duration-300 
          group-hover:scale-115
        "
        style={{ background: `url(${img})` }}
      />

      {/* Contenido */}
      <div className="relative z-10">
        <p className='bg-orange-200 p-4 rounded-3xl font-bold text-[20px] group-hover:bg-orange-300'>
          {name}
        </p>
      </div>
    </button>
  )
}

export default CardCategory