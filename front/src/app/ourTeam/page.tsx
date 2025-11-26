import VeterinaryCard from "../components/VeterinaryCard/VeterinaryCard";
import { getAllVeterinarians } from "../services/veterinary.services";

export default async function OurTeam() {
  const vets = await getAllVeterinarians();
  
  return (
    <div className="flex flex-col min-h-screen items-center bg-linear-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nuestro Equipo Veterinario
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Conoce a los profesionales dedicados que cuidan de la salud y bienestar de tus mascotas
          </p>
        </div>

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
