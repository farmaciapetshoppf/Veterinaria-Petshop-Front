'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: any[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Función helper para convertir imagen a src
  const getImageSrc = (image: any): string | any => {
    if (!image) return '/next.svg';
    if (typeof image === 'string') {
      if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
      } else if (process.env.NEXT_PUBLIC_API_URL) {
        return `${process.env.NEXT_PUBLIC_API_URL}${image}`;
      }
    }
    return image; // Es StaticImageData
  };

  return (
    <>
      {/* Desktop */}
      <div className="col-span-2 max-lg:hidden">
        {/* Imagen principal */}
        <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100">
          <Image
            alt={productName}
            src={getImageSrc(images[selectedIndex])}
            width={1000}
            height={750}
            loading="lazy"
            className="object-contain p-8"
            sizes="66vw"
          />
        </div>
        
        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-4">
            {images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`aspect-square overflow-hidden rounded-lg bg-gray-100 border-2 transition ${
                  selectedIndex === idx 
                    ? 'border-orange-500' 
                    : 'border-transparent hover:border-orange-300'
                }`}
              >
                <Image
                  alt={`${productName} - imagen ${idx + 1}`}
                  src={getImageSrc(img)}
                  width={200}
                  height={200}
                  className="object-contain p-2"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        {/* Imagen principal */}
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            alt={productName}
            src={getImageSrc(images[selectedIndex])}
            width={600}
            height={600}
            loading="lazy"
            className="object-contain p-4"
          />
        </div>
        
        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-2 px-4">
            {images.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`aspect-square overflow-hidden rounded-lg bg-gray-100 border-2 transition ${
                  selectedIndex === idx 
                    ? 'border-orange-500' 
                    : 'border-transparent'
                }`}
              >
                <Image
                  alt={`${productName} - imagen ${idx + 1}`}
                  src={getImageSrc(img)}
                  width={100}
                  height={100}
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
