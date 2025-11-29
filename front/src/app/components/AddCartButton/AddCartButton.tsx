"use client"
import React from 'react'
import { useCart } from '../../../context/CartContext'
import { IProduct } from '@/src/types'

interface AddCartButtonProps {
    product: IProduct;
}
function AddCartButton({product}: AddCartButtonProps) {
    const {addToCart}= useCart();
  return (
    <button  onClick={()=> addToCart(product)} type="submit"
            className="cursor-pointer mt-10 flex w-full items-center justify-center 
            rounded-md border border-transparent bg-amber-300 px-8 py-3 text-base 
            font-medium text-white hover:bg-amber-400 "
              >
                Agregar al carrito
    </button>
  )
}

export default AddCartButton