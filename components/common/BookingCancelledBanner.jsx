import { MdEventBusy } from "react-icons/md";

// Shown on a booked hotel once ops have cancelled it with the supplier
// (mercury moves the booking to status "Cancelled").
export const BOOKING_STATUS_CANCELLED = "Cancelled";

export const isBookingCancelled = (booking) =>
  booking?.status === BOOKING_STATUS_CANCELLED;

export default function BookingCancelledBanner({ className = "" }) {
  return (
    <div
      role="status"
      className={`flex items-start gap-3 bg-[#FEF3F2] ${className}`}
      style={{
        padding: "12px 14px",
        border: "1px solid #FAD7D3",
        borderLeft: "3px solid #D92D20",
        borderRadius: 8,
      }}
    >
      <span
        className="flex items-center justify-center shrink-0 rounded-full bg-[#FEE4E2] text-[#D92D20]"
        style={{ width: 32, height: 32 }}
      >
        <MdEventBusy size={18} />
      </span>
      <div className="flex flex-col gap-1 min-w-0">
        <div className="text-sm font-600 leading-md text-[#912018]">
          This booking has been cancelled
        </div>
        <div className="text-xs font-400 leading-sm text-[#B42318]">
          Your reservation at this hotel has been cancelled by our team. Any
          refund will be processed as per the cancellation policy.
        </div>
      </div>
    </div>
  );
}
