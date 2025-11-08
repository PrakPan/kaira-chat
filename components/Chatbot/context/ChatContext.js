import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CHATBOT_SOCKET_HOST, MERCURY_HOST } from "../../../services/constants";
const ChatContext = createContext();
import { useDispatch, useSelector } from "react-redux";
import { updateSingleStayCityAndCheckInWise } from "../../../store/actions/StayBookings";
import setItinerary, {
  updateSinglePoiDetails,
} from "../../../store/actions/itinerary";
import { setTransfersBookings } from "../../../store/actions/transferBookingsStore";
import { axiosGetTransfers } from "../../../services/itinerary/bookings";
import axios from "axios";
import moment from "moment";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";
import { setStays } from "../../../store/actions/StayBookings";
import { updateTransferBookings } from "../../../store/actions/transferBookingsStore";
import { useAnalytics } from "../../../hooks/useAnalytics";
import { openNotification } from "../../../store/actions/notification";
const localStorageKeyForSessionIds = "chatbotSessionIds";

export const ChatProvider = ({ itinearyId, children }) => {
  const [conversations, setConversations] = useState([]);
  const [quickReplies, setQuickReplies] = useState([]);
  const [lastProductSliderPosition, setLastProductSliderPosition] = useState(0);
  const [currentBotMessage, setCurrentBotMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [disableQuerySection, setDisableQuerySection] = useState(false);
  const socketRef = useRef(null);
  // const token = localStorage.getItem("access_token");
  const itinerary = useSelector((state) => state.Itinerary);
  const stays = useSelector((state) => state.Stays);
  const dispatch = useDispatch();
  const origin = " https://thetarzanway.com";
  // const origin = typeof window !== "undefined" ? window.location.origin : "https://thetarzanway.com/itinerary";
  const [isOpenChatHistoryDrawer, setOpenChatHistoryDrawer] = useState(false);
  const chatBotContainerRef = useRef(null);
  const [chatHistoryList, setChatHistoryList] = useState([]);
  const [isloadingChatHistory, setIsLoadingOfChatHistory] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    const oldSessionIds = JSON.parse(
      localStorage.getItem(localStorageKeyForSessionIds) || "{}"
    );
    return oldSessionIds[itinearyId] || null;
  });
  const { id } = useSelector((state) => state.auth);
  let reconnecting = false;
  const CallPaymentInfo = useSelector((state) => state.CallPaymentInfo);
  const { trackTransferBookingDelete } = useAnalytics();
  const { finalized_status } = useSelector((state) => state.ItineraryStatus);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!itinearyId || !token) return;
    console.log("initial run bot");
    // console.log("initial run bot")
    getAllChatHistory(itinearyId);
    if (sessionId) {
      showChatHistoryById(sessionId, true);
    }
  }, [itinearyId, token]);
  useEffect(() => {
    if (!itinearyId || !token) return;
    if (!sessionId && finalized_status === "SUCCESS") {
      connect(null);
    }
  }, [finalized_status, token]);

  const connect = (id = null) => {
    if (reconnecting) return;
    reconnecting = true;

    if (socketRef?.current) {
      socketRef.current.onopen = null;
      socketRef.current.onmessage = null;
      socketRef.current.onerror = null;
      socketRef.current.onclose = null;
      socketRef.current.close();
      socketRef.current = null;
      setCurrentBotMessage("");
      setIsTyping(false);
      setDisableQuerySection(false);
    }

    const wsUrl = id
      ? `${CHATBOT_SOCKET_HOST}?session_id=${id}`
      : CHATBOT_SOCKET_HOST;

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      reconnecting = false;
      console.log(
        "WebSocket connected with session:",
        id || "new",
        "Url:-",
        wsUrl
      );
      setIsConnected(true);

      if (!id) {
        setDisableQuerySection(true);
        // const interval = setInterval (() => {
        //   if(finalized_status=="SUCCESS"){

        const initialPrompt = `Help me with this itinerary - ${origin}/itinerary/${itinearyId} summarize my trip.`;
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(
            JSON.stringify({ message: initialPrompt, token })
          );
        }
        // clearInterval(interval);

        //   }
        // }, 1000);
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleStreamData(data, id);
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error", error);
      setIsConnected(false);
      setDisableQuerySection(false);
      setConversations((prev) => [
        ...prev,
        {
          message:
            "Oops! Looks like we lost connection. Try again in a bit, or hit ‘New Chat’ to keep the conversation continue.",
          is_bot: true,
        },
      ]);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected. Attempting reconnect...");
      setIsConnected(false);
      setTimeout(() => {
        reconnecting = false;
        connect(id);
      }, 2000);
    };
  };

  const handleStreamData = (data, id) => {
    switch (data.type) {
      case "typing_start":
        setIsTyping(true);
        break;

      case "typing_stop":
        setIsTyping(false);
        break;

      case "text_chunk":
        setCurrentBotMessage((prev) => prev + data.content);
        break;

      case "text_complete":
        setDisableQuerySection(false);
        setIsTyping(false);
        finalizeBotMessage(data.content);
        break;

      case "render_action":
        if (data.content?.length) {
          data.content.forEach((item) => updateProductSlider(item));
        }
        break;

      case "refresh_action":
        if (data.content?.length) {
          data.content.forEach((item) => {
            if (item.data) updateItineraryDetailsByaction(item);
          });
        }
        break;

      case "quick_replies":
        setQuickReplies(data.content);
        break;

      case "error":
        console.log("error in handledata:", data.error);
        setDisableQuerySection(false);
        setIsTyping(false);
        setConversations((prev) => [
          ...prev,
          { message: `${data.error}`, is_bot: true },
        ]);
        break;

      case "session":
        console.log(
          data,
          "Session established:",
          data.session_id,
          "Reconnected:",
          data.reconnected,
          "Last assing Id",
          id
        );
        let oldSessionIds = localStorage.getItem(localStorageKeyForSessionIds);
        oldSessionIds = oldSessionIds ? JSON.parse(oldSessionIds) : {};
        oldSessionIds[itinearyId] = data.session_id;
        localStorage.setItem(
          localStorageKeyForSessionIds,
          JSON.stringify(oldSessionIds)
        );
        if (!data.reconnected) {
          setChatHistoryList((prev) => [
            {
              id: data.session_id,
              date: moment().format("YYYY-MM-DD HH:mm:ss"),
              name: data.name || null,
            },
            ...prev,
          ]);
          setSessionId(data.session_id);
        }
        break;

      default:
        console.warn("Unhandled type:", data);
    }
  };

  const finalizeBotMessage = (message) => {
    if (message.trim() !== "") {
      setConversations((prev) => [...prev, { message: message, is_bot: true }]);
      setCurrentBotMessage("");
    }
  };

  const sendMessage = (msgObj) => {
    if (!msgObj?.message || !msgObj.message.trim()) {
      return;
    }
    setDisableQuerySection(true);
    setQuickReplies([]);

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      setConversations((prev) => [...prev, msgObj]);
      socketRef.current.send(
        JSON.stringify({ message: msgObj.message.trim(), token })
      );
    } else {
      setConversations((prev) => [
        ...prev,
        msgObj,
        {
          message:
            "Uh-oh! Message stuck Connection lost. Give it another try or hit ‘New Chat’ to keep the conversation continue.",
          is_bot: true,
        },
      ]);
      setDisableQuerySection(false);
    }
  };

  const updateProductSlider = (payload) => {
    setLastProductSliderPosition((prev) => {
      const newPosition = prev + 1;

      const dataMap = {
        hotel_search: payload?.data?.data,
        flights_search: payload?.data?.results,
        activity_search: payload?.data?.data?.activities,
        poi_search: payload?.data?.data?.pois,
      };

      const data = dataMap[payload.action_type];

      setConversations((prevConvs) => [
        ...prevConvs,
        {
          data,
          is_bot: true,
          type: payload.action_type,
          position: newPosition,
        },
      ]);

      return newPosition;
    });
  };

  const updateItineraryDetailsByaction = (payload) => {
    switch (payload.action_type) {
      case "createAccommodationBooking":
        dispatch(updateSingleStayCityAndCheckInWise(payload.data));
        dispatch(SetCallPaymentInfo(!CallPaymentInfo));
        dispatch(
          openNotification({
            type: "success",
            text: `${payload.data.name} hotel added successfully`,
            heading: "Success!",
          })
        );
        break;

      case "createActivityBooking":
        updateActivityBooking(payload.data);
        dispatch(SetCallPaymentInfo(!CallPaymentInfo));
        dispatch(
          openNotification({
            type: "success",
            text: `${payload.data.activity.name} activity added successfully`,
            heading: "Success!",
          })
        );
        break;

      case "poiAdd":
        dispatch(updateSinglePoiDetails(payload.data));
        dispatch(SetCallPaymentInfo(!CallPaymentInfo));
        dispatch(
          openNotification({
            type: "success",
            text: `${payload.data.heading} added successfully`,
            heading: "Success!",
          })
        );
        break;

      case "createFlightBooking":
        fetchAllTransferBooking(itinearyId);
        dispatch(SetCallPaymentInfo(!CallPaymentInfo));
        dispatch(
          openNotification({
            type: "success",
            text: `${payload.data.name} added successfully`,
            heading: "Success!",
          })
        );
        break;

      case "deleteAccommodationBooking":
        if (payload.data.status == 204) {
          deleteAccommodationBooking(payload.data);
          dispatch(SetCallPaymentInfo(!CallPaymentInfo));
          dispatch(
            openNotification({
              type: "success",
              text: "Booking deleted Successfully",
              heading: "Success!",
            })
          );
        }
        break;

      case "deleteActivityBooking":
        if (payload.data.status == 204) {
          deleteActivityBooking(payload.data);
          dispatch(SetCallPaymentInfo(!CallPaymentInfo));
          dispatch(
            openNotification({
              type: "success",
              text: "Activity deleted Successfully",
              heading: "Success!",
            })
          );
        }
        break;
      case "deleteFlightBooking":
        if (payload.data.status == 204) {
          dispatch(updateTransferBookings(payload.data.booking_id));
          trackTransferBookingDelete(itinearyId, payload.data.booking_id, id);
          dispatch(SetCallPaymentInfo(!CallPaymentInfo));
          dispatch(
            openNotification({
              type: "success",
              text: "Booking deleted Successfully",
              heading: "Success!",
            })
          );
        }
        break;

      default:
        console.log(
          "Unhandle update details itinerary action :- ",
          payload.action_type
        );
        break;
    }
  };

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
  };

  const deleteActivityBooking = (res) => {
    if (res.status != 204) return;
    const newItinerary = JSON.parse(JSON.stringify(itinerary));

    const itineraryCities = newItinerary.cities.map((city) => {
      city.day_by_day.forEach((day, index) => {
        if (day?.slab_elements) {
          day.slab_elements = day.slab_elements.filter(
            (item) => item?.booking?.id !== res?.booking_id
          );
        }
      });

      city.activities = city.activities?.filter(
        (item) => item?.id !== res?.booking_id
      );

      return city;
    });

    newItinerary.cities = itineraryCities;

    dispatch(setItinerary(newItinerary));
  };

  const deleteAccommodationBooking = (res) => {
    if (res.status != 204) return;
    const newItinerary = JSON.parse(JSON.stringify(itinerary));
    var newStays = JSON.parse(JSON.stringify(stays));
    newItinerary.cities = newItinerary.cities.map((item) => {
      const hasMatchingHotel = item?.hotels?.some(
        (hotel) => hotel?.id === res?.booking_id
      );

      if (hasMatchingHotel) {
        item.hotels = [];
        item.itinerary_city_id = item?.itinerary_city_id;
      }

      return item;
    });

    newStays = newStays.map((item) => {
      if (item?.id === res?.booking_id) {
        return {
          itinerary_city_id: item?.itinerary_city_id,
          check_in: item?.check_in,
          check_out: item?.check_out,
          city_id: item?.city_id,
          city_name: item?.city_name,
          duration: item?.duration,
          trace_city_id: item?.trace_city_id,
        };
      }
      return item;
    });

    dispatch(setStays(newStays));
    dispatch(setItinerary(newItinerary));
  };

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
  };

  const handleOpenChatHistory = () => {
    setOpenChatHistoryDrawer((prev) => !prev);
  };

  const getAllChatHistory = async (itineraryId) => {
    try {
      setIsLoadingOfChatHistory(true);
      const res = await axios.get(
        `${MERCURY_HOST}/chat/sessions?itinerary_id=${itineraryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (res?.data.length) {
        setChatHistoryList(res?.data);
      }
      setIsLoadingOfChatHistory(false);
    } catch (err) {
      setIsLoadingOfChatHistory(false);
      console.error(
        "Error fetching chat history:",
        err.response?.data || err.message
      );
      return null;
    }
  };

  const showChatHistoryById = async (id, isCallOnloading = false) => {
    if (!isCallOnloading) {
      handleOpenChatHistory();
    }
    setSessionId(id);
    connect(id);
    try {
      const res = await axios.get(`${MERCURY_HOST}/chat/sessions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (res?.data) {
        if (res.data?.chats?.length) {
          res.data.chats.shift();
        }
        setConversations(res.data.chats);
        setQuickReplies(res.data?.quick_replies || []);
      }
    } catch (err) {
      console.error(
        "Error fetching chat session:",
        err.response?.data || err.message
      );
      return null;
    }
  };

  const newSessionStart = async () => {
    setConversations([]);
    setQuickReplies([]);
    setSessionId(null);
    connect(null);
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
        disableQuerySection,
        lastProductSliderPosition,
        handleOpenChatHistory,
        isOpenChatHistoryDrawer,
        chatBotContainerRef,
        chatHistoryList,
        showChatHistoryById,
        sessionId,
        newSessionStart,
        isloadingChatHistory,
        getAllChatHistory
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
