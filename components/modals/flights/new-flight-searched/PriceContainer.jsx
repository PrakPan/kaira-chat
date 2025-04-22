import { useRouter } from "next/router";
import { getIndianPrice } from "../../../../services/getIndianPrice";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";

export default function PriceContainer({
  data,
  isSelected,
  selectedBooking,
  _updateBookingHandler,
  provider,
  onSelect,
  trace_id,
  onFlightSelect
}) {
  const router = useRouter();

  const handleSelect = () => {
    onFlightSelect?.();

    if (onSelect) {
      onSelect({
        ...data,
        booking_type: "Flight",
        trace_id: trace_id || localStorage.getItem("Travclan_trace_id"),
      });
    } else {
      _updateBookingHandler({
        booking_id: selectedBooking.id,
        itinerary_id: selectedBooking.itinerary_id || router?.query?.id,
        result_index: data.resultIndex,
        provider,
      });
    }
  };

  return (
    <div className="flex md:flex-col justify-between items-center">
      <div className="flex flex-col gap-1">
        <div className="text-lg font-bold">
          {data.finalFare ? `₹${getIndianPrice(data.finalFare)}` : null}
        </div>
      </div>

      {_updateBookingHandler && (
        <div>
          {isSelected ? (
            <div className="flex items-center gap-1">
              <ImCheckboxChecked className="inline" /> Selected
            </div>
          ) : (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={handleSelect}
            >
              <ImCheckboxUnchecked className="inline" /> Select
            </div>
          )}
        </div>
      )}
    </div>
  );
}
