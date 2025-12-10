import { StaticImageData } from 'next/image';

export interface IUserSession {
    token:string,
    user:IUser
}

export interface IUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  user: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  role: string;
  isDeleted: boolean;
  deletedAt: string | null;
  pets: IPet[];
  requirePasswordChange?: boolean; // Para veterinarios con contraseña temporal
  buyerSaleOrders: Order[];
  profileImageUrl: string
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string | null;
  country: string | null;
  address: string | null;
  city: string | null;
}


export interface Order {
  id: string
  total: number
  status: 'ACTIVE' | 'delivered'
  items: OrderItem[]
}

export interface OrderItem {
  productName: string
  quantity: number
  price: number
}

export interface IPet {
  id: string;
  nombre: string;
  especie: string;
  sexo: string;
  tamano: string;
  esterilizado: string;
  status: string;
  fecha_nacimiento: string;
  fecha_fallecimiento: string | null;
  breed: string;
  image: string;
  mother: string | null;
  father: string | null;
  appointments: IAppointment[];
}

export interface IAppointment {
  id: string;
  date: string;
  time: string;
  status: boolean;
  veterinarian: IVeterinarian;
}

export interface IVeterinarian {
  id: string;
  name: string;
  email: string;
  matricula: string;
  description: string;
  phone: string;
  time: string;
  isActive: boolean;
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
    id: number | string; // Puede ser número (mock) o string UUID (backend)
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string | StaticImageData;
    imgUrl?: string; // URL de la imagen desde el backend
    images?: (string | StaticImageData)[]; // Galería de imágenes adicionales
    categoryId?: number | string; // Puede ser número (mock) o string UUID (backend)
    quantity?: number; // Cantidad en el carrito (opcional)
}

export interface ICategory {
    id: number | string; // Puede ser número (mock) o string UUID (backend)
    name: string;
    products?: IProduct[]; // El backend incluye los productos en cada categoría
}

export interface ICategoryBasic {
  id: number | string; // Puede ser número (mock) o string UUID (backend)
  name: string;
  image: string | StaticImageData;
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