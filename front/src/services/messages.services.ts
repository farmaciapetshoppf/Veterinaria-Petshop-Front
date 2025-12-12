const APIURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Obtener todas las conversaciones del usuario
export const getConversations = async () => {
    try {
        const response = await fetch(`${APIURL}/conversations`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener conversaciones');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error en getConversations:', error);
        throw error;
    }
};

// Obtener mensajes de una conversación
export const getMessages = async (conversationId: string, page = 1, limit = 50) => {
    try {
        const response = await fetch(`${APIURL}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener mensajes');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error en getMessages:', error);
        throw error;
    }
};

// Enviar un mensaje
export const sendMessage = async (conversationId: string, content: string) => {
    try {
        const response = await fetch(`${APIURL}/conversations/${conversationId}/messages`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            throw new Error('Error al enviar mensaje');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error en sendMessage:', error);
        throw error;
    }
};

// Crear nueva conversación
export const createConversation = async (participantId: string) => {
    try {
        const response = await fetch(`${APIURL}/conversations`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ participantId }),
        });

        if (!response.ok) {
            throw new Error('Error al crear conversación');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error en createConversation:', error);
        throw error;
    }
};

// Obtener cantidad de mensajes sin leer
export const getUnreadCount = async () => {
    try {
        const response = await fetch(`${APIURL}/conversations/unread-count`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener mensajes sin leer');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error en getUnreadCount:', error);
        throw error;
    }
};

// Marcar mensaje como leído
export const markAsRead = async (messageId: string) => {
    try {
        const response = await fetch(`${APIURL}/messages/${messageId}/read`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al marcar mensaje como leído');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Error en markAsRead:', error);
        throw error;
    }
};
