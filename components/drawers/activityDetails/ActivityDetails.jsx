import React, { useEffect, useRef } from "react";
import { useState } from "react";
import media from "../../media";
import ImageLoader from "../../ImageLoader";
import SkeletonCard from "../../ui/SkeletonCard";
import CheckboxFormComponent from "../../../components/FormComponents/CheckboxFormComponent";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { getHumanDate } from "../../../services/getHumanDate";
import { dateFormat } from "../../../helper/DateUtils";
import { FaStar, FaStarHalfAlt, FaClock } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp, IoMdClose } from "react-icons/io";
import {
  IoFastFood,
  IoTicket,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoLocationOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { MdTransferWithinAStation } from "react-icons/md";
import { BiSolidCustomize } from "react-icons/bi";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Pax } from "./Pax";
import BackArrow from "../../ui/BackArrow";
import Button from "../../../components/ui/button/Index";
import { currencySymbols } from "../../../data/currencySymbols";
const colors = ["#d5f5d3", "#fadadd", "#F5F0FF", "#DDF4C5"];

// ─── Shared presentational helpers ─────────────────────────────────────────
// Section heading used across Inclusions / Exclusions / Starting point etc.
const SectionTitle = ({ children, className = "" }) => (
  <h3 className={`text-[18px] font-bold leading-[26px] text-[#01202B] ${className}`}>
    {children}
  </h3>
);

const Divider = () => <div className="h-px w-full bg-[#ECECEC]" />;

// Bulleted list with an icon glyph. variant: "include" | "exclude" | default dot.
const IconList = ({ items, variant }) => (
  <ul className="flex flex-col gap-2.5">
    {items.map((item, i) => (
      <li
        key={i}
        className="flex items-start gap-2.5 text-[14px] leading-[22px] text-[#4a4a4a]"
      >
        {variant === "include" ? (
          <IoCheckmarkCircle className="mt-[2px] shrink-0 text-[17px] text-[#3BAF75]" />
        ) : variant === "exclude" ? (
          <IoCloseCircle className="mt-[2px] shrink-0 text-[17px] text-[#EE724B]" />
        ) : (
          <span className="mt-[8px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#C2C2C2]" />
        )}
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

// Collapsible section header (General guidelines, Things to bring, …).
const CollapsibleSection = ({ title, open, onToggle, children }) => (
  <div className="flex flex-col">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between py-3.5 text-left"
    >
      <span className="text-[18px] font-bold text-[#01202B]">{title}</span>
      <IoIosArrowDown
        className={`shrink-0 text-[#01202B] transition-transform duration-200 ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>
    {open && <div className="pb-3.5">{children}</div>}
  </div>
);

// Small rounded info pill used for hotel pickup / tour type / guide facts.
const FactPill = ({ icon, children, tone = "neutral" }) => {
  const tones = {
    neutral: "bg-[#F4F5F6] text-[#3a3a3a]",
    green: "bg-[#E9F8EF] text-[#2E9C68]",
    red: "bg-[#FCE9E2] text-[#E0663F]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium ${tones[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
};

export default function ActivityDetails(props) {
  let isPageWide = media("(min-width: 768px)");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFail, setImageFail] = useState(false);
  const [stars, setStars] = useState([]);
  const [inclusiveCost, setInclusiveCost] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [boolDetails, setBoolDetail] = useState({
    generalGuidelines: true,
    thingsToBring: true,
    notSuitableFor: true,
    tipsTricks: true,
    Amenities: true,
  });
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const currency = useSelector((state) => state.currency);
  const itinerary = useSelector((state) => state.Itinerary);
  const isDraft = useSelector((state) => state.Itinerary.status) === "Draft";
  const { finalized_status } = useSelector((state) => state.ItineraryStatus);
  // P1 stage = pre-finalize (PENDING). Treat P1 like Draft for scheduling UI:
  // hide the date picker and time-of-day chips since the itinerary is not
  // yet pinned to specific dates/slots.
  const hideSchedule = isDraft || finalized_status === "PENDING";

  const pad = (n) => (n < 10 ? `0${n}` : n);

  const convertToISODate = (dateStr) => {
    if (!dateStr) return;
    // Already ISO (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS) — return the date portion.
    // The chat-opened flow passes ISO strings through props.date, while the
    // itinerary tree passes DD/MM/YYYY. Tolerating both keeps the day-list
    // dropdown from coming up empty when launched from chat.
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr.slice(0, 10);
    const [day, month, year] = dateStr?.split("/");
    if (!day || !month || !year) return;
    return `${year}-${month?.padStart(2, "0")}-${day?.padStart(2, "0")}`;
  };

  // Resolve effective start date — prefer prop.date, then city check_in,
  // then city start_date, then itinerary-level start_date as last resort, then today.
  // (When opened through chatkitpanel, city-level check_in should win over
  // itinerary.start_date so the default reflects the city the activity belongs to.)
  const resolveEffectiveDate = () => {
    if (props?.date) {
      // Already DD/MM/YYYY — return as-is. Anything else valid (ISO from
      // chat flow, etc.) gets normalized so downstream comparisons against
      // the day-list items (which build DD/MM/YYYY strings) succeed.
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(props.date)) return props.date;
      const d = new Date(props.date);
      if (!isNaN(d.getTime())) {
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
      }
    }
    const cityCheckIn =
      props?.check_in ||
      props?.city?.check_in ||
      props?.city?.checkIn ||
      null;
    if (cityCheckIn) {
      const d = new Date(cityCheckIn);
      if (!isNaN(d.getTime())) {
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
      }
    }
    if (props?.start_date) {
      const d = new Date(props.start_date);
      if (!isNaN(d.getTime())) {
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
      }
    }
    if (props?.city?.start_date) {
      const d = new Date(props.city.start_date);
      if (!isNaN(d.getTime())) {
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
      }
    }
    // Fall back to itinerary-level start_date only if nothing city-specific is available
    if (itinerary?.start_date) {
      const d = new Date(itinerary.start_date);
      if (!isNaN(d.getTime())) {
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
      }
    }
    const today = new Date();
    return `${pad(today.getDate())}/${pad(today.getMonth() + 1)}/${today.getFullYear()}`;
  };

  const effectiveDate = resolveEffectiveDate();

  // Resolve city duration: prop → city object → derived from check_in/check_out
  // → itinerary Redux city lookup → 0. The extra fallbacks cover the chatkitpanel
  // entry point where props.duration / itinerary.cities may not be populated.
  const resolvedCityDuration = (() => {
    const direct = Number(props.duration);
    console.log("Direct duration from props:", direct, direct > 0);
    if (direct > 0) return direct;

    const fromCityObj = Number(
      props?.city?.duration ?? props?.city?.nights ?? props?.cityDuration,
    );
    if (fromCityObj > 0) return fromCityObj;

    const ci = props?.check_in || props?.city?.check_in || props?.city?.checkIn;
    const co = props?.check_out || props?.city?.check_out || props?.city?.checkOut;
    if (ci && co) {
      const d1 = new Date(ci);
      const d2 = new Date(co);
      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
        const diffDays = Math.round(
          (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDays > 0) return diffDays;
      }
    }

    if (props?.itinerary_city_id && itinerary?.cities) {
      const match = itinerary.cities.find(
        (c) => String(c.id) === String(props.itinerary_city_id),
      );
      console.log("Matched itinerary city for duration:", match);
      if (match?.duration > 0) return Number(match.duration);
    }
    return 0;
  })();

  // Total day options available in the dropdown (Day 1..N+1). "N" is the
  // number of nights; the +1 accounts for the checkout day, so a 1-night stay
  // still surfaces two options (arrival + checkout) and a 3-night stay shows
  // four. The picker is always rendered — even a 1-day option is informational.
  const totalDayOptions = Math.max(0, resolvedCityDuration) + 1;

  // Currency-aware number formatting. INR uses Indian grouping (1,23,456);
  // other currencies use international grouping (123,456).
  const formatAmount = (amount) => {
    if (amount == null || isNaN(Number(amount))) return amount;
    const rounded = Math.round(Number(amount));
    const isIndian = !currency?.currency || currency.currency === "INR";
    return isIndian ? getIndianPrice(rounded) : rounded.toLocaleString("en-US");
  };

  const [startDate, setStartDate] = useState(effectiveDate);
  const [showCalender, setShowCalender] = useState(false);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState(null);
  // Desktop and mobile dropdowns are rendered separately — keep distinct
  // refs so the click-outside handler doesn't treat a click on the visible
  // (desktop) dropdown as outside just because a single shared ref points
  // at the hidden mobile sheet.
  const calendarDesktopRef = useRef(null);
  const calendarMobileRef = useRef(null);

  // Bucket availability slots into Morning (06:00–11:59),
  // Afternoon (12:00–15:59), Evening (16:00+). Periods with no slots
  // are hidden — e.g. an activity that only runs in the morning won't
  // render Afternoon/Evening buttons.
  const availableTimePeriods = (() => {
    const slots = props?.data?.availabilities?.slots || [];
    const periods = { Morning: false, Afternoon: false, Evening: false };
    for (const slot of slots) {
      const hour = parseInt((slot?.start_time || "").split(":")[0], 10);
      if (isNaN(hour)) continue;
      if (hour >= 6 && hour < 12) periods.Morning = true;
      else if (hour >= 12 && hour < 16) periods.Afternoon = true;
      else if (hour >= 16) periods.Evening = true;
    }
    return ["Morning", "Afternoon", "Evening"].filter((p) => periods[p]);
  })();

  // Default-select the first available period whenever the slot list
  // changes (e.g. after the activity detail response lands).
  useEffect(() => {
    if (availableTimePeriods.length === 0) {
      setSelectedTimeOfDay(null);
      return;
    }
    if (!selectedTimeOfDay || !availableTimePeriods.includes(selectedTimeOfDay)) {
      setSelectedTimeOfDay(availableTimePeriods[0]);
    }
  }, [props?.data?.availabilities?.slots]);
  const dateBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      const insideDesktop =
        calendarDesktopRef.current &&
        calendarDesktopRef.current.contains(target);
      const insideMobile =
        calendarMobileRef.current &&
        calendarMobileRef.current.contains(target);
      const insideTrigger =
        dateBoxRef.current && dateBoxRef.current.contains(target);
      if (!insideDesktop && !insideMobile && !insideTrigger) {
        setShowCalender(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Compute the selected day number (Day 1..N) from the startDate
  const selectedDayNumber = (() => {
    const cityStartRaw = props?.start_date || props?.date || null;
    const baseDateStr = props?.mercuryItinerary
      ? (cityStartRaw || itinerary?.start_date || null)
      : convertToISODate(cityStartRaw || itinerary?.start_date || null);
    const baseDate = baseDateStr ? new Date(baseDateStr) : null;
    if (!baseDate || isNaN(baseDate.getTime())) return 1;
    const [d, m, y] = (startDate || "").split("/");
    if (!d || !m || !y) return 1;
    const selected = new Date(`${y}-${m}-${d}`);
    if (isNaN(selected.getTime())) return 1;
    const diff = Math.round(
      (selected.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff >= 0 ? diff + 1 : 1;
  })();

  useEffect(() => {
    if (props.data?.prices?.length > 0) {
      setSelectedPackage(props.data.prices[0]);
    }
  }, [props.data?.prices]);

  useEffect(() => {
    if (props.data?.amenities?.length) {
      for (let amenity of props.data.amenities) {
        if (amenity?.included) {
          setInclusiveCost((prev) => [...prev, amenity.name]);
        }
      }
    }

    return () => {
      setInclusiveCost([]);
    };
  }, [props.data]);

  useEffect(() => {
    var stars = [];
    for (let i = 0; i < Math.floor(props.data.rating); i++) {
      stars.push(<FaStar />);
    }

    if (Math.floor(props.data.rating) < props.data.rating)
      stars.push(<FaStarHalfAlt />);

    setStars(stars);
  }, []);

  const handlePaxChange = (newPax) => {
    const updatedFilterState = {
      ...props.filterState,
      adults: newPax.adults,
      children: newPax.children,
      childAges: newPax.childAges || [],
      number_of_travelers: newPax.adults + newPax.children,
      children_ages: [
        ...(newPax.childAges || []),
      ],
    };
    props.setFilterState(updatedFilterState);
    props.fetchData({ _paxOverride: updatedFilterState });
  };

  const handleUpdate = (e) => {
    setLoading(true);
    if (!token) {
      setLoading(false);
      props?.setShowLoginModal(true);
      return;
    }
    const bookingData = {
      ...e,
      result_index: selectedPackage?.result_index,
      date: convertToISODate(startDate) || startDate,
      start_date: convertToISODate(startDate),
      day: selectedDayNumber,
      time: selectedTimeOfDay,
    };

    // Chat-opened flow: route the booking intent up to the orchestrator via
    // a widget action instead of calling the booking API directly. The chat
    // runtime has the session context (itinerary id, dates) the drawer does
    // not, so it's the correct place to actually book.
    if (typeof props?.onAddToItinerary === "function") {
      props.onAddToItinerary({
        activity_id: props?.data?.id,
        itinerary_city_id: props?.itinerary_city_id,
        result_index: selectedPackage?.result_index,
        start_date: convertToISODate(startDate),
        date: convertToISODate(startDate) || startDate,
        day: selectedDayNumber,
        number_of_adults: props?.filterState?.adults,
        number_of_children: props?.filterState?.children,
        children_ages: props?.filterState?.children_ages,
        amenities: (props?.data?.amenities ?? [])
          .filter((a) => a?.included)
          .map((a) => a?.id),
        time: selectedTimeOfDay,
        trace_id: props?.traceId,
      });
      setLoading(false);
      props?.handleCloseDrawer(e);
      return;
    }

    props.updatedActivityBooking(bookingData).then(() => {
      setLoading(false);
      props?.handleCloseDrawer(e);
    });
  };

  const handleAmenityChange = async (index, included) => {
    let amenities = props.data?.amenities.filter(
      (amenity, i) => i !== index && amenity.included
    );

    if (included) {
      amenities.push(props.data?.amenities[index]);
    }

    const res = await props.fetchData({
      amenities: amenities.map((amenity) => amenity?.id),
    });
  };

  // Shared day list content rendered inside both mobile and desktop dropdowns
  const DayListContent = () => (
    <>
      {/* <div className="font-medium text-[14px]">Select Days</div> */}
      {[...Array(Math.max(0, resolvedCityDuration) + 1)].map((_, i) => {
        const cityStartRaw = props?.start_date || props?.date || null;
        const baseDateStr = props?.mercuryItinerary
          ? cityStartRaw || itinerary?.start_date || null
          : convertToISODate(
              cityStartRaw || itinerary?.start_date || null,
            );

        const baseDate = new Date(baseDateStr);
        if (isNaN(baseDate.getTime())) return null;

        const currentDate = new Date(baseDate);
        currentDate.setDate(currentDate.getDate() + i);

        const year = currentDate.getFullYear();
        const month = pad(currentDate.getMonth() + 1);
        const day = pad(currentDate.getDate());
        const dateString = `${day}/${month}/${year}`;
        const displayDate = getHumanDate(dateString);

        return (
          <div
            key={i}
            className={`cursor-pointer ${
              startDate === dateString ? "text-black font-semibold" : "text-[#4a4a4a]"
            }`}
            onClick={() => {
              if (dateString === startDate) {
                setShowCalender(false);
                return;
              }
              setStartDate(dateString);
              setShowCalender(false);
              props.fetchData({
                _dateOverride: dateString,
                ...(selectedTimeOfDay && { _timeOverride: selectedTimeOfDay }),
              });
            }}
          >
            <span className="font-bold text-[14px]">
              {displayDate + " | "}
            </span>
            <span>Day {i + 1}</span>
          </div>
        );
      })}
    </>
  );

  return (
    <div className="h-[100vh] overflow-y-auto bg-white">
      {/* Sticky header — back action stays reachable while scrolling */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#F0F0F0] bg-white/95 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={(e) => props.handleCloseDrawer(e)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#F4F4F4]"
        >
          <Image
            src="/backarrow.svg"
            alt="back"
            className="cursor-pointer"
            width={20}
            height={2}
          />
        </button>
        <span className="truncate text-[15px] font-semibold text-[#01202B]">
          Activity details
        </span>
      </div>

      {props.updateAmenities && (
        <div className="fixed top-[65%] left-[50%] -translate-x-[50%] z-50 flex flex-row items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg">
          Updating
          <div className="w-5 h-5 border-2 rounded-full border-t-black animate-spin"></div>
        </div>
      )}

      <div className="px-4 pt-4 pb-[140px]">
        <div
          className={`flex flex-col gap-5 ${
            props.updateAmenities && "opacity-50"
          }`}
        >
          <div className="relative h-[200px] md:h-[320px] w-full overflow-hidden rounded-2xl">
            <div
              className="h-full w-full"
              style={{ display: imageLoaded ? "block" : "none" }}
            >
              <ImageLoader
                borderRadius="16px"
                marginTop="0"
                widthMobile="100%"
                width="100%"
                height="100%"
                url={
                  props.data?.image && !imageFail
                    ? props.data.image
                    : "media/icons/bookings/notfounds/noroom.png"
                }
                dimensionsMobile={{ width: 500, height: 295 }}
                dimensions={{ width: 468, height: 295 }}
                onload={() => {
                  setTimeout(() => {
                    setImageLoaded(true);
                  }, 1000);
                }}
                onfail={() => {
                  setImageFail(true);
                  setImageLoaded(true);
                }}
                noLazy
              ></ImageLoader>

              {/* gradient scrim keeps the bottom badge legible over any image */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />

              {props.data?.is_very_popular ? (
                <div className="absolute bottom-3 right-3 bg-[#FFD201] text-[#01202B] px-3 py-1 rounded-full flex flex-row items-center gap-1 text-[13px] font-semibold shadow-sm">
                  <FaStar size={12} />
                  Very Popular
                </div>
              ) : null}

              {props.data?.ideal_duration_number ? (
                <div className="absolute bottom-3 left-3 bg-black/55 text-white px-3 py-1.5 rounded-full flex flex-row items-center gap-1.5 backdrop-blur">
                  <IoTimeOutline size={14} />
                  <div className="text-[13px]">
                    {props.data.ideal_duration_number}{" "}
                    {props.data.ideal_duration_number > 1
                      ? props.data?.ideal_duration_unit?.toLowerCase()
                      : props.data?.ideal_duration_unit
                          ?.toLowerCase()
                          ?.slice(0, -1)}
                  </div>
                </div>
              ) : null}
            </div>

            <div
              style={{
                display: !imageLoaded ? "block" : "none",
              }}
            >
              <SkeletonCard
                width={"100%"}
                height={isPageWide ? "320px" : "200px"}
              />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h1 className="text-[22px] font-bold leading-[28px] text-[#01202B]">
                {props.data?.display_name || props.data.name}
              </h1>
              {props.data?.one_liner_description && (
                <p className="text-[14px] leading-[20px] text-[#7a7a7a]">
                  {props.data.one_liner_description}
                </p>
              )}

              {props?.data?.rating && (
                <div className="mt-1 flex items-center gap-1.5">
                  <div className="flex flex-row gap-0.5 text-[#FFD201]">
                    {stars}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[12px] text-[#7a7a7a]">
                      {props.data.rating}
                    </span>
                    {props.data?.user_ratings_total > 0 && (
                      <u className="text-[12px] text-[#7a7a7a]">
                        · {props.data.user_ratings_total} user reviews
                      </u>
                    )}
                  </div>
                </div>
              )}

              {props.data?.distance_from_city_centre != null &&
                props.data?.distance_from_city_centre !== "" && (
                  <div className="mt-1.5 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#FFF6E0] px-3 py-1 text-[12px] font-semibold text-[#01202B]">
                    <IoLocationOutline className="text-[13px] text-[#E0A100]" />
                    {Number(props.data.distance_from_city_centre).toFixed(1)} km
                    from city centre
                  </div>
                )}
            </div>

            {/* Timing on the left end, Travellers on the right end. With
                justify-between a lone control naturally falls back to the
                left end (only one flex child → starts at flex-start). */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              {!hideSchedule &&
                (props?.fromChat || availableTimePeriods.length > 0) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {/* FIX: wrap trigger + dropdown in a relative container so
                        the desktop dropdown can be positioned with absolute
                        top-full. Always rendered — a 1-night stay still has 2
                        options (arrival + checkout), and even a single-day
                        option is informational. */}
                    {props?.fromChat && (
                      <div className="relative">
                        <div
                          ref={dateBoxRef}
                          className="flex items-center w-auto bg-[#F7F7F7] py-[0.7rem] px-4 rounded-lg justify-between cursor-pointer gap-2"
                          onClick={() => setShowCalender((prev) => !prev)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[14px]">
                              {getHumanDate(startDate) + " | "}
                            </span>
                            <span className="text-[14px]">
                              Day {selectedDayNumber}
                            </span>
                          </div>
                          <IoIosArrowDown
                            className={`transition-transform ml-2 ${
                              showCalender ? "rotate-180" : ""
                            }`}
                          />
                        </div>

                        {showCalender && (
                          <div
                            ref={calendarDesktopRef}
                            className="max-ph:hidden md:flex md:flex-col absolute top-full left-0 mt-1 w-[260px] bg-white border border-gray-200 shadow-lg rounded-lg p-4 gap-3 text-sm z-[1091] max-h-[300px] overflow-y-auto"
                          >
                            <DayListContent />
                          </div>
                        )}
                      </div>
                    )}

                    {availableTimePeriods.length > 0 && (
                      <div className="inline-flex w-fit bg-[#F7F7F7] rounded-lg p-1 gap-1">
                        {availableTimePeriods.map((period) => {
                          const isSelected = selectedTimeOfDay === period;
                          return (
                            <button
                              key={period}
                              type="button"
                              onClick={() => {
                                if (period === selectedTimeOfDay) return;
                                setSelectedTimeOfDay(period);
                                props.fetchData({
                                  _dateOverride: startDate,
                                  _timeOverride: period,
                                });
                              }}
                              className={`flex-none px-4 py-2 rounded-md text-[14px] font-medium transition-colors ${
                                isSelected
                                  ? "bg-[#07213A] text-white"
                                  : "bg-transparent text-[#7a7a7a] hover:text-[#01202B]"
                              }`}
                            >
                              {period}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

              {!isDraft && (
                <Pax
                  pax={{
                    ...props?.filterState,
                    childAges: props?.filterState?.childAges || [],
                  }}
                  setPax={handlePaxChange}
                />
              )}
            </div>

            {(props.data?.category ||
              (props.data?.tags && props.data?.tags?.length > 0)) && (
              <div className="flex flex-row items-center gap-2 flex-wrap">
                {props.data?.category && (
                  <span className="rounded-full px-3 py-1.5 text-[12px] font-medium bg-[#01202B] text-white">
                    {props.data.category}
                  </span>
                )}
                {props.data.tags?.map((e, i) => (
                  <span
                    key={i}
                    className="rounded-full px-3 py-1.5 text-[12px] font-medium text-[#01202B]"
                    style={{ backgroundColor: colors[i % colors.length] }}
                  >
                    {e}
                  </span>
                ))}
              </div>
            )}

            {props.data?.short_description && (
              <p className="text-[14px] leading-[22px] text-[#3a3a3a]">
                {props.data.short_description}
              </p>
            )}

            {props.data?.inclusions && props.data?.inclusions?.length > 0 && (
              <section className="flex flex-col gap-3">
                <SectionTitle className="!text-[#2E9C68]">Inclusions</SectionTitle>
                <Divider />
                <IconList items={props.data.inclusions} variant="include" />
              </section>
            )}

            {props.data?.exclusions && props.data?.exclusions?.length > 0 && (
              <section className="flex flex-col gap-3">
                <SectionTitle className="!text-[#E0663F]">Exclusions</SectionTitle>
                <Divider />
                <IconList items={props.data.exclusions} variant="exclude" />
              </section>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {props?.hotel_pickup_included ? (
              <FactPill
                tone="green"
                icon={
                  <Image
                    src="/hotelPickupIncluded.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                }
              >
                Hotel Pickup Included
              </FactPill>
            ) : (
              <FactPill
                tone="red"
                icon={
                  <Image
                    src="/notHotelPickupIncluded.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                }
              >
                Hotel pickup not included
              </FactPill>
            )}

            {props?.data?.animal_welfare_check && (
              <FactPill tone="green">Follows animal-welfare guidelines</FactPill>
            )}

            {props?.data?.tour_type === "Private Tour" && (
              <FactPill icon={<Image src="/privateTour.svg" alt="" width={16} height={16} />}>
                Private Tour
              </FactPill>
            )}
            {props?.data?.tour_type === "Shared Tour" && (
              <FactPill icon={<Image src="/sharedTour.svg" alt="" width={16} height={16} />}>
                Shared Tour
              </FactPill>
            )}
            {props?.data?.guide === "Guided" && (
              <FactPill icon={<Image src="/guided.svg" alt="" width={16} height={16} />}>
                Guided
              </FactPill>
            )}
            {props?.data?.guide === "Self Guided" && (
              <FactPill icon={<Image src="/selfGuided.svg" alt="" width={16} height={16} />}>
                Self Guided
              </FactPill>
            )}
            {props?.data?.guide === "Semi Guided" && (
              <FactPill icon={<Image src="/semiGuided.svg" alt="" width={16} height={16} />}>
                Semi Guided
              </FactPill>
            )}
          </div>

          {(props.data?.starting_point ||
            (Array.isArray(props.data?.other_starting_points) &&
              props.data?.other_starting_points.length > 0)) && (
            <section className="flex flex-col gap-3">
              <SectionTitle>Starting point</SectionTitle>
              <Divider />
              {props.data?.starting_point && (
                <div className="flex items-start gap-2 text-[14px] text-[#01202B]">
                  <IoLocationOutline className="mt-[2px] shrink-0 text-[17px] text-[#01202B]" />
                  <span>{props.data.starting_point}</span>
                </div>
              )}
              {Array.isArray(props.data?.other_starting_points) &&
                props.data?.other_starting_points.length > 0 && (
                  <div className="text-[14px]">
                    <div className="text-[#7a7a7a] mb-2">
                      Other starting points
                    </div>
                    <IconList
                      items={props.data.other_starting_points.map(
                        (point) =>
                          point?.address || point?.name || String(point),
                      )}
                    />
                  </div>
                )}
            </section>
          )}

          {(props.data?.general_guidelines?.length ||
            props.data?.things_to_bring?.length ||
            props.data?.not_suitable_for?.length ||
            props.data?.tips_tricks?.length) ? (
            <div className="flex flex-col divide-y divide-[#ECECEC] border-y border-[#ECECEC]">
              {props.data?.general_guidelines?.length ? (
                <CollapsibleSection
                  title="General guidelines"
                  open={boolDetails?.generalGuidelines}
                  onToggle={() =>
                    setBoolDetail((prev) => ({
                      ...prev,
                      generalGuidelines: !prev.generalGuidelines,
                    }))
                  }
                >
                  <IconList items={props.data.general_guidelines} />
                </CollapsibleSection>
              ) : null}

              {props.data?.things_to_bring?.length ? (
                <CollapsibleSection
                  title="Things to bring"
                  open={boolDetails?.thingsToBring}
                  onToggle={() =>
                    setBoolDetail((prev) => ({
                      ...prev,
                      thingsToBring: !prev.thingsToBring,
                    }))
                  }
                >
                  <IconList items={props.data.things_to_bring} />
                </CollapsibleSection>
              ) : null}

              {props.data?.not_suitable_for?.length ? (
                <CollapsibleSection
                  title="Not suitable for"
                  open={boolDetails?.notSuitableFor}
                  onToggle={() =>
                    setBoolDetail((prev) => ({
                      ...prev,
                      notSuitableFor: !prev.notSuitableFor,
                    }))
                  }
                >
                  <IconList items={props.data.not_suitable_for} />
                </CollapsibleSection>
              ) : null}

              {props.data?.tips_tricks?.length ? (
                <CollapsibleSection
                  title="Tips, Tricks and Cautions"
                  open={boolDetails?.tipsTricks}
                  onToggle={() =>
                    setBoolDetail((prev) => ({
                      ...prev,
                      tipsTricks: !prev.tipsTricks,
                    }))
                  }
                >
                  <IconList items={props.data.tips_tricks} />
                </CollapsibleSection>
              ) : null}
            </div>
          ) : null}

          {props.data?.amenities && props.data?.amenities?.length ? (
            <section className="flex flex-col gap-3">
              <SectionTitle>Add-Ons</SectionTitle>
              <Divider />
              <div className="flex flex-col gap-2">
                {props.data.amenities.map((amenity, index) => (
                  <Amenity
                    key={index}
                    index={index}
                    amenity={amenity}
                    handleAmenityChange={handleAmenityChange}
                    travelers={props.filterState?.number_of_travelers}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {!isDraft && props?.data?.prices && props?.data?.prices?.length ? (
            <section className="flex flex-col gap-3">
              <SectionTitle>Package Options</SectionTitle>
              <Divider />

              <div className="flex flex-col gap-3 w-full">
                {props.data.prices.map((packageItem) => {
                  const isSel =
                    selectedPackage?.result_index === packageItem.result_index;
                  return (
                    <div
                      key={packageItem.result_index}
                      className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                        isSel
                          ? "border-[#FFD201] bg-[#FFFBEB]"
                          : "border-[#ECECEC] bg-white hover:border-[#D5D5D5]"
                      }`}
                      onClick={() => setSelectedPackage(packageItem)}
                    >
                      <div className="flex items-start justify-between w-full gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                              isSel
                                ? "border-[#FFD201] bg-[#FFD201]"
                                : "border-gray-300"
                            }`}
                          >
                            {isSel && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            {props.data?.is_package && packageItem?.title ? (
                              <div className="font-medium text-[#01202B]">
                                {packageItem.title}
                              </div>
                            ) : null}
                            {props.data?.is_package &&
                            packageItem?.description ? (
                              <div className="text-sm text-gray-600">
                                {packageItem.description}
                              </div>
                            ) : null}
                            {packageItem.pax_details?.adults ? (
                              <div className="text-sm text-gray-600">
                                For{" "}
                                {packageItem.pax_details.adults +
                                  packageItem.pax_details.children}{" "}
                                people
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="text-right text-[18px] font-bold text-[#01202B]">
                          {`${
                            currency?.currency
                              ? currencySymbols?.[currency?.currency]
                              : "₹"
                          }`}
                          {formatAmount(packageItem.total_price)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>

        {props?.data?.cancellation_policies && (
          <section className="mt-5 flex flex-col gap-3">
            <SectionTitle>Cancellation Policies</SectionTitle>
            <Divider />
            <div
              dangerouslySetInnerHTML={{
                __html: props?.data?.cancellation_policies,
              }}
              className="flex flex-col gap-1 text-sm text-[#4a4a4a] ml-4"
            ></div>
          </section>
        )}
      </div>

      {/* Mobile bottom sheet — hidden on md+ screens */}
      {/* {showCalender && (
        <div
          className="fixed bottom-0 left-0 right-0 w-full bg-white shadow-2xl drop-shadow-3xl p-[16px] rounded-t-xl space-y-5 text-sm z-[1091] max-h-[60vh] overflow-y-auto md:hidden"
          ref={calendarMobileRef}
        >
          <DayListContent />
        </div>
      )} */}

      {(!isDraft || typeof props?.onAddToItinerary === "function") && (
        // z-[9] keeps the bar above page content but BELOW the Travellers
        // modal: the shared Pax wrapper is `relative z-[10]`, which traps its
        // BottomModal in a z-10 stacking context. Any bar z-index >= 10 paints
        // over that whole subtree (modal included). Staying under 10 lets the
        // modal cover the bar when open; they never overlap while it's closed.
        <div className="scroll-none fixed bottom-0 right-0 left-0 z-[9] border-t border-[#ECECEC] bg-white px-5 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-col">
              {selectedPackage?.total_price ? (
                <span className="text-[24px] font-extrabold leading-none text-[#01202B]">
                  {`${
                    currency?.currency
                      ? currencySymbols?.[currency?.currency]
                      : "₹"
                  }`}
                  {selectedPackage?.total_price &&
                  selectedPackage?.total_price > 0
                    ? formatAmount(selectedPackage.total_price)
                    : selectedPackage.total_price}
                </span>
              ) : null}
              <span className="mt-1 truncate text-[12px] text-[#8a8a8a]">
                for{" "}
                {(props?.filterState.adults + props?.filterState?.children) ||
                  (itinerary?.number_of_adults +
                    itinerary?.number_of_children)}{" "}
                people · on {getHumanDate(startDate) || dateFormat(props?.date)}
              </span>
            </div>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="ttw-btn-fill-yellow shrink-0 !rounded-xl !px-6 !py-3 !text-[15px] disabled:opacity-60"
            >
              {loading ? "Adding…" : "Add to Itinerary"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export const Amenity = ({ index, amenity, handleAmenityChange, travelers }) => {
  const [included, setIncluded] = useState(amenity?.included);
  const [isHovered, setIsHovered] = useState(false);
  const currency = useSelector((state) => state.currency);
  const popupStyle = {
    display: isHovered ? "block" : "none",
    backgroundColor: "#2b2b2a",
    border: "1px solid #e5e7eb",
    borderRadius: "0.45rem",
    padding: "5px 10px",
    marginTop: "5px",
    marginLeft: "5px",
  };

  useEffect(() => {
    setIncluded(amenity?.included);
  }, [amenity]);

  const getAmenityIcon = (type) => {
    switch (type) {
      case "Guide":
        return <FaPerson />;
      case "Transportation":
        return <MdTransferWithinAStation />;
      case "Meal":
        return <IoFastFood />;
      case "Entry Ticket":
        return <IoTicket />;
      default:
        return <BiSolidCustomize />;
    }
  };

  const handleSelect = () => {
    handleAmenityChange(index, !included);
    setIncluded((prev) => !prev);
  };

  return (
    <div
      key={index}
      className="relative rounded-xl border border-[#ECECEC] bg-[#FAFAFA] p-4"
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 shrink-0 text-[18px] text-[#01202B]">
          {getAmenityIcon(amenity.type)}
        </span>
        <div className="flex flex-col gap-1">
          <div className="text-[15px] font-semibold text-[#01202B]">
            {amenity.name}
          </div>
          {amenity.description && (
            <div className="text-[13px] leading-[18px] text-[#6a6a6a]">
              {amenity.description}
            </div>
          )}
          {travelers ? (
            <div className="mt-0.5 flex items-center gap-1 text-[12px] font-medium text-[#3a3a3a]">
              <Image src="/ticket.svg" alt="ticket" width={13.33} height={10.67} />
              {travelers} tickets
            </div>
          ) : null}
        </div>
      </div>

      {amenity.price == 0 ? (
        <div className="mt-3 text-[15px] font-semibold text-[#277004]">
          Included for free
        </div>
      ) : (
        <div className="mt-3 flex items-end justify-between">
          <div className="font-bold text-[20px] text-[#01202B]">
            {`${
              currency?.currency ? currencySymbols?.[currency?.currency] : "₹"
            }`}
            {(() => {
              const rounded = Math.round(Number(amenity.price));
              const isIndian = !currency?.currency || currency.currency === "INR";
              return isIndian
                ? getIndianPrice(rounded)
                : rounded.toLocaleString("en-US");
            })()}{" "}
            <span className="text-[13px] font-normal text-[#6a6a6a]">
              per person*
            </span>
          </div>

          <div
            className="relative flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              disabled={amenity.mandatory}
              onClick={handleSelect}
              className="flex flex-row items-center gap-1 cursor-pointer"
            >
              <CheckboxFormComponent checked={included} />
            </button>

            {amenity.mandatory && (
              <div
                style={popupStyle}
                className="z-[1600] absolute -right-3 top-full mt-2  text-sm text-center flex flex-col gap-2"
              >
                <div className="relative">
                  <span className="absolute -top-5 right-0  w-0 h-0 border-[10px] border-solid border-transparent border-b-red"></span>
                  <span className="absolute -top-[21px] -right-0 w-0 h-0 border-[10px] border-solid border-transparent border-b-[#2b2b2a]"></span>
                  <div className="text-nowrap font-normal text-white text-sm bg-[#2b2b2a] px-2 py-1 rounded">
                    This add on cannot be removed
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};