import { IVeterinary } from "../interfaces/veterinary.interface";
import ana from "../../assets/ana.jpg";
import carlos from "../../assets/carlos.jpg"
import juan from "../../assets/juan.jpg"
import laura from "../../assets/laura.jpg"
import maria from "../../assets/maria.jpg"
import roberto from "../../assets/roberto.jpg"

// Mock de veterinarios para desarrollo
const MOCK_VETERINARIANS: IVeterinary[] = [
    {
        id: 1,
        name: "Dr. Carlos Mendoza",
        specialty: "Medicina General",
        description: "Especialista en medicina preventiva y tratamiento de enfermedades comunes en mascotas",
        image: carlos,
        experience: 8,
        available: true
    },
    {
        id: 2,
        name: "Dra. María González",
        specialty: "Cirugía Veterinaria",
        description: "Experta en cirugías de tejidos blandos y procedimientos quirúrgicos complejos",
        image: maria,
        experience: 12,
        available: true
    },
    {
        id: 3,
        name: "Dr. Juan Pérez",
        specialty: "Dermatología",
        description: "Especializado en el tratamiento de problemas de piel y alergias en animales",
        image: juan,
        experience: 6,
        available: true
    },
    {
        id: 4,
        name: "Dra. Ana Rodríguez",
        specialty: "Odontología Veterinaria",
        description: "Dedicada a la salud dental y oral de mascotas con técnicas modernas",
        image: ana,
        experience: 10,
        available: true
    },
    {
        id: 5,
        name: "Dr. Roberto Silva",
        specialty: "Cardiología",
        description: "Especialista en diagnóstico y tratamiento de enfermedades cardíacas en animales",
        image: roberto,
        experience: 15,
        available: true
    },
    {
        id: 6,
        name: "Dra. Laura Martínez",
        specialty: "Emergencias",
        description: "Experta en atención de urgencias y cuidados críticos las 24 horas",
        image: laura,
        experience: 7,
        available: true
    }
];

export const getAllVeterinarians = async (): Promise<IVeterinary[]> => {
    console.log('🔧 Usando veterinarios mockeados para desarrollo');
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_VETERINARIANS), 300);
    });
};

export const getVeterinaryById = async (id: string): Promise<IVeterinary> => {
    const allVeterinarians = await getAllVeterinarians();
    const veterinary = allVeterinarians.find((vet) => vet.id === Number(id));
    if (!veterinary) {
        throw new Error('Veterinario no encontrado');
    }
    return veterinary;
};
