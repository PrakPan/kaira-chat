import React, { useMemo, useState } from "react";
import { MdCheck, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { getIndianPrice } from "../../../../../services/getIndianPrice";

/**
 * Optional extras a supplier offers on one taxi quote — child seats, meet & greet,
 * ride tracking, driver information, extra waiting time.
 *
 * Only Mozio quotes carry an `amenities` array today (Self/Gozo have no such concept), so
 * this renders NOTHING when the quote has none and every other supplier's card is byte for
 * byte what it was.
 *
 * The prices here are the supplier's DISPLAY prices, converted server-side into the search
 * currency. They are an estimate, not the charge: amenity pricing is per-provider and not
 * reliably additive, so mercury re-prices the whole quote through Mozio when the booking is
 * created and the booking's own price is what the traveller pays. That is why the summary
 * below says "approx".
 *
 * `included` amenities are shown but never selectable — they are already in the fare, and
 * re-requesting one is a no-op at best and double-charged at worst (mercury drops them too).
 */
const AmenitySelector = ({
  amenities,
  selected = [],
  onChange,
  currencySymbol = "₹",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);

  const { selectable, included } = useMemo(() => {
    const list = Array.isArray(amenities) ? amenities : [];
    return {
      selectable: list.filter((item) => item?.key && item?.selectable),
      included: list.filter((item) => item?.key && item?.included),
    };
  }, [amenities]);

  if (!selectable.length && !included.length) return null;

  const isSelected = (key) => selected.includes(key);

  const toggle = (key) => {
    if (disabled) return;
    onChange?.(
      isSelected(key)
        ? selected.filter((item) => item !== key)
        : [...selected, key],
    );
  };

  // Sum of what has been ticked, for the "+X extras" hint. Mercury's re-price is
  // authoritative, so this is deliberately labelled as approximate.
  const extrasTotal = selectable.reduce(
    (total, item) => (isSelected(item.key) ? total + Number(item.price || 0) : total),
    0,
  );

  const selectedCount = selectable.filter((item) => isSelected(item.key)).length;

  const priceLabel = (price) => {
    const amount = Number(price || 0);
    if (!amount) return "Free";
    return `+${currencySymbol}${getIndianPrice(Math.ceil(amount))}`;
  };

  return (
    <div className="mt-2 border-t border-dashed border-[#ececec] pt-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 text-[13px] font-600 text-[#0b1220] cursor-pointer bg-transparent border-0 p-0"
      >
        <span>
          {selectable.length ? "Add extras" : "What's included"}
          {selectedCount > 0 ? ` (${selectedCount})` : ""}
        </span>
        {open ? <MdKeyboardArrowUp size={16} /> : <MdKeyboardArrowDown size={16} />}
      </button>

      {/* Collapsed hint, so a traveller who never expands still sees they picked extras. */}
      {!open && extrasTotal > 0 ? (
        <div className="mt-1 text-[12px] text-[#445069]">
          {`${selectedCount} extra${selectedCount > 1 ? "s" : ""} added · +${currencySymbol}${getIndianPrice(
            Math.ceil(extrasTotal),
          )}`}
        </div>
      ) : null}

      {open ? (
        <div className="mt-1.5 flex flex-col gap-0.5">
          {selectable.map((item) => {
            const checked = isSelected(item.key);
            return (
              <label
                key={item.key}
                className={`relative flex items-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors ${
                  checked
                    ? "bg-[#fff6cc]"
                    : "bg-[#f7f6f1] hover:bg-[#f1efe6]"
                } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
              >
                {/* The native input stays in the DOM for keyboard and screen-reader users;
                    the square below is what is actually seen. Hidden with inline styles
                    rather than a utility class so it cannot be lost to a tailwind purge. */}
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggle(item.key)}
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: 1,
                    height: 1,
                    pointerEvents: "none",
                  }}
                />
                <span
                  aria-hidden="true"
                  className={`mt-[1px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border-[1.5px] transition-colors ${
                    checked
                      ? "border-[#07213A] bg-[#07213A] text-white"
                      : "border-[#8a8878] bg-white text-transparent"
                  }`}
                >
                  <MdCheck size={13} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span
                      className={`text-[13px] leading-snug text-[#0b1220] ${
                        checked ? "font-600" : "font-500"
                      }`}
                    >
                      {item.name || item.key}
                    </span>
                    <span
                      className={`shrink-0 whitespace-nowrap text-[13px] font-600 ${
                        Number(item.price || 0) ? "text-[#0b1220]" : "text-[#3f5a2f]"
                      }`}
                    >
                      {priceLabel(item.price)}
                    </span>
                  </span>
                  {item.description ? (
                    <span className="mt-[1px] block text-[11.5px] leading-snug text-[#7A7A7A]">
                      {item.description}
                    </span>
                  ) : null}
                </span>
              </label>
            );
          })}

          {included.length ? (
            <div className="flex flex-wrap gap-1 pt-1">
              {included.map((item) => (
                <span
                  key={item.key}
                  className="text-[11px] px-2 py-[2px] rounded-full bg-[#f1f5ea] text-[#3f5a2f] whitespace-nowrap"
                  title={item.description || ""}
                >
                  {`${item.name || item.key} included`}
                </span>
              ))}
            </div>
          ) : null}

          {extrasTotal > 0 ? (
            <div className="mt-0.5 flex items-baseline justify-between gap-2 border-t border-dashed border-[#ececec] pt-1.5">
              <span className="text-[12px] text-[#7A7A7A]">
                Confirmed by the supplier when this taxi is added
              </span>
              <span className="shrink-0 whitespace-nowrap text-[13px] font-600 text-[#0b1220]">
                {`+${currencySymbol}${getIndianPrice(Math.ceil(extrasTotal))}`}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default AmenitySelector;
