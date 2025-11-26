import { StaticImageData } from 'next/image';

export interface IProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string | StaticImageData;
    categoryId: number;
}