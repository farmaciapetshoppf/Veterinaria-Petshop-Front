"use client"
import React, { useState } from "react";
import Link from 'next/link'
import Image from 'next/image'
import { IProduct } from "@/src/types";
import { useCart } from "@/src/context/CartContext";

interface CardProps {
  product: IProduct
}

function Card({ product }: CardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const href = product.id ? `/product/${product.id}` : undefined;

  // Manejar diferentes tipos de imagen: string URL, objeto StaticImageData, o fallback
  let imageSrc: string | any = '/next.svg';
  if (product.image) {
    if (typeof product.image === 'string') {
      if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
        imageSrc = product.image;
      } else if (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') {
        imageSrc = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${product.image}`;
      }
    } else {
      imageSrc = product.image; // StaticImageData
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAdding || product.stock < 1) return;
    
    setIsAdding(true);
    try {
      // Crear una copia del producto con la cantidad seleccionada
      const productWithQuantity = { ...product, quantity };
      await addToCart(productWithQuantity);
      // Resetear cantidad después de agregar
      setQuantity(1);
    } finally {
      setTimeout(() => setIsAdding(false), 1000);
    }
  };

  const handleQuantityChange = (change: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const content = (
    <div
      className="
        group relative
        max-w-sm 
        bg-linear-to-br from-white via-gray-100 to-amber-100 
        p-4 rounded-lg shadow 
        cursor-pointer flex flex-col
        transition-transform duration-300 hover:scale-105
      "
    >
      {/* Imagen normal */}
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

      {/* Info normal */}
      <div className="mt-4 flex-1">
        <h3 className="text-sm text-gray-700 line-clamp-2">
          <span className="inset-0">{product.name}</span>
        </h3>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg font-medium text-gray-900">${product.price}</p>
        <span className="text-xs text-gray-500">Stock: {product.stock}</span>
      </div>

      {/* Contador y botón agregar al carrito */}
      <div className="mt-3 flex items-center gap-2">
        {/* Contador de cantidad */}
        <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-1 shadow-sm border border-gray-200">
          <button
            onClick={(e) => handleQuantityChange(-1, e)}
            disabled={quantity <= 1}
            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="w-8 text-center text-sm font-medium text-gray-700">{quantity}</span>
          <button
            onClick={(e) => handleQuantityChange(1, e)}
            disabled={quantity >= product.stock}
            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Botón agregar al carrito */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.stock < 1}
          className="flex-1 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-medium py-2 px-3 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
        >
          {isAdding ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Agregar</span>
            </>
          )}
        </button>
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

export default Card;
