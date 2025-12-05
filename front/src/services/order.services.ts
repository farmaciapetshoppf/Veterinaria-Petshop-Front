const APIURL = process.env.NEXT_PUBLIC_API_URL;

export const createOrder = async (items: Array<{productId: string | number, quantity: number}>, userId: string, token: string) => {
    try {
        console.log('Creando orden en:', `${APIURL}/sale-orders`)
        console.log('Items:', items)
        console.log('User ID:', userId)
        console.log('Token:', token)
        
        const payload = {
            userId: userId,
            items: items.map(item => ({
                productId: String(item.productId),
                quantity: item.quantity
            })),
            paymentMethod: 'online' // Por defecto
        };
        
        console.log('Payload:', payload)
        
        const response = await fetch(`${APIURL}/sale-orders`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: token })
            },
            body: JSON.stringify(payload),
        });
        
        console.log('Respuesta status:', response.status)
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del servidor:', errorText);
            throw new Error(`Error al crear la orden: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Orden creada exitosamente:', result);
        return result;
    }catch (error:any) {
        console.error('Error en createOrder:', error);
        throw new Error(error);
    };

};

export const getAllOrders = async (token:string) => {
    try { 
        const res = await fetch(`${APIURL}/users/orders`, {
            method: 'GET',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: token })
            }
        });
      const orders = await res.json();
      return orders  ;
    } catch (error:any) {
        throw new Error(error);
        
        
    }
}


// PRODUCTO DENTRO DE ITEMS
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  imgUrl: string;
}

// ITEM DE LA ORDEN
export interface SaleOrderItem {
  id: string;
  quantity: number;
  unitPrice: string;
  product: Product;
}

// COMPRADOR
export interface Buyer {
  id: string;
  uid: string;
  name: string;
  email: string;
  user: string;
  phone: string | null;
  country: string | null;
  address: string | null;
  city: string | null;
  profileImageUrl: string;
  role: string;
  isDeleted: boolean;
  deletedAt: string | null;
}

// ORDEN DE VENTA
export interface SaleOrder {
  id: string;
  total: string;
  status: "ACTIVE" | "PENDING" | "CANCELLED" | "PAID" | string;
  paymentMethod: string | null;
  notes: string | null;
  createdAt: string;  // ISO date
  expiresAt: string;  // ISO date
  mercadoPagoId: string | null;
  mercadoPagoStatus: string | null;
  buyer: Buyer;
  branch: string | null;
  items: SaleOrderItem[];
}

// RESPUESTA DEL BACKEND
export interface SaleOrdersResponse {
  message: string;
  data: SaleOrder[];
}
// Obtener el historial de compras del usuario
export const getOrderHistory = async (userId: string, token: string) => {
    try {
        const response = await fetch(`${APIURL}/sale-orders/history/${userId}`, {
            method: 'GET',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: token })
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text()
            console.error('Error del servidor:', errorText)
            throw new Error(`Error al obtener historial: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.error('Error en getOrderHistory:', error);
        throw error;
    }
};

// Obtener el carrito del usuario
export const getCart = async (userId: string, token: string) => {
    try {
        const response = await fetch(`${APIURL}/sale-orders/cart/${userId}`, {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: token })
            },
        });
        
        if (!response.ok) {
            throw new Error(`Error al obtener el carrito: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.error('Error en getCart:', error);
        throw error;
    }
};

// Agregar producto al carrito
export const addToCartBackend = async (userId: string, productId: string | number, quantity: number, token: string) => {
    try {
        const response = await fetch(`${APIURL}/sale-orders/cart/${userId}`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: token })
            },
            body: JSON.stringify({
                productId: String(productId),
                quantity
            }),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al agregar al carrito: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.error('Error en addToCartBackend:', error);
        throw error;
    }
};

// Eliminar producto del carrito
export const removeFromCartBackend = async (productId: string | number, token: string) => {
    try {
        const response = await fetch(`${APIURL}/sale-orders/cart/remove`, {
            method: "DELETE",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: token })
            },
            body: JSON.stringify({
                productId: String(productId)
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Error al eliminar del carrito: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.error('Error en removeFromCartBackend:', error);
        throw error;
    }
};

// Vaciar el carrito
export const clearCartBackend = async (userId: string, token: string) => {
    try {
        const response = await fetch(`${APIURL}/sale-orders/cart/clear/${userId}`, {
            method: "DELETE",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: token })
            },
        });
        
        if (!response.ok) {
            throw new Error(`Error al vaciar el carrito: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.error('Error en clearCartBackend:', error);
        throw error;
    }
};
