import VeterinaryCard from "../components/VeterinaryCard/VeterinaryCard";
import { getAllVeterinarians } from "../services/veterinary.services";

const vets = await getAllVeterinarians();
{vets.map((vet) => <VeterinaryCard key={vet.id} veterinary={vet} />)}

