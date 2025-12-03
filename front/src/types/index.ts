import { StaticImageData } from 'next/image';

export interface IUserSession {
    token:string,
    user:IUser
}

interface IUser {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    city?: string | null;
    country?: string | null;
    role: string;
}

export interface ILoginProps{
  email:string
  password:string
}

export interface IRegister {
    name: string;
    email:string;
    user:string;
    password: string;
    phone:string;
    country:string;
    city:string;
    address: string;
}

export interface IProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string | StaticImageData;
    images?: (string | StaticImageData)[]; // Galería de imágenes adicionales
    categoryId?: number | string; // Puede ser número (mock) o string UUID (backend)
}

export interface ICategory {
    id: number | string; // Puede ser número (mock) o string UUID (backend)
    name: string;
    products?: IProduct[]; // El backend incluye los productos en cada categoría
}

export interface IVeterinary {
    id: number;
    name: string;
    specialty: string;
    description: string;
    image: string | StaticImageData;
    experience: number; // años de experiencia
    available: boolean;
}