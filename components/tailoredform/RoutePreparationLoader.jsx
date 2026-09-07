import { useState, useEffect, useRef } from "react";
import { useAnalyticsSession } from "../../hooks/useAnalyticsSession";
import { CHATBOT_SOCKET_HOST } from "../../services/constants";
import { IconCheck } from "./kaira/icons";

/**
 * The "One second. I'm reading {destination}…" interstitial shown between
 * step 1 and the route step while /initiate runs.
 *
 * The socket plumbing is unchanged from the previous loader: it listens to
 * the chatbot progress stream for this session and completes once the
 * /initiate call has succeeded (apiSucceeded) — either straight away, or
 * when the stream sends `done`. Only the rendering is new (Kaira design).
 */
const RoutePreparationLoader = ({
  itineraryId,
  onComplete,
  onError,
  handleCompletion,
  apiSucceeded,
  destName,
  monthPhrase,
  fetchLabels = [],
}) => {
  const [message, setMessage] = useState("");
  const [reasoningParts, setReasoningParts] = useState([]);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const noResponseTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const apiSucceededRef = useRef(false);
  const MAX_RECONNECT_ATTEMPTS = 3;
  const { sessionId, isReady } = useAnalyticsSession();

  useEffect(() => {
    apiSucceededRef.current = apiSucceeded;
  }, [apiSucceeded]);

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

    cleanupTimers();

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }

    if (handleCompletion) {
      handleCompletion();
    } else if (onComplete) {
      onComplete();
    } else {
      console.warn("⚠️ No completion handler defined");
    }
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
        const socketUrl = `${CHATBOT_SOCKET_HOST}?session_id=${sessionId}`;

        socketRef.current = new WebSocket(socketUrl);

        socketRef.current.onopen = () => {
          reconnectAttemptsRef.current = 0;
        };

        socketRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === "progress" && data.text) {
              setReasoningParts((prev) => [...prev, data.text]);
              setMessage(data.text.trim());
            }

            // Only complete if API has succeeded
            if (data.type === "done") {
              if (apiSucceededRef.current) {
                handleRealCompletion();
              }
              return;
            }

            if (data.type === "session") {
              return;
            }

            if (data.type === "error") {
              console.error("Server error:", data.error);
              // Keep the reading screen up; /initiate decides success.
              return;
            }
          } catch (err) {
            console.error("Failed to parse WebSocket message", err, event.data);
          }
        };

        socketRef.current.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        socketRef.current.onclose = () => {
          // Don't reconnect if already completed successfully
          if (hasCompletedRef.current) {
            return;
          }

          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttemptsRef.current++;
            reconnectTimeoutRef.current = setTimeout(() => {
              initializeSocket();
            }, 2000);
          }
        };
      } catch (error) {
        console.error("WebSocket initialization error:", error);
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

  // Which of the three labels is "active": advance one per progress message
  // from the stream, and mark everything done once /initiate has succeeded.
  const labels = fetchLabels.length
    ? fetchLabels
    : ["Searching your destination", "Drafting your route", "Picking what's good"];
  const active = apiSucceeded
    ? labels.length
    : Math.min(reasoningParts.length, labels.length - 1);

  // The stream's latest line, minus markdown bold, so the live reasoning still
  // shows through under the checklist.
  const live = message.replace(/\*\*/g, "").split("\n\n")[0];

  return (
    <div className="kform-fetch">
      <img className="kform-fetch-avatar" src="/KairaInsta.png" alt="Kaira" />
      <h2 className="kform-fetch-h2">
        One second. I'm <span className="kform-serif">reading</span>{" "}
        {destName || "your trip"}
        {monthPhrase ? ` in ${monthPhrase}` : ""}.
      </h2>
      <p className="kform-fetch-p">
        Your route and my suggestions come from your dates. Seasons, festivals,
        what's actually open.
      </p>
      <div className="kform-fetch-steps">
        {labels.map((label, i) => {
          const state = i < active ? "is-done" : i === active ? "is-active" : "is-pending";
          return (
            <div key={label} className={`kform-fetch-step ${state}`}>
              {state === "is-done" ? (
                <IconCheck size={14} style={{ color: "#1f8a5a" }} />
              ) : state === "is-active" ? (
                <span className="kform-spin" />
              ) : (
                <span className="kform-ring" />
              )}
              <span>{label}</span>
            </div>
          );
        })}
      </div>
      {live ? <div className="kform-fetch-live">{live}</div> : null}
    </div>
  );
};

export default RoutePreparationLoader;
