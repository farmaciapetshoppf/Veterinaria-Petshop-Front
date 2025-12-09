const APIURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
        // Backend retorna { message: string, data: Order[] }
        return result.data || [];
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
        // El backend retorna { message: string, data: SaleOrder | null }
        // SaleOrder tiene: { id, buyer, items: [{product, quantity, unitPrice}], total, status, expiresAt }
        return result.data;
    } catch (error: any) {
        console.error('Error en getCart:', error);
        throw error;
    }
};

// Agregar producto al carrito
export const addToCartBackend = async (userId: string, productId: string | number, quantity: number, token: string) => {
    try {
        const response = await fetch(`${APIURL}/sale-orders/cart/add`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: token })
            },
            body: JSON.stringify({
                userId,
                productId: String(productId),
                quantity
            }),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al agregar al carrito: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        return result.data;
    } catch (error: any) {
        console.error('Error en addToCartBackend:', error);
        throw error;
    }
};

// Actualizar cantidad de producto en el carrito
export const updateCartQuantity = async (userId: string, productId: string | number, quantity: number, token: string) => {
    try {
        const response = await fetch(`${APIURL}/sale-orders/cart/update`, {
            method: "PATCH",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: token })
            },
            body: JSON.stringify({
                userId,
                productId: String(productId),
                quantity
            }),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al actualizar cantidad: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        return result.data;
    } catch (error: any) {
        console.error('Error en updateCartQuantity:', error);
        throw error;
    }
};

// Eliminar producto del carrito
export const removeFromCartBackend = async (userId: string, productId: string | number, token: string) => {
    try {
        const response = await fetch(`${APIURL}/sale-orders/cart/remove`, {
            method: "DELETE",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: token })
            },
            body: JSON.stringify({
                userId,
                productId: String(productId)
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Error al eliminar del carrito: ${response.status}`);
        }
        
        const result = await response.json();
        return result.data;
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
        return result.data;
    } catch (error: any) {
        console.error('Error en clearCartBackend:', error);
        throw error;
    }
};

// Obtener carrito activo del usuario
export const getActiveCart = async (userId: string, token: string) => {
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
            throw new Error(`Error al obtener carrito: ${response.status}`);
        }
        
        const result = await response.json();
        return result.data; // puede ser null si no hay carrito activo
    } catch (error: any) {
        console.error('Error en getActiveCart:', error);
        throw error;
    }
};

// Crear checkout desde el carrito (NUEVO FLUJO - usa el carrito del backend)
export const createCheckout = async (userId: string, token: string) => {
    try {
        console.log('🛒 Creando checkout para userId:', userId);
        console.log('🔍 Verificando carrito del usuario antes del checkout...');
        
        // Primero obtener el carrito para ver qué tiene
        const cart = await getCart(userId, token);
        console.log('📦 Carrito actual:', cart);
        if (cart?.items) {
            console.log('📊 Items en carrito:');
            cart.items.forEach((item: any) => {
                console.log(`  - ${item.product.name}: cantidad=${item.quantity}, precio unitario=$${item.unitPrice}, subtotal=$${item.quantity * item.unitPrice}`);
            });
            console.log('💰 Total del carrito según frontend:', cart.total);
        }
        
        // Llamar al endpoint correcto de checkout que usa el carrito del backend
        const response = await fetch(`${APIURL}/sale-orders/checkout/${userId}`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: token })
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error del backend:', errorText);
            throw new Error(`Error al crear checkout: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('✅ Respuesta del checkout:', result);
        
        // Backend retorna { message: string, data: { preferenceId, initPoint, sandboxInitPoint } }
        return result.data;
    } catch (error: any) {
        console.error('Error en createCheckout:', error);
        throw error;
    }
};
