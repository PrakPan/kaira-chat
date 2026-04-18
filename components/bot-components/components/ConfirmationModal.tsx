// components/itinerary/ConfirmationModal.tsx
import React, { useState, useEffect } from "react";
import { BsCalendar2, BsGeoAlt } from "react-icons/bs";
import { FaX } from "react-icons/fa6";
import ModalWithBackdrop from "../../../components/ui/ModalWithBackdrop";
import BottomModal from "../../../components/ui/LowerModal";
import { useDispatch } from "react-redux";
import { openNotification } from "../../../store/actions/notification";
import {
  PassengerRow,
  HeaderRow,
  PassengerLabel,
  CounterBox,
  CounterButton,
  CounterValue,
  ApplyButton,
  Section,
} from "../../../components/tailoredform/slidetwo/EnterPassenger";

interface ConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  itineraryName: string;
  onConfirm: (details: ConfirmationDetails) => void;
  isLoading?: boolean;
  onMobileChatSwitch?: () => void;
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
        disabled={isPast || isToday}
        onClick={() => { if (!isPast) { onSelect(dateStr); onClose(); } }}
        className={`aspect-square flex items-center justify-center rounded-full text-sm transition-all
          ${isPast || isToday ? "text-gray-300 cursor-not-allowed" : ""}
          ${isSelected ? "bg-[#07213A] text-white font-semibold shadow-sm" : ""}
          ${!isSelected && !isPast && !isToday ? "hover:bg-[#07213A]/10 text-gray-700" : ""}
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

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
const ConfirmationSkeleton = () => (
  <div className="p-6 animate-pulse">
    <div className="flex justify-between items-center mb-5">
      <div className="h-5 w-48 bg-gray-200 rounded" />
      <div className="h-6 w-6 bg-gray-200 rounded-full" />
    </div>
    <div className="mb-4">
      <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
      <div className="h-10 w-full bg-gray-200 rounded-xl" />
    </div>
    <div className="mb-4">
      <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
      <div className="h-10 w-full bg-gray-200 rounded-xl" />
    </div>
    <div className="mb-5">
      <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
      <div className="h-10 w-full bg-gray-200 rounded-xl" />
    </div>
    <div className="flex gap-2.5">
      <div className="flex-1 h-10 bg-gray-200 rounded-xl" />
      <div className="flex-1 h-10 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

// ─── Passenger Popup (uses EnterPassenger styled components) ─────────────────
interface PassengerPopupProps {
  adults: number;
  children: number;
  infants: number;
  onApply: (adults: number, children: number, infants: number) => void;
  onClose: () => void;
}

const PassengerPopup: React.FC<PassengerPopupProps> = ({
  adults: initialAdults,
  children: initialChildren,
  infants: initialInfants,
  onApply,
  onClose,
}) => {
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [infants, setInfants] = useState(initialInfants);

  const handleApply = () => {
    onApply(adults, children, infants);
    onClose();
  };

  return (
    <div className="flex flex-col justify-between items-center h-[436px] overflow-y-auto">
      <FaX
        size={14}
        className="text-black self-end mb-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
        onClick={onClose}
      />
      <HeaderRow>
        <div className="Heading2SB">Who&apos;s Going?</div> 
        <div className="Body2R_14">{adults + children + infants} Travelers</div>
      </HeaderRow>

      <Section className="w-full">
        {/* Adults */}
        <PassengerRow className="!w-[100%]">
          <PassengerLabel>
            <div className="Body2M_14">Adults</div>
            <div className="subtitle">Ages 13 or above</div>
          </PassengerLabel>
          <CounterBox>
            <CounterButton onClick={() => setAdults((p: number) => p - 1)} disabled={adults <= 1}>−</CounterButton>
            <CounterValue>{adults}</CounterValue>
            <CounterButton onClick={() => setAdults((p: number) => p + 1)}>+</CounterButton>
          </CounterBox>
        </PassengerRow>

        {/* Children */}
        <PassengerRow className="!w-[100%]">
          <PassengerLabel>
            <div className="Body2M_14">Children</div>
            <div className="subtitle">Ages 2 to 12</div>
          </PassengerLabel>
          <CounterBox>
            <CounterButton onClick={() => setChildren((p: number) => p - 1)} disabled={children <= 0}>−</CounterButton>
            <CounterValue>{children}</CounterValue>
            <CounterButton onClick={() => setChildren((p: number) => p + 1)}>+</CounterButton>
          </CounterBox>
        </PassengerRow>

        {/* Infants */}
        <PassengerRow className="!w-[100%]">
          <PassengerLabel>
            <div className="Body2M_14">Infants</div>
            <div className="subtitle">Under age 2</div>
          </PassengerLabel>
          <CounterBox>
            <CounterButton onClick={() => setInfants((p: number) => p - 1)} disabled={infants <= 0}>−</CounterButton>
            <CounterValue>{infants}</CounterValue>
            <CounterButton onClick={() => setInfants((p: number) => p + 1)}>+</CounterButton>
          </CounterBox>
        </PassengerRow>
      </Section>

      {/* Buttons */}
      <div className="flex justify-end w-full gap-2">
        <ApplyButton className="w-1/2" onClick={handleApply}>Apply</ApplyButton>
      </div>
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
  onOpenPassengerPicker: () => void;
  totalTravelers: number;
}

const ModalContent: React.FC<ModalContentProps> = ({
  itineraryName,
  details,
  location,
  onLocationChange,
  onHide,
  onConfirm,
  onOpenDatePicker,
  onOpenPassengerPicker,
  totalTravelers,
}) => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Confirm Itinerary Details</h2>
        <button onClick={onHide} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
          <FaX size={14} className="text-black max-ph:hidden" />
        </button>
      </div>

      {/* Start Location */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Start Location <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <BsGeoAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#07213A]/50" size={15} />
          <input
            type="text"
            value={location}
            onChange={onLocationChange}
            placeholder="e.g., New Delhi"
            className="w-full pl-9 pr-3 py-2.5 border rounded-[8px] bg-white focus:outline-none text-sm transition-all placeholder:text-gray-400"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Start Date */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Start Date <span className="text-red-400">*</span>
        </label>
        <div
          onClick={onOpenDatePicker}
          className="w-full border rounded-[8px] bg-white p-2.5 cursor-pointer flex items-center justify-between transition-all"
        >
          <span className={`text-sm ${details.startDate ? "text-gray-800 font-medium" : "text-gray-400"}`}>
            {details.startDate || "Select start date"}
          </span>
          <BsCalendar2 className="text-[#07213A]/40" size={15} />
        </div>
      </div>

      {/* Travelers - simple display with Change CTA */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Travelers
        </label>
        <div
          className="w-full border rounded-[8px] bg-white p-2.5 cursor-pointer flex items-center justify-between transition-all"
          onClick={onOpenPassengerPicker}
        >
          <span className="text-sm text-gray-800 font-medium">
            {totalTravelers} {totalTravelers === 1 ? "Traveler" : "Travelers"}
          </span>
          <span className="text-sm font-medium text-blue underline">Change</span>
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
  isLoading,
  onMobileChatSwitch,
}) => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [details, setDetails] = useState<ConfirmationDetails>({
    startDate: "",
    adults: 1,
    children: 0,
    infants: 0,
    startLocation: "",
  });
  const [location, setLocation] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassengerPicker, setShowPassengerPicker] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handlePassengerApply = (adults: number, children: number, infants: number) => {
    setDetails((prev) => ({ ...prev, adults, children, infants }));
  };

  const totalTravelers = details.adults + details.children + details.infants;

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
    // On mobile, switch to chat view
    if (isMobile && onMobileChatSwitch) {
      onMobileChatSwitch();
    }
  };

  const modalContentProps: ModalContentProps = {
    itineraryName,
    details,
    location,
    onLocationChange: handleLocationChange,
    onHide,
    onConfirm: handleConfirm,
    onOpenDatePicker: () => setShowDatePicker(true),
    onOpenPassengerPicker: () => setShowPassengerPicker(true),
    totalTravelers,
  };

  const renderContent = () => {
    if (isLoading) return <ConfirmationSkeleton />;
    return <ModalContent {...modalContentProps} />;
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
        {renderContent()}
      </ModalWithBackdrop>

      <BottomModal
        show={show && isMobile}
        onHide={onHide}
        width="100%"
        height="max-content"
        paddingX="0"
        paddingY="0"
      >
        {renderContent()}
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

      {/* Passenger Picker Modal */}
      <ModalWithBackdrop
        closeIcon={false}
        show={showPassengerPicker && !isMobile}
        onHide={() => setShowPassengerPicker(false)}
        borderRadius="12px"
        paddingX="20px"
        paddingY="20px"
        width="400px"
      >
        <PassengerPopup
          adults={details.adults}
          children={details.children}
          infants={details.infants}
          onApply={handlePassengerApply}
          onClose={() => setShowPassengerPicker(false)}
        />
      </ModalWithBackdrop>

      <BottomModal
        show={showPassengerPicker && isMobile}
        onHide={() => setShowPassengerPicker(false)}
        width="100%"
        height="max-content"
        paddingX="20px"
        paddingY="20px"
      >
        <PassengerPopup
          adults={details.adults}
          children={details.children}
          infants={details.infants}
          onApply={handlePassengerApply}
          onClose={() => setShowPassengerPicker(false)}
        />
      </BottomModal>
    </>
  );
};

export default ConfirmationModal;
