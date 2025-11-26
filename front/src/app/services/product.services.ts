import { IProduct } from "../interfaces/product.interface";
import alimento from "../../assets/alimento.jpg";
import juguete from "../../assets/juguete.jpg"
import shampoo from "../../assets/shampoo.jpg"
import collar from "../../assets/collar.jpg"
import cucha from "../../assets/cucha.jpg"
import trasladador from "../../assets/trasladador.jpg"
const APIURL = process.env.NEXT_PUBLIC_API_URL || '';

// Mock de productos para desarrollo
const MOCK_PRODUCTS: IProduct[] = [
    {
        id: 1,
        name: "Alimento Premium para Perros",
        description: "Alimento balanceado de alta calidad para perros adultos de todas las razas",
        price: 45.99,
        stock: 50,
        image: alimento,
        categoryId: 1
    },
    {
        id: 2,
        name: "Collar Antipulgas",
        description: "Collar antipulgas y garrapatas de larga duración",
        price: 19.99,
        stock: 30,
        image: collar,
        categoryId: 2
    },
    {
        id: 3,
        name: "Juguete Interactivo",
        description: "Juguete dispensador de premios para mantener a tu mascota entretenida",
        price: 24.50,
        stock: 25,
        image: juguete,
        categoryId: 3
    },
    {
        id: 4,
        name: "Cama Ortopédica",
        description: "Cama confortable con soporte ortopédico para mascotas",
        price: 89.99,
        stock: 15,
        image: cucha,
        categoryId: 4
    },
    {
        id: 5,
        name: "Shampoo Hipoalergénico",
        description: "Shampoo suave especial para pieles sensibles",
        price: 15.99,
        stock: 40,
        image: shampoo,
        categoryId: 5
    },
    {
        id: 6,
        name: "Transportadora",
        description: "Transportadora resistente y segura para viajes",
        price: 65.00,
        stock: 20,
        image: trasladador,
        categoryId: 6
    }
];

export const getAllProducts = async (): Promise<IProduct[]> => {
    // MOCK: Retornar productos mockeados para desarrollo
    console.log('🔧 Usando productos mockeados para desarrollo');
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_PRODUCTS), 500); 
    });

    /* Código original comentado - descomentar cuando el API esté lista
    if (!APIURL) {
        
        console.warn('NEXT_PUBLIC_API_URL is not set — getAllProducts will return an empty array. Set the env var in your deployment (e.g. Vercel) to point to the API.');
        return [];
    }

    try {
        const res = await fetch(`${APIURL}/products`, { method: 'GET' });

        if (!res.ok) {
            const text = await res.text();
            console.error(`getAllProducts: fetch failed ${res.status} ${res.statusText} — ${text.substring(0,200)}`);
            return [];
        }

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            const text = await res.text();
            console.error(`getAllProducts: expected JSON but got ${contentType} — ${text.substring(0,200)}`);
            return [];
        }

        const products: IProduct[] = await res.json();
        return products;
    } catch (error: any) {
        console.error('getAllProducts error:', error);
        return [];
    }
    */
};

export const getProductById = async (id: string): Promise<IProduct> => {
    const allProducts = await getAllProducts();
    const product = allProducts.find((product) => product.id === Number(id));
    if (!product) {
        throw new Error('Product no encontrado');
    }
    return product;
};