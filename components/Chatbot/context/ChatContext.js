import React, { createContext, useContext, useEffect, useRef, useState } from "react";
const BASE_WS_URL = "wss://chat.tarzanway.com/ws";
const ChatContext = createContext();
import { useDispatch, useSelector } from 'react-redux';
import { updateSingleStayCityAndCheckInWise } from "../../../store/actions/StayBookings";
import setItinerary, { updateSinglePoiDetails } from "../../../store/actions/itinerary";
import { setTransfersBookings } from "../../../store/actions/transferBookingsStore";
import { axiosGetTransfers } from "../../../services/itinerary/bookings";

export const ChatProvider = ({ bookingId, children }) => {
    const [conversations, setConversations] = useState([]);
    const [quickReplies, setQuickReplies] = useState([]);
    const [lastProductSliderPosition, setLastProductSliderPosition] = useState(0);
    const [currentBotMessage, setCurrentBotMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [disableQuerySection, setDisableQuerySection] = useState(false);
    const socketRef = useRef(null);
    const token = localStorage.getItem('access_token');
    const itinerary = useSelector((state) => state.Itinerary);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!bookingId) return;

        let reconnectTimer;

        const connect = () => {
            const socket = new WebSocket(BASE_WS_URL);
            socketRef.current = socket;

            socket.onopen = () => {
                console.log("WebSocket connected");
                setIsConnected(true);
                setDisableQuerySection(true);

                const initialPrompt = `Help me with this itinerary - https://thetarzanway.com/itinerary/${bookingId} summarize my trip.`;
                if (socketRef.current?.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({ message: initialPrompt, token }));
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
                console.log("WebSocket disconnected. Attempting reconnect...");
                setIsConnected(false);
                reconnectTimer = setTimeout(connect, 2000); 
            };
        };

        connect();

        return () => {
            clearTimeout(reconnectTimer);
            socketRef.current?.close();
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
                finalizeBotMessage(data.content);
                break;

            case 'render_action':
                console.log('Logging render action with data:')
                console.log(data.content);
                if (data.content.length > 0) {
                    data.content.map((item) => {
                        updateProductSlider(item);
                    })
                }
                break;

            case 'refresh_action':
                console.log('Logging refresh action with data:')
                console.log(data.content);
                if (data.content.length > 0) {
                    data.content.map((item) => {
                        if (item.data) {
                            updateItineraryDetailsByaction(item);
                        }
                    })
                }
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


    const updateProductSlider = (payload) => {
        setLastProductSliderPosition(prev => {
            const newPosition = prev + 1;

            const dataMap = {
                hotel_search: payload?.data?.data,
                flights_search: payload?.data?.results,
                activity_search: payload?.data?.data?.activities,
                poi_search: payload?.data?.data?.pois,
            };

            const data = dataMap[payload.action_type]

            setConversations(prevConvs => [
                ...prevConvs,
                {
                    data,
                    sender: 'bot',
                    type: payload.action_type,
                    position: newPosition,
                }
            ]);

            return newPosition;
        });
    };

    const updateItineraryDetailsByaction = (payload) => {
        switch (payload.action_type) {
            case "createAccommodationBooking":
                dispatch(updateSingleStayCityAndCheckInWise(payload.data));
                break;

            case "createActivityBooking":
                console.log("createActivityBooking");
                updateActivityBooking(payload.data);
                break

            case "poiAdd":
                console.log("poiAdd");
                dispatch(updateSinglePoiDetails(payload.data));
                break

            case "createFlightBooking":
                console.log("createFlightBooking");
                fetchAllTransferBooking(bookingId)
                break

            default:
                console.log("Unhandle update details itinerary action :- ", payload.action_type);
                break;
        }
    }


    const updateActivityBooking = (res) => {

        const newItinerary = {
            ...itinerary,
            cities: itinerary?.cities?.map((city) => {
                if (city?.id === res?.itinerary_city) {
                    const updatedActivities = [...(city?.activities || []), res];

                    const activityData = {
                        activity: res?.activity?.id,
                        booking: {
                            id: res?.id,
                            pax:
                                res?.number_of_adults +
                                res?.number_of_children +
                                res?.number_of_infants,
                            duration: res?.duration,
                        },
                        element_type: "activity",
                        heading: res?.activity?.name,
                        icon: res?.image,
                        poi: null,
                        rating: res?.activity?.rating,
                        user_ratings_total: res?.activity?.user_ratings_total,
                    };

                    const date = res?.check_in.split(" ")[0];
                    const updatedDayByDay = city?.day_by_day?.map((day) => {
                        console.log(day?.date === date);
                        if (day?.date === date) {
                            return {
                                ...day,
                                slab_elements: [...(day?.slab_elements || []), activityData],
                            };
                        }
                        return day;
                    });

                    return {
                        ...city,
                        activities: updatedActivities,
                        day_by_day: updatedDayByDay,
                    };
                }
                return city;
            }),
        };

        dispatch(setItinerary(newItinerary));
    }


    const fetchAllTransferBooking = (id) => {
        axiosGetTransfers
            .get(`/${id}/bookings/transfers/`)
            .then((res) => {
                const data = res.data;
                dispatch(setTransfersBookings(data));
            })
            .catch((err) => {
                console.error("Error fetching all bookings", err.message);
            });
    }

    return (
        <ChatContext.Provider
            value={{
                conversations,
                sendMessage,
                isConnected,
                isTyping,
                currentBotMessage,
                quickReplies,
                disableQuerySection,
                lastProductSliderPosition
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);
