"use client"
import React from 'react'
import { useCart } from '../../../context/CartContext'
import { IProduct } from '@/src/types'

interface AddCartButtonProps {
    product: IProduct;
}
function AddCartButton({product}: AddCartButtonProps) {
    const {addToCart}= useCart();
    
    const handleAddToCart = async () => {
        await addToCart(product);
    };
    
    return (
        <button  
        onClick={handleAddToCart} type="button"
            className="cursor-pointer mt-10 flex w-full items-center justify-center px-8 py-3 text-base 
                rounded-md bg-linear-to-r from-orange-500 to-amber-500 
                hover:bg-linear-to-r hover:from-orange-600 hover:to-amber-600
                font-medium text-white hover:text-black"
                  >
                    Agregar al carrito
        </button>
    )
}

export default AddCartButton