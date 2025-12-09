"use client"
import React, { useState } from 'react'
import { useCart } from '../../../context/CartContext'
import { IProduct } from '@/src/types'

interface AddCartButtonProps {
    product: IProduct;
}
function AddCartButton({product}: AddCartButtonProps) {
    const {addToCart}= useCart();
    const [isAdding, setIsAdding] = useState(false);
    
    const handleAddToCart = async () => {
        // Prevenir clics duplicados
        if (isAdding) {
            console.log('⏸️ Ya se está agregando el producto, ignorando clic duplicado');
            return;
        }
        
        setIsAdding(true);
        try {
            await addToCart(product);
        } finally {
            // Esperar 1 segundo antes de permitir otro clic
            setTimeout(() => setIsAdding(false), 1000);
        }
    };
    
    return (
        <button  
        onClick={handleAddToCart} 
        type="button"
        disabled={isAdding}
            className={`cursor-pointer mt-10 flex w-full items-center justify-center px-8 py-3 text-base 
                rounded-md bg-linear-to-r from-orange-500 to-amber-500 
                hover:bg-linear-to-r hover:from-orange-600 hover:to-amber-600
                font-medium text-white hover:text-black
                ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isAdding ? 'Agregando...' : 'Agregar al carrito'}
        </button>
    )
}

export default AddCartButton