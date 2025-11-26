"use client";
import { useState } from "react";
import Image from "next/image";
import Huellitas3 from '../../../assets/Huellitas3.png'
import perrocompras from '../../../assets/perrocompras.png'
import Link from "next/link";
import { navItems } from "../../helpers/navItems";

export default function Navbar() {
  const [shrink, setShrink] = useState(false);

/* TODO: logo e icono carrito chocan con la pagina web */
  return (
     <header
      className="
        top-0 left-0 w-full
        bg-[#f5f5f5]       /* gris muy suave */
        shadow-sm z-50 transition-all duration-300
      "
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6" style={{ height: "80px" }}>
        
        <div className="flex items-center gap-3 h-full">
          
          <Link href="/" className="flex items-center cursor-pointer">
            <Image 
              src={Huellitas3} 
              alt="Huellitas Pet"
              width={150}
              height={150}
              className="transition-all duration-300"
              
            />
          </Link>

          
        </div>

        {/* LINKS */}
        <section className="flex gap-10 text-[15px] font-medium text-gray-700">
            <nav className="flex justify-between gap-x-10 items-center px-10 py-5">
                {navItems.map((navigationItem) => {return(
          <Link key={navigationItem.id} href={navigationItem.route}className="hover:text-orange-500 transition">{navigationItem.nameToRender}</Link>
          );
          })}
            </nav>
        </section>
        
        <div>
            <Link href="/cart" className="flex items-center cursor-pointer">
            <Image
            src={perrocompras}
            alt= 'cart'
            height={150}
            />
            </Link>
        </div>

      </nav>
    </header>
  );
}