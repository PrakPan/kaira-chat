import React, { createContext, useContext, useEffect, useRef, useState } from "react";
const BASE_WS_URL = "wss://chat.tarzanway.com/ws";
const ChatContext = createContext();

export const ChatProvider = ({ bookingId, children }) => {
    const [conversations, setConversations] = useState([]);
    const [quickReplies, setQuickReplies] = useState([]);
    const [currentBotMessage, setCurrentBotMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [disableQuerySection, setDisableQuerySection] = useState(false);
    const socketRef = useRef(null);
    const token = localStorage.getItem('access_token')

    useEffect(() => {
        if (!bookingId) return;

        const socket = new WebSocket(`${BASE_WS_URL}`);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket connected");
            setIsConnected(true);
            setDisableQuerySection(true);
            const initialtest = `Help me with this itinerary - https://thetarzanway.com/itinerary/${bookingId} Explain my detailed plan.`;
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({ message: initialtest, token: token }));
            }
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            handleStreamData(data);
        };

        socket.onerror = (error) => {
            console.error("WebSocket Error", error);
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected");
            setIsConnected(false);
        };

        return () => {
            socket.close();
        };
    }, [bookingId]);

    const handleStreamData = (data) => {
        switch (data.type) {
            case 'typing_start':
                setIsTyping(true);
                break;

            case 'typing_stop':
                setIsTyping(false);
                break;

            case 'text_chunk':
                setCurrentBotMessage(prev => prev + data.content);
                break;

            case 'text_complete':
                setDisableQuerySection(false);
                setIsTyping(false);
                finalizeBotMessage(data.content); // Pass latest message
                break;

            case 'render_action':
                console.log('Logging render action with data:')
                console.log(data.content);
                break;

            case 'refresh_action':
                console.log('Logging refresh action with data:')
                console.log(data.content);
                break;

            case 'quick_replies':
                setQuickReplies(data.content);
                break;

            case 'error':
                setDisableQuerySection(false);
                setIsTyping(false);
                setConversations(prev => [
                    ...prev,
                    { msg: `${data.error}`, sender: 'bot' }
                ]);
                break;

            default:
                console.warn("Unhandled type:", data);
        }
    };

    const finalizeBotMessage = (message) => {
        if (message.trim() !== "") {
            setConversations(prev => [
                ...prev,
                { msg: message, sender: 'bot' }
            ]);
            setCurrentBotMessage('');
        }
    };

    const sendMessage = (msgObj) => {
        setDisableQuerySection(true);
        setQuickReplies([]);
        setConversations(prev => [...prev, msgObj]);
        console.log(msgObj);
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ message: msgObj.msg, token: token }));
        } else {
            console.warn("WebSocket is not open");
        }
    };

    return (
        <ChatContext.Provider
            value={{
                conversations,
                sendMessage,
                isConnected,
                isTyping,
                currentBotMessage,
                quickReplies,
                disableQuerySection
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);
