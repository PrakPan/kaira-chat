import { getIndianPrice } from "../../../../services/getIndianPrice";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";


export default function PriceContainer({ data, isSelected, selectedBooking, _updateBookingHandler, provider }) {
    return (
        <div className="lg:w-[30%] flex flex-row items-center justify-between">
            <div className="flex flex-col gap-1">
                <div className="text-lg font-bold">
                    {data.finalFare ? `₹${getIndianPrice(data.finalFare)}` : null}
                </div>
                {data.isRefundable ? (
                    <div className="text-xs bg-[#F8E000] px-2 py-1 rounded-lg">
                        Refundable
                    </div>
                ) : null}
            </div>

            <div>
                {isSelected ? (
                    <div className="flex items-center gap-1">
                        <ImCheckboxChecked className="inline" /> Selected
                    </div>
                ) : (
                    <div
                        className="flex items-center gap-1"
                        onClick={() => {
                            _updateBookingHandler({
                                booking_id: selectedBooking.id,
                                itinerary_id: selectedBooking.itinerary_id,
                                result_index: data.resultIndex,
                                provider
                            });
                        }}
                    >
                        <ImCheckboxUnchecked className="inline" /> Select
                    </div>
                )}
            </div>
        </div>
    );
}
