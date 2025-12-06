"use client"
import { createContext, useContext, useEffect, useState, } from "react";
import { IProduct } from "../types";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { addToCartBackend, removeFromCartBackend, clearCartBackend, getCart } from "../services/order.services";

interface CartContextProps {
    cartItems: IProduct[];
    addToCart: (product: IProduct) => Promise<void>;
    removeFromCart: (productId: number | string) => Promise<void>;
    clearCart: () => Promise<void>;
    getTotal: () => number;
    getIdItems: () => (number | string)[];
    getItemsCount: () => number;
    loadCartFromBackend: () => Promise<void>;
}

const CartContext = createContext<CartContextProps>({
    cartItems: [],
    addToCart: async () => { },
    removeFromCart: async () => { },
    clearCart: async () => { },
    getTotal: () => 0,
    getIdItems: () => [],
    getItemsCount: () => 0,
    loadCartFromBackend: async () => { },
});

interface CartProvider {
    children: React.ReactElement;
};

export const CartProvider: React.FC<CartProvider> = ({ children }) => {
    const [cartItems, setCartItems] = useState<IProduct[]>([]);
    const { userData } = useAuth();

    // Cargar carrito desde el backend cuando el usuario inicia sesión
    useEffect(() => {
        if (userData?.user?.id && userData?.token) {
            loadCartFromBackend();
        }
    }, [userData?.user?.id]);

    // Guardar en localStorage solo como backup
    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
    }, [cartItems]);

    // Cargar desde localStorage solo si no hay usuario autenticado
    useEffect(() => {
        if (!userData?.user?.id && typeof window !== 'undefined' && window.localStorage) {
            const dataFromLocalStorage = localStorage.getItem('cart');
            if (dataFromLocalStorage) {
                setCartItems(JSON.parse(dataFromLocalStorage));
            }
        }
    }, [userData?.user?.id]);

    const loadCartFromBackend = async () => {
        if (!userData?.user?.id) return;

        try {
            const cartData = await getCart(String(userData.user.id), userData.token || '');
            // Asumiendo que el backend retorna un array de productos o un objeto con items
            const items = Array.isArray(cartData) ? cartData : (cartData?.items || []);
            setCartItems(items);
        } catch (error) {
            console.error('Error al cargar el carrito desde el backend:', error);
            // Fallback a localStorage
            const dataFromLocalStorage = localStorage.getItem('cart');
            if (dataFromLocalStorage) {
                setCartItems(JSON.parse(dataFromLocalStorage));
            }
        }
    };

    const addToCart = async (product: IProduct) => {
        const existingProduct = cartItems.some(item => item.id === product.id);
        if (existingProduct) {
            toast.error("El producto ya está en el carrito");
            return;
        }

        // Si hay usuario autenticado, sincronizar con el backend
        if (userData?.user?.id) {
            try {
                await addToCartBackend(
                    String(userData.user.id),
                    product.id,
                    1, // Cantidad por defecto
                    userData.token || ''
                );
                // Recargar el carrito desde el backend después de agregar
                await loadCartFromBackend();
                toast.success("El producto se agregó al carrito");
            } catch (error) {
                console.error('Error al agregar al carrito:', error);
                toast.error("No se pudo agregar el producto al carrito");
            }
        } else {
            // Si no hay usuario, solo guardar en localStorage
            setCartItems((prevItems) => [...prevItems, product]);
            toast.success("El producto se agregó al carrito");
        }
    };

    const removeFromCart = async (productId: number | string) => {
        // Si hay usuario autenticado, sincronizar con el backend
        if (userData?.user?.id) {
            try {
                await removeFromCartBackend(productId, userData.token || '');
                // Recargar el carrito desde el backend después de eliminar
                await loadCartFromBackend();
            } catch (error) {
                console.error('Error al eliminar del carrito:', error);
                toast.error("No se pudo eliminar el producto del carrito");
            }
        } else {
            // Si no hay usuario, solo actualizar el estado local
            setCartItems((prevItems) => prevItems.filter(item => item.id.toString() !== productId.toString()));
        }
    };

    const clearCart = async () => {
        // Si hay usuario autenticado, sincronizar con el backend
        if (userData?.user?.id) {
            try {
                await clearCartBackend(String(userData.user.id), userData.token || '');
                setCartItems([]);
            } catch (error) {
                console.error('Error al vaciar el carrito:', error);
                toast.error("Error al vaciar el carrito");
            }
        } else {
            // Si no hay usuario, solo limpiar el estado local
            setCartItems([]);
        }
        
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('cart');
        }
    };
    
    const getTotal = (): number => {
        return cartItems.reduce((total, item) => {
            const price = Number(item.price);
            if (isNaN(price)) {
                console.warn(`Producto ${item.name} (id: ${item.id}) tiene precio inválido:`, item.price);
                return total;
            }
            return total + price;
        }, 0);
    };

    const getIdItems = () => {
        return cartItems.map(item => item.id);
    };
    
    const getItemsCount = () => {
        return cartItems.length;
    };

    return (
        <CartContext.Provider value={{
            cartItems, 
            addToCart, 
            removeFromCart,
            clearCart, 
            getTotal, 
            getIdItems, 
            getItemsCount, 
            loadCartFromBackend 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);