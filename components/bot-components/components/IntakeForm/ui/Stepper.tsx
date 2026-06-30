import React from "react";

interface StepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  label?: string;
  sub?: string;
}

/** Reusable −/＋ numeric counter (used for nights and pax). */
const Stepper: React.FC<StepperProps> = ({
  value,
  onChange,
  min = 0,
  max = 30,
  label,
  sub,
}) => {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  const btn =
    "w-[30px] h-[30px] grid place-items-center rounded-full border-[1.5px] text-[16px] font-extrabold transition-all";

  return (
    <div className="flex items-center gap-3">
      {label && (
        <div className="flex-1">
          <div className="text-[13.5px] font-bold text-[#0b1220]">{label}</div>
          {sub && <div className="text-[11px] text-[#8a93a6]">{sub}</div>}
        </div>
      )}
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        className={btn}
        style={{
          background: "#fff",
          borderColor: "#ececec",
          color: "#1a2436",
          opacity: value <= min ? 0.35 : 1,
          cursor: value <= min ? "not-allowed" : "pointer",
        }}
      >
        −
      </button>
      <span className="text-[15px] font-extrabold text-[#0b1220] min-w-[22px] text-center tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        className={btn}
        style={{
          background: "#fff",
          borderColor: "#ececec",
          color: "#1a2436",
          opacity: value >= max ? 0.35 : 1,
          cursor: value >= max ? "not-allowed" : "pointer",
        }}
      >
        +
      </button>
    </div>
  );
};

export default Stepper;
