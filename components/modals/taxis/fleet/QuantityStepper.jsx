import React from "react";

/**
 * −/+ around a count, used on a result card and again on each line of the floating bar.
 *
 * There is no upper bound. The backend stopped capping the number of cars in a booking, and a
 * "+" that silently stops responding reads as a broken button rather than as a rule.
 */
const QuantityStepper = ({
  value = 0,
  onChange,
  disabled = false,
  label = "taxi",
  size = "md",
}) => {
  const dimension = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const count = Number(value) || 0;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={`Remove one ${label}`}
        disabled={disabled || count <= 0}
        onClick={() => onChange?.(count - 1)}
        className={`${dimension} shrink-0 rounded-full border-sm border-solid border-[#ececec] bg-white text-[#445069] leading-none disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0b1220] transition-colors`}
      >
        −
      </button>
      <span className="w-5 text-center text-sm font-600 text-[#0b1220] tabular-nums">
        {count}
      </span>
      <button
        type="button"
        aria-label={`Add one ${label}`}
        disabled={disabled}
        onClick={() => onChange?.(count + 1)}
        className={`${dimension} shrink-0 rounded-full border-sm border-solid border-[#ececec] bg-white text-[#445069] leading-none disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0b1220] transition-colors`}
      >
        +
      </button>
    </div>
  );
};

export default QuantityStepper;
