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
            headers: {
                "Content-Type": "application/json",
                Authorization: token
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
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        });
      const orders = await res.json();
      return orders  ;
    } catch (error:any) {
        throw new Error(error);
        
        
    }
}