// components/itinerary/ConfirmationModal.tsx
import React, { useState, useEffect } from "react";
import { BsCalendar2, BsPerson, BsGeoAlt, BsBuilding } from "react-icons/bs";
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
  hotelPreference: string;
}

// Simple Date Picker Component
const SimpleDatePicker = ({ onSelect, onClose, currentDate }: { onSelect: (date: string) => void; onClose: () => void; currentDate: string }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  // Generate calendar days
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="w-10 h-10" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(year, month, day);
    const isSelected = currentDate === dateStr;
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
    
    days.push(
      <button
        key={day}
        onClick={() => {
          onSelect(dateStr);
          onClose();
        }}
        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm transition-colors
          ${isSelected ? 'bg-[#F7E700] text-gray-800 font-medium' : 'hover:bg-gray-100'}
          ${isToday && !isSelected ? 'border border-[#F7E700]' : ''}
        `}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold text-gray-800">Select Start Date</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <FaX size={14} className="text-gray-500" />
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="font-medium text-gray-800">
          {monthNames[month]} {year}
        </span>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="w-10 h-8 flex items-center justify-center text-xs text-gray-500 font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
};

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
    hotelPreference: "standard",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [inputValue, setInputValue] = useState(""); // For controlled input

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Update input value when startLocation changes
  useEffect(() => {
    setInputValue(details.startLocation);
  }, [details.startLocation]);

  const handleIncrement = (field: keyof Pick<ConfirmationDetails, "adults" | "children" | "infants">) => {
    setDetails(prev => ({
      ...prev,
      [field]: prev[field] + 1
    }));
  };

  const handleDecrement = (field: keyof Pick<ConfirmationDetails, "adults" | "children" | "infants">) => {
    if (details[field] > 0) {
      setDetails(prev => ({
        ...prev,
        [field]: prev[field] - 1
      }));
    }
  };

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setInputValue(value);
  setDetails(prev => ({ ...prev, startLocation: value }));
};

  const handleConfirm = () => {
    if (!details.startDate) {
      dispatch(
        openNotification({
          type: "error",
          text: "Please select a start date",
          heading: "Error!",
        })
      );
      return;
    }

    if (!details.startLocation.trim()) {
      dispatch(
        openNotification({
          type: "error",
          text: "Please enter start location",
          heading: "Error!",
        })
      );
      return;
    }

    onConfirm(details);
    onHide();
  };

  const ModalContent = () => (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Confirm Itinerary Details
        </h2>
        <button
          onClick={onHide}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaX size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Itinerary Name */}
      <div className="mb-4 p-2.5 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">Itinerary</p>
        <p className="text-sm font-medium text-gray-800 truncate">{itineraryName}</p>
      </div>

      {/* Start Date */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Start Date <span className="text-red-500">*</span>
        </label>
        <div
          onClick={() => setShowDatePicker(true)}
          className="w-full border border-gray-300 rounded-lg bg-gray-50 p-2.5 cursor-pointer flex items-center justify-between hover:border-gray-400 transition-colors"
        >
          <span className={`text-sm ${details.startDate ? 'text-gray-800' : 'text-gray-500'}`}>
            {details.startDate || "Select start date"}
          </span>
          <BsCalendar2 className="text-gray-400" size={16} />
        </div>
      </div>

      {/* Pax Information */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Number of Travelers
        </label>
        
        {/* Adults */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-sm font-medium text-gray-800">Adults</span>
            <span className="text-xs text-gray-500 block">Above 12 years</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDecrement("adults")}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-base font-medium"
            >
              -
            </button>
            <span className="w-7 text-center text-sm font-medium">{details.adults}</span>
            <button
              onClick={() => handleIncrement("adults")}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-base font-medium"
            >
              +
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-sm font-medium text-gray-800">Children</span>
            <span className="text-xs text-gray-500 block">2-12 years</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDecrement("children")}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-base font-medium"
            >
              -
            </button>
            <span className="w-7 text-center text-sm font-medium">{details.children}</span>
            <button
              onClick={() => handleIncrement("children")}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-base font-medium"
            >
              +
            </button>
          </div>
        </div>

        {/* Infants */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-800">Infants</span>
            <span className="text-xs text-gray-500 block">Below 2 years</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDecrement("infants")}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-base font-medium"
            >
              -
            </button>
            <span className="w-7 text-center text-sm font-medium">{details.infants}</span>
            <button
              onClick={() => handleIncrement("infants")}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-base font-medium"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Start Location - Fixed input */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Start Location <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <BsGeoAlt className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setDetails(prev => ({ ...prev, startLocation: e.target.value }))}
            placeholder="e.g., New Delhi"
            className="w-full pl-8 pr-2.5 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400 text-sm"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>

      {/* Hotel Preferences */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Hotel Preference
        </label>
        <div className="relative">
          <BsBuilding className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
          <select
            value={details.hotelPreference}
            onChange={(e) => setDetails(prev => ({ ...prev, hotelPreference: e.target.value }))}
            className="w-full pl-8 pr-2.5 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400 text-sm appearance-none"
          >
            <option value="standard">Standard (3-star)</option>
            <option value="superior">Superior (4-star)</option>
            <option value="luxury">Luxury (5-star)</option>
            <option value="budget">Budget</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onHide}
          className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="flex-1 px-3 py-2.5 bg-[#F7E700] text-gray-800 font-medium rounded-lg hover:bg-[#e5d600] transition-colors text-sm"
        >
          Confirm & View Prices
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Main Confirmation Modal */}
      {!isMobile ? (
        <ModalWithBackdrop
          centered
          closeIcon={false}
          backdrop
          show={show}
          onHide={onHide}
          borderRadius="20px"
          paddingX="0"
          paddingY="0"
          width="500px"
        >
          <ModalContent />
        </ModalWithBackdrop>
      ) : (
        <BottomModal
          show={show}
          onHide={onHide}
          width="100%"
          height="max-content"
          paddingX="0"
          paddingY="0"
        >
          <ModalContent />
        </BottomModal>
      )}

      {/* Date Picker Modal */}
      {showDatePicker && (
        !isMobile ? (
          <ModalWithBackdrop
            centered
            closeIcon={false}
            backdrop
            show={showDatePicker}
            onHide={() => setShowDatePicker(false)}
            borderRadius="20px"
            paddingX="0"
            paddingY="0"
            width="400px"
          >
            <SimpleDatePicker
              onSelect={(date) => setDetails(prev => ({ ...prev, startDate: date }))}
              onClose={() => setShowDatePicker(false)}
              currentDate={details.startDate}
            />
          </ModalWithBackdrop>
        ) : (
          <BottomModal
            show={showDatePicker}
            onHide={() => setShowDatePicker(false)}
            width="100%"
            height="max-content"
            paddingX="0"
            paddingY="0"
          >
            <SimpleDatePicker
              onSelect={(date) => setDetails(prev => ({ ...prev, startDate: date }))}
              onClose={() => setShowDatePicker(false)}
              currentDate={details.startDate}
            />
          </BottomModal>
        )
      )}
    </>
  );
};

export default ConfirmationModal;