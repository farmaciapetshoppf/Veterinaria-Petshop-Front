"use client"
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { getMessages, sendMessage } from "@/src/services/messages.services";
import { toast } from "react-toastify";
import Image from "next/image";
import avatar from "@/src/assets/avatarHueso.png";

interface Message {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
    isRead: boolean;
    sender?: any;
}

// Mensajes rápidos según el rol del usuario
const QUICK_MESSAGES = {
    veterinarian: [
        { id: 1, icon: "🩺", text: "Hola, ¿cómo puedo ayudarte con tu mascota?" },
        { id: 2, icon: "💊", text: "Recordá darle la medicación como indicamos en la consulta." },
        { id: 3, icon: "🛁", text: "Sí, traelo bañado para la cita por favor." },
        { id: 4, icon: "📅", text: "Tu turno está confirmado. Te esperamos." },
        { id: 5, icon: "⚕️", text: "Los resultados del análisis están listos." },
        { id: 6, icon: "📋", text: "Necesito que traigas la cartilla de vacunación." },
        { id: 7, icon: "🍖", text: "Mantené el ayuno de 8 horas antes del procedimiento." },
        { id: 8, icon: "📞", text: "Cualquier duda, no dudes en consultarme." },
    ],
    admin: [
        { id: 1, icon: "👋", text: "Hola, ¿en qué puedo ayudarte?" },
        { id: 2, icon: "📅", text: "Tu turno fue agendado correctamente." },
        { id: 3, icon: "💳", text: "El pago fue registrado exitosamente." },
        { id: 4, icon: "📦", text: "Tu pedido está en camino." },
        { id: 5, icon: "✅", text: "Tu solicitud fue procesada." },
        { id: 6, icon: "🕐", text: "Nuestro horario de atención es de 9:00 a 20:00." },
        { id: 7, icon: "📧", text: "Te enviamos la información por email." },
        { id: 8, icon: "🤝", text: "Gracias por contactarnos." },
    ],
    client: [
        { id: 1, icon: "👋", text: "Hola, necesito consultar algo." },
        { id: 2, icon: "🩺", text: "¿Cuándo puedo traer a mi mascota?" },
        { id: 3, icon: "💊", text: "¿Qué medicación debo darle?" },
        { id: 4, icon: "📅", text: "¿Tienen turnos disponibles?" },
        { id: 5, icon: "💰", text: "¿Cuál es el costo de la consulta?" },
        { id: 6, icon: "🛁", text: "¿Debo llevar bañado a mi perro?" },
        { id: 7, icon: "📦", text: "¿Cuándo llega mi pedido?" },
        { id: 8, icon: "🙏", text: "Muchas gracias por la atención." },
    ]
};

export default function ChatPage() {
    const params = useParams();
    const conversationId = params.conversationId as string;
    const { userData } = useAuth();
    const router = useRouter();
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [otherUser, setOtherUser] = useState<any>(null);
    const [showQuickMessages, setShowQuickMessages] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Obtener mensajes rápidos según el rol del usuario
    const userRole = userData?.user?.role || 'client';
    const quickMessages = QUICK_MESSAGES[userRole as keyof typeof QUICK_MESSAGES] || QUICK_MESSAGES.client;

    useEffect(() => {
        if (!userData?.user?.id) {
            router.push('/auth/login?redirect=/messages');
            return;
        }

        loadMessages();
        
        // Polling cada 5 segundos para nuevos mensajes
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, [conversationId, userData?.user?.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        try {
            const data = await getMessages(conversationId);
            setMessages(data.messages || []);
            
            // Identificar al otro usuario
            if (data.messages && data.messages.length > 0) {
                const firstMessage = data.messages[0];
                if (firstMessage.sender && firstMessage.senderId !== userData?.user?.id) {
                    setOtherUser(firstMessage.sender);
                }
            }
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            await sendMessage(conversationId, newMessage);
            setNewMessage("");
            await loadMessages();
            toast.success("Mensaje enviado");
        } catch (error) {
            toast.error("Error al enviar mensaje");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="max-w-4xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
                {/* Header del chat */}
                <div className="bg-white shadow-md p-4 flex items-center gap-3">
                    <button
                        onClick={() => router.push('/messages')}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    
                    {otherUser && (
                        <>
                            <Image
                                src={otherUser.profileImageUrl || avatar}
                                alt={otherUser.name}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                            />
                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    {otherUser.role === 'veterinarian' && '👨‍⚕️ '}
                                    {otherUser.role === 'admin' && '🛡️ '}
                                    {otherUser.name}
                                </h2>
                                <p className="text-xs text-gray-500">{otherUser.role === 'veterinarian' ? 'Veterinario' : otherUser.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Área de mensajes */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('/path/to/pattern.svg')] bg-opacity-5">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-400 text-center">
                                No hay mensajes aún.<br />
                                ¡Inicia la conversación!
                            </p>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isOwn = message.senderId === userData?.user?.id;
                            
                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                                        <div
                                            className={`rounded-2xl px-4 py-2 ${
                                                isOwn
                                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                                                    : 'bg-white text-gray-800 shadow-sm'
                                            }`}
                                        >
                                            <p className="break-words">{message.content}</p>
                                        </div>
                                        <span className={`text-xs text-gray-500 mt-1 block ${isOwn ? 'text-right' : 'text-left'}`}>
                                            {new Date(message.createdAt).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input de mensaje */}
                <div className="bg-white shadow-lg">
                    {/* Mensajes rápidos desplegables */}
                    {showQuickMessages && (
                        <div className="border-t border-gray-200 p-3 max-h-48 overflow-y-auto bg-gray-50">
                            <div className="grid grid-cols-2 gap-2">
                                {quickMessages.map((msg) => (
                                    <button
                                        key={msg.id}
                                        type="button"
                                        onClick={() => {
                                            setNewMessage(msg.text);
                                            setShowQuickMessages(false);
                                        }}
                                        className="text-left px-3 py-2 bg-white hover:bg-orange-50 rounded-lg text-sm border border-gray-200 hover:border-orange-300 transition-all"
                                    >
                                        <span className="mr-1">{msg.icon}</span>
                                        <span className="text-gray-700">{msg.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="p-4">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setShowQuickMessages(!showQuickMessages)}
                                className="p-3 hover:bg-gray-100 rounded-full transition text-gray-600"
                                title="Mensajes rápidos"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </button>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escribe un mensaje..."
                                disabled={sending}
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:border-orange-500 focus:outline-none transition disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || sending}
                                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white p-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {sending ? (
                                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
