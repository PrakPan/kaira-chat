// components/itinerary/ConfirmationModal.tsx
import React, { useState, useEffect } from "react";
import { BsCalendar2, BsGeoAlt } from "react-icons/bs";
import { FaX } from "react-icons/fa6";
import ModalWithBackdrop from "../../../components/ui/ModalWithBackdrop";
import BottomModal from "../../../components/ui/LowerModal";
import { useDispatch } from "react-redux";
import { openNotification } from "../../../store/actions/notification";

interface ConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  itineraryName: string;
  onConfirm: (details: ConfirmationDetails) => void;
}

export interface ConfirmationDetails {
  startDate: string;
  adults: number;
  children: number;
  infants: number;
  startLocation: string;
}

// Simple Date Picker Component
const SimpleDatePicker = ({
  onSelect,
  onClose,
  currentDate,
}: {
  onSelect: (date: string) => void;
  onClose: () => void;
  currentDate: string;
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return new Date(year, month, day).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isPastDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isPrevMonthDisabled = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return year === today.getFullYear() && month <= today.getMonth();
  };

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(year, month, day);
    const isSelected = currentDate === dateStr;
    const isToday = today.toDateString() === new Date(year, month, day).toDateString();
    const isPast = isPastDate(year, month, day);

    days.push(
      <button
        key={day}
        disabled={isPast}
        onClick={() => { if (!isPast) { onSelect(dateStr); onClose(); } }}
        className={`aspect-square flex items-center justify-center rounded-full text-sm transition-all
          ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
          ${isSelected ? "bg-[#07213A] text-white font-semibold shadow-sm" : ""}
          ${!isSelected && !isPast ? "hover:bg-[#07213A]/10 text-gray-700" : ""}
          ${isToday && !isSelected ? "ring-1 ring-[#07213A] font-medium" : ""}
        `}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-semibold text-gray-800">Select Start Date</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
          <FaX size={12} className="text-gray-400 max-ph:hidden" />
        </button>
      </div>
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          onClick={() => !isPrevMonthDisabled() && setCurrentMonth(new Date(year, month - 1, 1))}
          className={`p-2 rounded-full transition-colors ${isPrevMonthDisabled() ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"}`}
          disabled={isPrevMonthDisabled()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="font-semibold text-gray-800 text-sm">{monthNames[month]} {year}</span>
        <button
          onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="aspect-square flex items-center justify-center text-[11px] text-gray-400 font-semibold uppercase">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">{days}</div>
    </div>
  );
};

// ─── ModalContent defined OUTSIDE ConfirmationModal ──────────────────────────
interface ModalContentProps {
  itineraryName: string;
  details: ConfirmationDetails;
  location: string;
  onLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHide: () => void;
  onConfirm: () => void;
  onOpenDatePicker: () => void;
  handleIncrement: (field: keyof Pick<ConfirmationDetails, "adults" | "children" | "infants">) => void;
  handleDecrement: (field: keyof Pick<ConfirmationDetails, "adults" | "children" | "infants">) => void;
}

const ModalContent: React.FC<ModalContentProps> = ({
  itineraryName,
  details,
  location,
  onLocationChange,
  onHide,
  onConfirm,
  onOpenDatePicker,
  handleIncrement,
  handleDecrement,
}) => {
  const paxConfig = [
    { field: "adults" as const, label: "Adults", subtitle: "Age 12+", icon: "👤" },
    { field: "children" as const, label: "Children", subtitle: "Age 2–12", icon: "🧒" },
    { field: "infants" as const, label: "Infants", subtitle: "Under 2", icon: "👶" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Confirm Itinerary Details</h2>
        <button onClick={onHide} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
          <FaX size={14} className="text-gray-400 max-ph:hidden" />
        </button>
      </div>

      {/* Start Location */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Start Location <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <BsGeoAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#07213A]/50" size={15} />
          <input
            type="text"
            value={location}
            onChange={onLocationChange}
            placeholder="e.g., New Delhi"
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#07213A]/15 focus:border-[#07213A]/30 text-sm transition-all placeholder:text-gray-400"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Start Date */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Start Date <span className="text-red-400">*</span>
        </label>
        <div
          onClick={onOpenDatePicker}
          className="w-full border border-gray-200 rounded-xl bg-white p-2.5 cursor-pointer flex items-center justify-between hover:border-[#07213A]/30 hover:ring-2 hover:ring-[#07213A]/10 transition-all"
        >
          <span className={`text-sm ${details.startDate ? "text-gray-800 font-medium" : "text-gray-400"}`}>
            {details.startDate || "Select start date"}
          </span>
          <BsCalendar2 className="text-[#07213A]/40" size={15} />
        </div>
      </div>

      {/* Pax Information */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Travelers
        </label>
        <div className="space-y-0 border border-gray-200 rounded-xl overflow-hidden">
          {paxConfig.map(({ field, label, subtitle, icon }, idx) => (
            <div
              key={field}
              className={`flex items-center justify-between px-3.5 py-3 bg-white ${
                idx < paxConfig.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{icon}</span>
                <div>
                  <span className="text-sm font-medium text-gray-800">{label}</span>
                  <span className="text-[11px] text-gray-400 block leading-tight">{subtitle}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDecrement(field)}
                  disabled={details[field] === 0}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-medium transition-all
                    ${details[field] === 0
                      ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95"
                    }`}
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-semibold text-gray-800 tabular-nums">
                  {details[field]}
                </span>
                <button
                  onClick={() => handleIncrement(field)}
                  className="w-8 h-8 rounded-lg bg-[#07213A] text-white flex items-center justify-center text-lg font-medium hover:bg-[#07213A]/90 active:scale-95 transition-all"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2.5">
        <button
          onClick={onHide}
          className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-3 py-2.5 bg-[#07213A] text-white font-medium rounded-xl text-sm hover:bg-[#07213A]/90 active:scale-[0.98] transition-all"
        >
          Confirm & View Prices
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  onHide,
  itineraryName,
  onConfirm,
}) => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [details, setDetails] = useState<ConfirmationDetails>({
    startDate: "",
    adults: 2,
    children: 0,
    infants: 0,
    startLocation: "",
  });
  const [location, setLocation] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleIncrement = (field: keyof Pick<ConfirmationDetails, "adults" | "children" | "infants">) => {
    setDetails((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const handleDecrement = (field: keyof Pick<ConfirmationDetails, "adults" | "children" | "infants">) => {
    if (details[field] > 0) {
      setDetails((prev) => ({ ...prev, [field]: prev[field] - 1 }));
    }
  };

  const handleConfirm = () => {
    if (!details.startDate) {
      dispatch(openNotification({ type: "error", text: "Please select a start date", heading: "Error!" }));
      return;
    }
    if (!location.trim()) {
      dispatch(openNotification({ type: "error", text: "Please enter start location", heading: "Error!" }));
      return;
    }
    onConfirm({ ...details, startLocation: location });
    onHide();
  };

  const modalContentProps: ModalContentProps = {
    itineraryName,
    details,
    location,
    onLocationChange: handleLocationChange,
    onHide,
    onConfirm: handleConfirm,
    onOpenDatePicker: () => setShowDatePicker(true),
    handleIncrement,
    handleDecrement,
  };

  return (
    <>
      {/* Main Confirmation Modal — always render both, toggle via show */}
      <ModalWithBackdrop
        closeIcon={false}
        show={show && !isMobile}
        onHide={onHide}
        borderRadius="20px"
        paddingX="0"
        paddingY="0"
        width="500px"
      >
        <ModalContent {...modalContentProps} />
      </ModalWithBackdrop>

      <BottomModal
        show={show && isMobile}
        onHide={onHide}
        width="100%"
        height="max-content"
        paddingX="0"
        paddingY="0"
      >
        <ModalContent {...modalContentProps} />
      </BottomModal>

      {/* Date Picker Modal */}
      <ModalWithBackdrop
        closeIcon={false}
        show={showDatePicker && !isMobile}
        onHide={() => setShowDatePicker(false)}
        borderRadius="20px"
        paddingX="0"
        paddingY="0"
        width="400px"
      >
        <SimpleDatePicker
          onSelect={(date) => setDetails((prev) => ({ ...prev, startDate: date }))}
          onClose={() => setShowDatePicker(false)}
          currentDate={details.startDate}
        />
      </ModalWithBackdrop>

      <BottomModal
        show={showDatePicker && isMobile}
        onHide={() => setShowDatePicker(false)}
        width="100%"
        height="max-content"
        paddingX="0"
        paddingY="0"
      >
        <SimpleDatePicker
          onSelect={(date) => setDetails((prev) => ({ ...prev, startDate: date }))}
          onClose={() => setShowDatePicker(false)}
          currentDate={details.startDate}
        />
      </BottomModal>
    </>
  );
};

export default ConfirmationModal;