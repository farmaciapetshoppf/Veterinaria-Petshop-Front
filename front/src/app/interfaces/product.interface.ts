import { StaticImageData } from 'next/image';

export interface IProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string | StaticImageData;
    images?: (string | StaticImageData)[]; // Galería de imágenes adicionales
    categoryId: number;
}