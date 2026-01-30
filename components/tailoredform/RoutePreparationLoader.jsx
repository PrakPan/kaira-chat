import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAnalyticsSession } from "../../hooks/useAnalyticsSession";

const RoutePreparationLoader = ({
  itineraryId,
  onComplete,
  onError,
  handleCompletion,
  apiSucceeded, 
}) => {
  const [message, setMessage] = useState("Preparing your route...");
  const [reasoningParts, setReasoningParts] = useState([]);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const noResponseTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const MAX_RECONNECT_ATTEMPTS = 3;
  const NO_RESPONSE_TIMEOUT = 10000;
  const { sessionId, isReady } = useAnalyticsSession();

  useEffect(() => {
  if (apiSucceeded && !hasCompletedRef.current) {
    const timer = setTimeout(() => {
      handleRealCompletion();
    }, 100);
    
    return () => clearTimeout(timer);
  }
}, [apiSucceeded]);

  const handleRealCompletion = () => {
  if (hasCompletedRef.current) {
    return;
  }

  hasCompletedRef.current = true;

  setMessage("Route prepared successfully!");

  cleanupTimers();

  // ✅ Close WebSocket immediately to prevent reconnection
  if (socketRef.current?.readyState === WebSocket.OPEN) {
    socketRef.current.close();
  }

  // Call completion handler immediately
  if (handleCompletion) {
    handleCompletion();
  } else {
    console.warn("⚠️ handleCompletion is not defined");
  }
};

  const handleError = (errorMessage) => {
    if (hasCompletedRef.current) {
      return;
    }

    console.error("Error:", errorMessage);
    // Don't show error message, keep showing "Preparing your route..."
    // Just log it and let API success/failure handle the UI

    cleanupTimers();
  };

  const cleanupTimers = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (noResponseTimeoutRef.current) {
      clearTimeout(noResponseTimeoutRef.current);
      noResponseTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (!isReady || !sessionId) {

      // Don't return - still show the loading message even if session isn't ready
    }

    const initializeSocket = () => {
      // Don't reconnect if already completed
      if (hasCompletedRef.current) {
        return;
      }

      // Don't try to connect if session isn't ready
      if (!isReady || !sessionId) {
        return;
      }

      try {
        const socketUrl = `wss://chat.tarzanway.com/ws?session_id=${sessionId}`;

        socketRef.current = new WebSocket(socketUrl);

        socketRef.current.onopen = () => {
          reconnectAttemptsRef.current = 0;
        };

        socketRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === "progress" && data.text) {
              setReasoningParts((prev) => {
                const newParts = [...prev, data.text];
                return newParts;
              });

              setMessage(data.text.trim());

              const currentParts = reasoningParts.length + 1;
              const newProgress = Math.min(20 + currentParts * 15, 95);
            }

            // Handle done event - this is the success case
            if (data.type === "done") {
              handleRealCompletion();
              return;
            }

            // Handle session events (just log them)
            if (data.type === "session") {
              return;
            }

            // Handle errors
            if (data.type === "error") {
              console.error("Server error:", data.error);
              // Don't show error, keep showing "Preparing your route..."
              return;
            }
          } catch (err) {
            console.error("Failed to parse WebSocket message", err, event.data);
          }
        };

        socketRef.current.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        socketRef.current.onclose = (event) => {

          // Don't reconnect if already completed successfully
          if (hasCompletedRef.current) {
            return;
          }

          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttemptsRef.current++;
            reconnectTimeoutRef.current = setTimeout(() => {
              initializeSocket();
            }, 2000);
          } else {
          }
        };
      } catch (error) {
        console.error("WebSocket initialization error:", error);
        // Don't show error, keep showing "Preparing your route..." until API completes
      }
    };

    if (isReady && sessionId) {
      initializeSocket();
    }

    return () => {

      cleanupTimers();

      if (socketRef.current) {
        try {
          socketRef.current.close();
        } catch (err) {
          console.error("Error closing socket:", err);
        }
      }
    };
  }, [itineraryId, sessionId, isReady, apiSucceeded, handleCompletion]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="flex flex-col items-center gap-6 max-w-md  text-center">
        {/* Animated Icon */}
        <div className="relative">
          <div className="">
            <Image
              src="/delivery 1-1.svg"
              width={120}
              height={120}
              alt="Route preparation"
              priority
            />
          </div>
        </div>

        {/* Title */}
        {/* <h2 className="text-xl-md font-600 text-gray-900">
          Preparing your route...
        </h2> */}

        <div className="min-h-[60px] flex items-center justify-center">
          <div className="text-md text-gray-600 leading-relaxed animate-fade-in max-w-xl">
            {message.split("\n\n").map((paragraph, idx) => {
              const isBold =
                paragraph.startsWith("**") && paragraph.includes("**");

              if (isBold) {
                const boldText = paragraph.replace(/\*\*/g, "");
                return (
                  <p key={idx} className="text-[24px] font-600 text-gray-900 mb-2">
                    {boldText}
                  </p>
                );
              }

              return (
                <p key={idx} className="mb-2 last:mb-0">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RoutePreparationLoader;