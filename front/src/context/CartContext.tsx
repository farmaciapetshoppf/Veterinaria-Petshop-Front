"use client"
import { createContext, useContext, useEffect, useState,} from "react";
import { IProduct } from "../../src/app/interfaces/product.interface";
import { useAuth } from "./AuthContext";

interface CartContextProps {
    cartItems: IProduct[];
    addToCart: (product:IProduct) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getIdItems: () => number[];
    getItemsCount: () => number;
}

const CartContext = createContext<CartContextProps> ({
    cartItems: [],
    addToCart: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
    getTotal: () => 0,
    getIdItems: () => [],
    getItemsCount: () => 0,
});

interface CartProvider {
    children: React.ReactElement;
};

export const CartProvider:React.FC<CartProvider> = ({children}) => {
    const [cartItems, setCartItems] = useState<IProduct[]>([]);
    const {userData} = useAuth();

    useEffect(() => {
        if (cartItems.length > 0) {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    } 
},
[cartItems]);
useEffect(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const dataFromLocalStorage = localStorage.getItem('cart');
            if (dataFromLocalStorage) {
                setCartItems(JSON.parse(dataFromLocalStorage));
            }
        }
    }, []);

    const addToCart = (product:IProduct) => {
        if (!userData){
            alert("Debes iniciar sesión para agregar productos al carrito");
            return;}

            const existingProduct = cartItems.some(item => item.id === product.id);
            if (existingProduct) {
                alert("El producto ya está en el carrito");
                return;
            }
            setCartItems((prevItems)=>[...prevItems, product]);


    };
    const removeFromCart = (productId: number) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
    };
    const clearCart = () => {
        setCartItems([]);
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('cart');
        }
    };
    const getTotal = (): number => {
        return cartItems.reduce((total, item) => total + item.price, 0);
    };

        const getIdItems = () => {
        return cartItems.map(item => item.id);
    };
    const getItemsCount = () => {
        return cartItems.length;
    };

    return ( <CartContext.Provider value={{cartItems, addToCart, removeFromCart, clearCart, getTotal, getIdItems, getItemsCount}}>
        {children}
        </CartContext.Provider>
       );
    };

export const useCart = () => useContext(CartContext);