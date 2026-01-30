import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAnalyticsSession } from "../../hooks/useAnalyticsSession";

const RoutePreparationLoader = ({
  itineraryId,
  onComplete,
  onError,
  handleCompletion,
}) => {
  const [message, setMessage] = useState("Preparing your route...");
  const [reasoningParts, setReasoningParts] = useState([]);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const MAX_RECONNECT_ATTEMPTS = 3;
  const NO_RESPONSE_TIMEOUT = 10000;
  const { sessionId, isReady } = useAnalyticsSession();

  const handleRealCompletion = () => {
    if (hasCompletedRef.current) {
      console.log("⚠️ Completion already handled, ignoring duplicate call");
      return;
    }

    hasCompletedRef.current = true;

    setMessage("Route prepared successfully!");

    cleanupTimers();

    // ✅ Close WebSocket immediately to prevent reconnection
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log("🔌 Closing WebSocket after successful completion");
      socketRef.current.close();
    }

    handleCompletion?.();
  };

  const handleError = (errorMessage) => {
    if (hasCompletedRef.current) {
      console.log("Ignoring error after completion");
      return;
    }

    console.error("Error:", errorMessage);
    setMessage(errorMessage || "An error occurred while preparing your route");

    cleanupTimers();

    setTimeout(() => {
      onError?.(errorMessage);
    }, 2000);
  };

  const cleanupTimers = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (!isReady || !sessionId) {
      console.log("⏳ Waiting for session to be ready...");
      return;
    }

    const initializeSocket = () => {
      // Don't reconnect if already completed
      if (hasCompletedRef.current) {
        console.log("Already completed, skipping socket initialization");
        return;
      }

      try {
        const socketUrl = `wss://dev.chat.tarzanway.com/ws?session_id=${sessionId}`;
        console.log("🔌 Connecting to WebSocket:", socketUrl);

        socketRef.current = new WebSocket(socketUrl);

        socketRef.current.onopen = () => {
          console.log("✅ WebSocket connected successfully");
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
              if (data.error !== "Missing message.") {
                handleError(data.error);
              }
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
          console.log("⚠️ WebSocket disconnected:", event.code, event.reason);

          // Don't reconnect if already completed successfully
          if (hasCompletedRef.current) {
            return;
          }

          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttemptsRef.current++;
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log(
                `Reconnecting... (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`,
              );
              initializeSocket();
            }, 2000);
          } else {
            console.log("Max reconnection attempts reached");
            handleError("Connection lost. Please try again.");
          }
        };
      } catch (error) {
        console.error("WebSocket initialization error:", error);
        handleError("Failed to establish connection");
      }
    };

    initializeSocket();

    return () => {
      console.log("🧹 Cleaning up WebSocket");

      cleanupTimers();

      if (socketRef.current) {
        try {
          socketRef.current.close();
        } catch (err) {
          console.error("Error closing socket:", err);
        }
      }
    };
  }, [itineraryId, sessionId, isReady]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        {/* Animated Icon */}
        <div className="relative">
          <div className="">
            <Image
              src="/delivery 1.svg"
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
                  <p key={idx} className="text-xl-md font-600 text-gray-900 mb-2">
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
