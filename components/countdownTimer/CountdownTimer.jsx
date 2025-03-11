import { useEffect, useState } from "react";

export default function CountdownTimer({ priceValidUntil }) {
  const targetTime = new Date(priceValidUntil.replace(" ", "T")).getTime();
  const currentTime = new Date().getTime();

  if (targetTime <= currentTime) {
    return null;
  }

  const calculateTimeLeft = () => Math.max(0, Math.floor((targetTime - new Date().getTime()) / 1000));

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (timeLeft <= 0) return; 

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [priceValidUntil]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0"); 
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const bgColor = timeLeft > 300 ? "bg-[#169873]" : "bg-red-500";

  return (
    <div className="flex flex-col items-center bg-[#FBFBFB] p-4 rounded-lg">
      <h2 className="text-lg font-medium text-gray-900">Offer will end in</h2>
      
      <div className="flex items-center mt-2">
        <div className={`w-12 h-12 ${bgColor} text-white text-xl font-bold flex items-center justify-center rounded-md mx-1`}>
          {minutes[0]}
        </div>
        <div className={`w-12 h-12 ${bgColor} text-white text-xl font-bold flex items-center justify-center rounded-md mx-1`}>
          {minutes[1]}
        </div>

        <span className="mx-2 text-xl font-bold text-gray-900">:</span>

        <div className={`w-12 h-12 ${bgColor} text-white text-xl font-bold flex items-center justify-center rounded-md mx-1`}>
          {seconds[0]}
        </div>
        <div className={`w-12 h-12 ${bgColor} text-white text-xl font-bold flex items-center justify-center rounded-md mx-1`}>
          {seconds[1]}
        </div>
      </div>

      <div className="flex gap-10 text-gray-600 text-sm mt-2">
        <span>Minutes</span>
        <span>Seconds</span>
      </div>
    </div>
  );
}
