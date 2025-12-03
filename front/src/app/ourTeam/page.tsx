import VeterinaryCard from "../components/VeterinaryCard/VeterinaryCard";
import { getAllVeterinarians } from "../services/veterinary.services";
import Image from "next/image";
import bannerourteam from "../../assets/bannerourteam.png"

export default async function OurTeam() {
  const vets = await getAllVeterinarians();
  
  return (
    <div className="flex flex-col min-h-screen items-center bg-orange-200 pt-20">
      
      {/* Banner con imagen y título */}
      <div className="relative h-[400px] w-full mb-12">
        <Image
          src={bannerourteam}
          alt='banner gato'
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-orange-500/70 to-amber-500/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Nuestro Equipo</h1>
            <p className="text-xl md:text-2xl">Profesionales dedicados al cuidado de tu mascota</p>
          </div>
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
