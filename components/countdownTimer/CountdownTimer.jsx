import { useEffect, useRef, useState } from "react";

export default function CountdownTimer({ priceValidUntil }) {
  const targetTime = priceValidUntil ? new Date(priceValidUntil.replace(" ", "T")).getTime() : null;

  const calculateTimeLeft = () => Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    if (!targetTime || targetTime <= Date.now()) return;

    let animationFrameId;
    let intervalId;

    const updateTime = () => {
      const now = Date.now();

      if (now - lastUpdateRef.current > 2000) {
        setTimeLeft(calculateTimeLeft()); // force re-sync on tab sleep/wake
      }

      lastUpdateRef.current = now;
      animationFrameId = requestAnimationFrame(updateTime);
    };

    updateTime();

    intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
    };
  }, [targetTime]);

  if (!targetTime || timeLeft <= 0) {
    return null;
  }

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const bgColor = timeLeft > 300 ? "bg-[#169873]" : "bg-red-500";

  return (
    <div className="flex flex-col items-center bg-[#FBFBFB] p-4 rounded-lg">
      <h2 className="text-lg font-medium text-gray-900">Offer will end in</h2>

      <div className="flex items-center mt-2">
        {[...minutes, ...seconds].map((char, idx) => (
          <div
            key={idx}
            className={`w-12 h-12 ${bgColor} text-white text-xl font-bold flex items-center justify-center rounded-md mx-1`}
          >
            {char}
          </div>
        )).reduce((acc, el, idx) =>
          idx === 1
            ? [...acc, el, <span key="colon" className="mx-2 text-xl font-bold text-gray-900">:</span>]
            : [...acc, el]
        , [])}
      </div>

      <div className="flex gap-10 text-gray-600 text-sm mt-2">
        <span>Minutes</span>
        <span>Seconds</span>
      </div>
    </div>
  );
}
