import React from "react";
import Link from 'next/link'
import Image from 'next/image'
import { IProduct } from "@/src/types";

interface CardProps {
    product: IProduct
}

function Card({product}: CardProps) {
  const href = product.id ? `/product/${product.id}` : undefined;
  
  // Manejar diferentes tipos de imagen: string URL, objeto StaticImageData, o fallback
  let imageSrc: string | any = '/next.svg';
  if (product.image) {
    if (typeof product.image === 'string') {
      if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
        imageSrc = product.image;
      } else if (process.env.NEXT_PUBLIC_API_URL) {
        imageSrc = `${process.env.NEXT_PUBLIC_API_URL}${product.image}`;
      }
    } else {
      // Es un objeto StaticImageData de Next.js
      imageSrc = product.image;
    }
  }

   const content = (
    <div className="max-w-sm bg-linear-to-br from-white via-gray-100 to-amber-100 p-4 rounded-lg shadow hover:shadow-xl transition-transform hover:scale-105 cursor-pointer flex flex-col">
      <div className="w-full aspect-4/3 overflow-hidden rounded-md bg-gray-50 relative">
        
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          loading="lazy"
          className="object-contain p-2"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </div>

      <div className="mt-4 flex-1">
        <h3 className="text-sm text-gray-700 line-clamp-2">
          <span className="inset-0">{product.name}</span>
        </h3>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg font-medium text-gray-900">${product.price}</p>
        <span className="text-xs text-gray-500">Stock: {product.stock}</span>
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

export default Card