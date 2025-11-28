"use client";
import { useState } from "react";
import Image from "next/image";
import Huellitas3 from '../../../assets/Huellitas3.png'
import perrocompras from '../../../assets/perrocompras.png'
import Link from "next/link";
import { navItems } from "../../helpers/navItems";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-[#f5f5f5] shadow-sm z-50 transition-all duration-300">
      <nav className="w-full mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        
        {/* Logo */}
        <Link href="/" className="flex items-center cursor-pointer z-50 shrink-0">
          <Image 
            src={Huellitas3} 
            alt="Huellitas Pet"
            width={110}
            height={110}
            className="md:w-[120px] md:h-[120px] transition-all duration-300"
          />
        </Link>

        {/* Links Desktop - Hidden en mobile */}
        <div className="hidden md:flex gap-8 text-[15px] font-medium text-gray-700">
          {navItems.map((navigationItem) => (
            <Link 
              key={navigationItem.id} 
              href={navigationItem.route}
              className="hover:text-orange-500 transition"
            >
              {navigationItem.nameToRender}
            </Link>
          ))}
        </div>
        
        {/* Carrito - Desktop */}
        <Link href="/cart" className="hidden md:flex items-center cursor-pointer shrink-0">
          <Image
            src={perrocompras}
            alt='cart'
            width={90}
            height={90}
          />
        </Link>

        {/* Botón Hamburguesa - Solo en Mobile */}
        <div className="md:hidden flex items-center z-50 shrink-0">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`} />
            <span className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`bg-gray-700 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`} />
          </button>
        </div>

      </nav>

      {/* Menú Mobile - Desplegable */}
      <div 
        className={`md:hidden fixed top-20 left-0 right-0 bg-[#f5f5f5] shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-screen opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {navItems.map((navigationItem) => (
            <Link 
              key={navigationItem.id} 
              href={navigationItem.route}
              className="block text-gray-700 hover:text-orange-500 transition py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {navigationItem.nameToRender}
            </Link>
          ))}
          
          {/* Carrito en el menú mobile */}
          <Link 
            href="/cart"
            className="block text-gray-700 hover:text-orange-500 transition py-2 text-base font-medium border-t border-gray-300 pt-4"
            onClick={() => setIsMenuOpen(false)}
          >
            🛒 Carrito
          </Link>
        </div>
      </div>
    </header>
  );
}