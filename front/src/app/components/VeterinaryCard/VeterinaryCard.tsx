import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { IVeterinary } from "../../interfaces/veterinary.interface";

interface VeterinaryCardProps {
    veterinary: IVeterinary;
}

function VeterinaryCard({ veterinary }: VeterinaryCardProps) {
  const href = veterinary.id ? `/veterinary/${veterinary.id}` : undefined;
  
  // Manejar diferentes tipos de imagen: string URL, objeto StaticImageData, o fallback
  let imageSrc: string | any = '/next.svg';
  if (veterinary.image) {
    if (typeof veterinary.image === 'string') {
      if (veterinary.image.startsWith('http://') || veterinary.image.startsWith('https://')) {
        imageSrc = veterinary.image;
      } else if (process.env.NEXT_PUBLIC_API_URL) {
        imageSrc = `${process.env.NEXT_PUBLIC_API_URL}${veterinary.image}`;
      }
    } else {
      // Es un objeto StaticImageData de Next.js
      imageSrc = veterinary.image;
    }
  }

  const content = (
    <div className="max-w-sm bg-linear-to-br from-white via-blue-50 to-blue-200 p-4 rounded-lg shadow hover:shadow-xl transition-transform hover:scale-105 cursor-pointer flex flex-col">
      <div className="w-full aspect-square overflow-hidden rounded-full bg-gray-50 relative mx-auto" style={{ maxWidth: '200px' }}>
        <Image
          src={imageSrc}
          alt={veterinary.name}
          fill
          loading="lazy"
          className="object-cover"
          sizes="200px"
        />
      </div>

      <div className="mt-4 text-center flex-1">
        <h3 className="text-lg font-semibold text-gray-900">
          {veterinary.name}
        </h3>
        <p className="text-sm text-blue-600 font-medium mt-1">
          {veterinary.specialty}
        </p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {veterinary.description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-200">
        <span className="text-xs text-gray-600">
          {veterinary.experience} años exp.
        </span>
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          veterinary.available 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {veterinary.available ? 'Disponible' : 'No disponible'}
        </span>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} prefetch className="inline-block">
      {content}
    </Link>
  ) : (
    content
  );
}

export default VeterinaryCard;
