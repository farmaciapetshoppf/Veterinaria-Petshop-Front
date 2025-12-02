const APIURL = process.env.NEXT_PUBLIC_API_URL;

export const createOrder = async (idProducts: (number | string)[], token: string) => {
    try {
        const response = await fetch(`${APIURL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({products: idProducts}),
        });
        const orders = await response.json();
        return orders;
    }catch (error:any) {
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