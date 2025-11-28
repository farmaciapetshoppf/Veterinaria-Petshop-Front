import VeterinaryCard from "../components/VeterinaryCard/VeterinaryCard";
import { getAllVeterinarians } from "../services/veterinary.services";
import Image from "next/image";
import gatomedico from "../../assets/gatomedico.png"

export default async function OurTeam() {
  const vets = await getAllVeterinarians();
  
  return (
    <div className="flex flex-col min-h-screen items-center bg-white pt-20">
      {/* Banner con imagen y título */}
      <div className="w-full bg-amber-100 shadow-lg mb-12 h-64 overflow-hidden">
        <div className="w-full h-full flex items-center justify-between">
          <Image
            src={gatomedico}
            alt='banner gato'
            className="w-1/2 h-full object-cover"
          />
          <h1 className="text-5xl md:text-6xl font-bold text-amber-500 pr-12 mr-7 text-shadow-black  ">
            Nuestro equipo
          </h1>
        </div>
      </div>

      <div className="w-full max-w-7xl px-6 pb-12">
        {/* Grid de veterinarios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {vets.map((vet) => (
            <VeterinaryCard key={vet.id} veterinary={vet} />
          ))}
        </div>
      </div>
    </div>
  );
}
