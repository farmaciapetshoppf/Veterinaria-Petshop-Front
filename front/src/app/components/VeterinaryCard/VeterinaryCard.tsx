import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { IVeterinary } from "@/src/types";

interface VeterinaryCardProps {
    veterinary: IVeterinary;
}

function VeterinaryCard({ veterinary }: VeterinaryCardProps) {
  const href = veterinary.id ? `/veterinarians/${veterinary.id}` : undefined;
  
  // Manejo correcto de imágenes del backend
  const getImageSrc = () => {
    console.log('🖼️ Veterinario:', veterinary.name);
    console.log('📸 Imagen recibida:', veterinary.image);
    console.log('🔍 Tipo de imagen:', typeof veterinary.image);
    
    if (!veterinary.image) {
      console.log('⚠️ Sin imagen, usando fallback');
      return '/next.svg';
    }
    
    // Si es un objeto StaticImageData (imágenes importadas del mock)
    if (typeof veterinary.image !== 'string') {
      console.log('✅ Usando imagen importada (mock)');
      return veterinary.image;
    }
    
    // Si es una URL completa
    if (veterinary.image.startsWith('http://') || veterinary.image.startsWith('https://')) {
      console.log('✅ Usando URL completa:', veterinary.image);
      return veterinary.image;
    }
    
    // Si es una ruta relativa del backend
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const fullUrl = `${API_URL}${veterinary.image}`;
    console.log('✅ Usando URL del backend:', fullUrl);
    return fullUrl;
  };

  const imageSrc = getImageSrc();

  const content = (
    <div className="w-full h-full bg-linear-to-br from-white via-amber-50 to-amber-100 
    p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer
    flex flex-col">
      {/* Imagen circular */}
      <div className="w-48 h-48 mx-auto overflow-hidden rounded-full bg-gray-200 relative shrink-0">
        <Image
          src={imageSrc}
          alt={veterinary.name}
          fill
          loading="lazy"
          className="object-cover"
          sizes="192px"
          onError={(e) => {
            console.error('❌ Error cargando imagen para:', veterinary.name);
            console.error('❌ URL que falló:', imageSrc);
          }}
        />
      </div>

      {/* Contenido */}
      <div className="mt-6 text-center flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {veterinary.name}
        </h3>
        <p className="text-base text-amber-600 font-semibold mb-3">
          {veterinary.specialty}
        </p>
        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
          {veterinary.description}
        </p>
        
        {/* Footer con experiencia */}
        <div className="pt-4 border-t border-gray-200 mt-auto">
          <span className="text-sm text-gray-600 font-medium">
            {veterinary.experience} años de experiencia
          </span>
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} prefetch className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
}

export default VeterinaryCard;
