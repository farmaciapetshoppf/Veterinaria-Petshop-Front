import { IProduct, ICategory } from "@/src/types";
import alimento from "../../assets/alimento.jpg";
import juguete from "../../assets/juguete.jpg"
import shampoo from "../../assets/shampoo.jpg"
import collar from "../../assets/collar.jpg"
import cucha from "../../assets/cucha.jpg"
import trasladador from "../../assets/trasladador.jpg"
const APIURL = process.env.NEXT_PUBLIC_API_URL || '';

// Mock de productos para desarrollo
/* const MOCK_PRODUCTS: IProduct[] = [
    {
        id: 1,
        name: "Alimento Premium para Perros",
        description: "Alimento balanceado de alta calidad para perros adultos de todas las razas",
        price: 45.99,
        stock: 50,
        image: alimento,
        images: [alimento, collar, juguete, cucha], // Galería de imágenes
        categoryId: 1
    },
    {
        id: 2,
        name: "Collar Antipulgas",
        description: "Collar antipulgas y garrapatas de larga duración",
        price: 19.99,
        stock: 30,
        image: collar,
        images: [collar, alimento, shampoo],
        categoryId: 2
    },
    {
        id: 3,
        name: "Juguete Interactivo",
        description: "Juguete dispensador de premios para mantener a tu mascota entretenida",
        price: 24.50,
        stock: 25,
        image: juguete,
        images: [juguete, collar, trasladador],
        categoryId: 3
    },
    {
        id: 4,
        name: "Cama Ortopédica",
        description: "Cama confortable con soporte ortopédico para mascotas",
        price: 89.99,
        stock: 15,
        image: cucha,
        images: [cucha, shampoo, alimento],
        categoryId: 4
    },
    {
        id: 5,
        name: "Shampoo Hipoalergénico",
        description: "Shampoo suave especial para pieles sensibles",
        price: 15.99,
        stock: 40,
        image: shampoo,
        images: [shampoo, collar, juguete],
        categoryId: 5
    },
    {
        id: 6,
        name: "Transportadora",
        description: "Transportadora resistente y segura para viajes",
        price: 65.00,
        stock: 20,
        image: trasladador,
        images: [trasladador, cucha, collar],
        categoryId: 6
    }
]; */

// Mapeo de imágenes por categoría para productos sin imagen
const getCategoryImage = (categoryId: number | string | undefined, name: string) => {
    // Intentar determinar la categoría por el nombre si no hay categoryId
    const productName = name.toLowerCase();
    
    if (productName.includes('alimento') || productName.includes('balanceado') || 
        productName.includes('comida') || productName.includes('chow') || 
        productName.includes('whiskas') || productName.includes('pedigree') || 
        productName.includes('royal canin')) {
        return alimento;
    }
    if (productName.includes('collar') || productName.includes('arnés') || productName.includes('correa')) {
        return collar;
    }
    if (productName.includes('juguete') || productName.includes('pelota') || 
        productName.includes('hueso') || productName.includes('cuerda') || 
        productName.includes('peluche') || productName.includes('ratón')) {
        return juguete;
    }
    if (productName.includes('cama') || productName.includes('cucha') || productName.includes('rascador')) {
        return cucha;
    }
    if (productName.includes('shampoo') || productName.includes('acondicionador') || 
        productName.includes('limpiador') || productName.includes('toallitas') || 
        productName.includes('cepillo')) {
        return shampoo;
    }
    if (productName.includes('transportadora') || productName.includes('trasladador')) {
        return trasladador;
    }
    
    // Por categoryId si está disponible
    switch (categoryId) {
        case 1: return alimento;
        case 2: return collar;
        case 3: return juguete;
        case 4: return cucha;
        case 5: return shampoo;
        case 6: return trasladador;
        default: return alimento; // Default genérico
    }
};

export const getAllProducts = async (): Promise<IProduct[]> => {
/*     if (!APIURL) {
        console.warn('NEXT_PUBLIC_API_URL is not set — usando productos mockeados');
        return MOCK_PRODUCTS;
    } */

    try {
        console.log('Obteniendo productos desde:', `${APIURL}/products`)
        const res = await fetch(`${APIURL}/products`, { 
            method: 'GET',
            cache: 'no-store'
        });

        if (!res.ok) {
            const text = await res.text();
            console.error(`getAllProducts: fetch failed ${res.status} ${res.statusText} — ${text.substring(0,200)}`);
            console.log('🔧 Usando productos mockeados como fallback');
            return MOCK_PRODUCTS;
        }

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            const text = await res.text();
            console.error(`getAllProducts: expected JSON but got ${contentType} — ${text.substring(0,200)}`);
            console.log('🔧 Usando productos mockeados como fallback');
            return MOCK_PRODUCTS;
        }

        const result = await res.json();
        console.log('Respuesta del backend:', result)
        
        // El backend puede devolver {data: [...]} o directamente [...]
        let products = result.data || result;
        
        // Agregar imágenes a productos que no las tienen
        products = products.map((product: IProduct) => {
            if (!product.image) {
                const defaultImage = getCategoryImage(product.categoryId, product.name);
                return {
                    ...product,
                    image: defaultImage,
                    images: product.images || [defaultImage]
                };
            }
            return product;
        });
        
        console.log(`✅ ${products.length} productos obtenidos del backend`);
        return products;
    } catch (error: any) {
        console.error('getAllProducts error:', error);
        console.log('🔧 Usando productos mockeados como fallback');
        return MOCK_PRODUCTS;
    }
};

export const getProductById = async (id: string): Promise<IProduct> => {
    const allProducts = await getAllProducts();
    const product = allProducts.find((product) => product.id === Number(id));
    if (!product) {
        throw new Error('Product no encontrado');
    }
    return product;
};

// Mock de categorías para desarrollo
/* const MOCK_CATEGORIES: ICategory[] = [
    { id: 1, name: 'Alimentos' },
    { id: 2, name: 'Accesorios' },
    { id: 3, name: 'Juguetes' },
    { id: 4, name: 'Camas y Cuchas' },
    { id: 5, name: 'Higiene' },
    { id: 6, name: 'Transporte' }
]; */

export const getAllCategories = async (): Promise<ICategory[]> => {
    if (!APIURL) {
        console.warn('NEXT_PUBLIC_API_URL is not set — usando categorías mockeadas');
        return MOCK_CATEGORIES;
    }

    try {
        console.log('Obteniendo categorías desde:', `${APIURL}/categories`)
        const res = await fetch(`${APIURL}/categories`, { 
            method: 'GET',
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`getAllCategories: fetch failed ${res.status}`);
            console.log('🔧 Usando categorías mockeadas como fallback');
            return MOCK_CATEGORIES;
        }

        const result = await res.json();
        const categories = result.data || result;
        console.log(`✅ ${categories.length} categorías obtenidas del backend`);
        return categories;
    } catch (error: any) {
        console.error('getAllCategories error:', error);
        console.log('🔧 Usando categorías mockeadas como fallback');
        return MOCK_CATEGORIES;
    }
};