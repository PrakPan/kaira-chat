import React, { useEffect, useRef } from "react";
import { useState } from "react";
import media from "../../media";
import SkeletonCard from "../../ui/SkeletonCard";
import CheckboxFormComponent from "../../../components/FormComponents/CheckboxFormComponent";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { dateFormat } from "../../../helper/DateUtils";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoFastFood, IoTicket } from "react-icons/io5";
import { MdTransferWithinAStation } from "react-icons/md";
import { BiSolidCustomize } from "react-icons/bi";
import Image from "next/image";
import { useSelector } from "react-redux";
import BackArrow from "../../ui/BackArrow";
import styled from "styled-components";
import ReviewPoi from "../../../components/POIDetails/Reviews";
import { MERCURY_HOST } from "../../../services/constants";
import Button from "../../../components/ui/button/Index";
import { useRouter } from "next/router";
import { getHumanDate } from "../../../services/getHumanDate";

export const Title = styled.p`
  /* H3 token · 22/1.15/800/-0.02em */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: #0b1220;
`;

export const Reviews = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  p,
  u {
    /* Caption · 12/1.4/600/0.04em */
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    line-height: 1.4;
    color: #8a93a6;
  }
  u {
    margin-inline: 0.2rem;
  }
`;

export const Text = styled.p`
  /* Body · 14.5/1.55/400 */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14.5px;
  font-weight: 400;
  line-height: 1.55;
  color: #445069;
`;

export const Heading = styled.p`
  /* H4 token · 17/1.2/700/-0.015em */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.2;
  color: #0b1220;
`;

const GridImage = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(4, 0.4fr);
  grid-column-gap: 6px;
  grid-row-gap: 6px;
  height: 19rem;
`;

const Child = styled.div`
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  grid-area: ${(props) => props.area};
  ${(props) => props.className && `class="${props.className}"`};
`;
const ScrollContainer = styled.div`
  display: flex;
  gap: 21px;
  height: 210px;
  overflow-x: auto;
  overflow-y: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  // const Heading = styled.div
`;

const colors = ["#e7f5ee", "#fff1ee", "#eef2fb", "#f0e9d6"];

export default function PoiDetails(props) {
  const isSmallScreen = media("(max-width:586px)");
  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
  const [stars, setStars] = useState([]);
  const [inclusiveCost, setInclusiveCost] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [boolDetails, setBoolDetail] = useState({
    generalGuidelines: true,
    thingsToBring: true,
    notSuitableFor: true,
    tipsTricks: true,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const itinerary = useSelector((state) => state.Itinerary);
  const isDraft = useSelector((state) => state.Itinerary.status) === "Draft";
  const { finalized_status } = useSelector(
    (state) => state.ItineraryStatus || {},
  );
  // P1 stage = pre-finalize (PENDING). Treat the same as Draft — no
  // committed dates, so the picker is informational.
  const hideSchedule = isDraft || finalized_status === "PENDING";

  // ── Day picker + time-of-day chips ────────────────────────────────────
  // Mirrors ActivityDetails.jsx so POI / restaurant / activity drawers
  // share the same scheduling UX. Static slots (Morning / Afternoon /
  // Evening) — POI/restaurant data has no availability windows.
  const TIME_PERIODS = ["Morning", "Afternoon", "Evening"];
  const pad = (n) => (n < 10 ? `0${n}` : n);

  const convertToISODate = (dateStr) => {
    if (!dateStr) return;
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr.slice(0, 10);
    const [day, month, year] = dateStr.split("/");
    if (!day || !month || !year) return;
    return `${year}-${month?.padStart(2, "0")}-${day?.padStart(2, "0")}`;
  };

  const resolveEffectiveDate = () => {
    if (props?.date) {
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(props.date)) return props.date;
      const d = new Date(props.date);
      if (!isNaN(d.getTime())) {
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
      }
    }
    if (itinerary?.start_date) {
      const d = new Date(itinerary.start_date);
      if (!isNaN(d.getTime())) {
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
      }
    }
    const today = new Date();
    return `${pad(today.getDate())}/${pad(today.getMonth() + 1)}/${today.getFullYear()}`;
  };

  const resolvedCityDuration = (() => {
    const direct = Number(props?.duration);
    if (direct > 0) return direct;
    if (props?.itinerary_city_id && itinerary?.cities) {
      const match = itinerary.cities.find(
        (c) => String(c.id) === String(props.itinerary_city_id),
      );
      if (match?.duration > 0) return Number(match.duration);
    }
    return 0;
  })();

  const [startDate, setStartDate] = useState(resolveEffectiveDate());
  const [showCalender, setShowCalender] = useState(false);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState("Morning");
  const calendarDesktopRef = useRef(null);
  const dateBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      const insideDesktop =
        calendarDesktopRef.current &&
        calendarDesktopRef.current.contains(target);
      const insideTrigger =
        dateBoxRef.current && dateBoxRef.current.contains(target);
      if (!insideDesktop && !insideTrigger) {
        setShowCalender(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDayNumber = (() => {
    const cityStartRaw = props?.start_date || props?.date || null;
    const baseDateStr = convertToISODate(
      cityStartRaw || itinerary?.start_date || null,
    );
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

  const DayListContent = () => (
    <>
      {[...Array(Math.max(0, resolvedCityDuration) + 1)].map((_, i) => {
        const cityStartRaw = props?.start_date || props?.date || null;
        const baseDateStr = convertToISODate(
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
 startDate === dateString
 ? "text-[#0b1220] font-semibold"
 : "text-[#445069]"
 }`}
            onClick={() => {
              setStartDate(dateString);
              setShowCalender(false);
            }}
          >
            <span className="font-bold ttw-type-body">
              {displayDate + " | "}
            </span>
            <span>Day {i + 1}</span>
          </div>
        );
      })}
    </>
  );

  const [ImagesLoaded, setImagesLoaded] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  const [ImagesError, setImagesError] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  function OnImageLoad(i) {
    if (!ImagesLoaded[i]) {
      setTimeout(
        () =>
          setImagesLoaded((prev) => {
            return { ...prev, [i]: true };
          }),
        1000
      );
    }
  }

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

  const handleUpdate = (e) => {
    setLoading(true);
    if (!token) {
      props.setShowLoginModal(true);
      setLoading(false);
      return;
    }
    // Pass the picker selections (start_date, day, time) up so the booking
    // POST carries the slot the user actually chose. Keeps backward
    // compatibility with parents that ignore the argument.
    props
      .updatedActivityBooking({
        start_date: convertToISODate(startDate),
        date: convertToISODate(startDate) || props?.date,
        day: selectedDayNumber,
        time: selectedTimeOfDay,
      })
      .then((res) => {
      setLoading(false);
      props?.trackPoiBookingAdded(router?.query?.id, props?.data?.id, "itinerary_poi_list");
      if (res != 0) {
        props?.setShowDrawer(false);
        props?.handleCloseDrawer(e);
      }
    });
  };
  function OnImageError(i) {
    if (!ImagesError[i]) {
      setImagesError((prev) => {
        return { ...prev, [i]: true };
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-[100px] h-[100vh] overflow-y-auto bg-[#fafaf5] font-sans text-[#0b1220]">
      <div className="flex flex-col gap-4 px-[20px] pb-4">

        <div className="mt-xl">
          <Image src="/backarrow.svg" className="cursor-pointer" width={22} height={2} onClick={(e) => props.handleCloseDrawer(e)} />
        </div>
        <div className={`flex flex-col gap-4 `}>
          <>
            {props?.data?.extra_images?.length > 3 ? (
              <GridImage>
                <Child area="1 / 1 / 5 / 4" className="div1">
                  <Image
                    src={
                      props?.data?.extra_images?.[0]
                        ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[0]?.photo_reference}`
                        : "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                    }
                    alt="Image 0"
                    fill
                    className="object-cover"
                    onLoad={() => OnImageLoad(0)}
                    onError={(e) => {
                      e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                      OnImageError(0);
                    }}
                    priority
                  />
                  <div
                    style={{
                      display: !ImagesLoaded[0] ? "initial" : "none",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <SkeletonCard lottieDimension="50rem" />
                  </div>
                </Child>

                <Child area="1 / 8 / 5 / 11" className="div2 rounded-lg">
                  <Image
                    src={
                      props?.data?.extra_images?.[1]
                        ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[1]?.photo_reference}`
                        : "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                    }
                    alt="Image 1"
                    fill
                    className="object-cover"
                    onLoad={() => OnImageLoad(1)}
                    onError={(e) => {
                      e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                      OnImageError(1);
                    }}
                    priority
                  />{" "}
                  <div
                    style={{
                      display: !ImagesLoaded[1] ? "initial" : "none",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <SkeletonCard lottieDimension="50rem" />
                  </div>
                </Child>

                <Child area="1 / 4 / 3 / 8" className="div3">
                  <Image
                    src={
                      props?.data?.extra_images?.[2]
                        ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[2]?.photo_reference}`
                        : "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                    }
                    alt="Image 2"
                    fill
                    className="object-cover"
                    onLoad={() => OnImageLoad(2)}
                    onError={(e) => {
                      e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                      OnImageError(2);
                    }}
                    priority
                  />
                  <div
                    style={{
                      display: !ImagesLoaded[2] ? "initial" : "none",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <SkeletonCard lottieDimension="50rem" />
                  </div>
                </Child>

                <Child area="3 / 4 / 5 / 8" className="div4">
                  <Image
                    src={
                      props?.data?.extra_images?.[3]
                        ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[3]?.photo_reference}`
                        : "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                    }
                    alt="Image 3"
                    fill
                    className="object-cover"
                    onLoad={() => OnImageLoad(3)}
                    onError={(e) => {
                      e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                      OnImageError(3);
                    }}
                    priority
                  />
                  <div
                    style={{
                      display: !ImagesLoaded[3] ? "initial" : "none",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <SkeletonCard lottieDimension="50rem" />
                  </div>
                </Child>
              </GridImage>
            ) : props?.data?.extra_images?.length == 3 ? (
              <>
                <GridImage>
                  <Child area="1 / 1 / 5 / 4" className="div1 ">
                    <Image
                      src={
                        props?.data?.extra_images?.[0]
                          ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[0]?.photo_reference}`
                          : "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                      }
                      alt="Image 0"
                      fill
                      className="object-cover"
                      onLoad={() => OnImageLoad(0)}
                      onError={(e) => {
                        e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                        OnImageError(0);
                      }}
                      priority
                    />
                    <div
                      style={{
                        display: !ImagesLoaded[0] ? "initial" : "none",
                        height: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <SkeletonCard lottieDimension={"50rem"} />
                    </div>
                  </Child>

                  <Child area=" 1 / 4 / 5 / 7" className="div2 rounded-lg">
                    <Image
                      src={
                        props?.data?.extra_images?.[1]
                          ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[1]?.photo_reference}`
                          : "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                      }
                      alt="Image 0"
                      fill
                      className="object-cover"
                      onLoad={() => OnImageLoad(1)}
                      onError={(e) => {
                        e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                        OnImageError(1);
                      }}
                      priority
                    />
                    <div
                      style={{
                        display: !ImagesLoaded[1] ? "initial" : "none",
                        height: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <SkeletonCard lottieDimension={"50rem"} />
                    </div>
                  </Child>

                  <Child area="1 / 7 / 5 / 11" className="div3">
                    <Image
                      src={
                        props?.data?.extra_images?.[2]
                          ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[2]?.photo_reference}`
                          : "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                      }
                      alt="Image 0"
                      fill
                      className="object-cover"
                      onLoad={() => OnImageLoad(2)}
                      onError={(e) => {
                        e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                        OnImageError(2);
                      }}
                      priority
                    />
                    <div
                      style={{
                        display: !ImagesLoaded[2] ? "initial" : "none",
                        height: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <SkeletonCard lottieDimension={"50rem"} />
                    </div>
                  </Child>
                </GridImage>
              </>
            ) : props?.data?.extra_images?.length == 2 ? (
              <GridImage>
                <Child area="1 / 1 / 5 / 6" className="div1 ">
                  <Image
                    src={
                      props?.data?.extra_images?.[0]
                        ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[0]?.photo_reference}`
                        : "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                    }
                    alt="Image 0"
                    fill
                    className="object-cover"
                    onLoad={() => OnImageLoad(0)}
                    onError={(e) => {
                      e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                      OnImageError(0);
                    }}
                    priority
                  />
                  <div
                    style={{
                      display: !ImagesLoaded[0] ? "initial" : "none",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <SkeletonCard lottieDimension={"50rem"} />
                  </div>
                </Child>

                <Child area="1 / 6 / 5 / 11" className="div2 rounded-lg">
                  <Image
                    src={
                      props?.data?.extra_images?.[1]
                        ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[1]?.photo_reference}`
                        : "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                    }
                    alt="Image 0"
                    fill
                    className="object-cover"
                    onLoad={() => OnImageLoad(1)}
                    onError={(e) => {
                      e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                      OnImageError(1);
                    }}
                    priority
                  />
                  <div
                    style={{
                      display: !ImagesLoaded[1] ? "initial" : "none",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <SkeletonCard lottieDimension={"50rem"} />
                  </div>
                </Child>
              </GridImage>
            ) : (
              <Child style={{ height: "19rem" }}>
                <Image
                  src={
                    props?.data?.extra_images?.[0]
                      ? `${MERCURY_HOST}/api/v1/geos/photo/${props?.data?.extra_images?.[0]?.photo_reference}`
                      : "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"
                  }
                  alt="Image 0"
                  fill
                  className="object-cover"
                  onLoad={() => OnImageLoad(0)}
                  onError={(e) => {
                    e.currentTarget.src = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
                    OnImageError(0);
                  }}
                  priority
                />
                <div
                  style={{
                    display: !ImagesLoaded[0] ? "initial" : "none",
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <SkeletonCard lottieDimension={"50rem"} />
                </div>
              </Child>
            )}
          </>
          <div className="flex flex-col gap-3">
            <div className="ttw-type-h4 leading-xl-sm font-600 mb-0 text-[#0b1220]">{props.data.name}</div>

            {/* Day picker + Morning/Afternoon/Evening chips. Hidden in
                Draft / P1 stage where the itinerary isn't pinned to dates. */}
            {!hideSchedule && (
              <div className="flex flex-col gap-3">
                {/* <div className="flex gap-2">
                  <div className="relative">
                    <div
                      ref={dateBoxRef}
                      className="flex items-center w-auto bg-[#F9F9F9] py-[0.7rem] px-4 rounded-lg justify-between cursor-pointer"
                      onClick={() => setShowCalender((prev) => !prev)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium ttw-type-body">
                          {getHumanDate(startDate) + " | "}
                        </span>
                        <span>Day {selectedDayNumber}</span>
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
                        className="absolute top-full left-0 mt-1 w-[260px] bg-white border border-gray-200 shadow-lg rounded-lg p-4 flex flex-col gap-3 ttw-type-body z-[1091] max-h-[300px] overflow-y-auto"
                      >
                        <DayListContent />
                      </div>
                    )}
                  </div>
                </div> */}

                <div className="inline-flex w-fit sm:w-fit bg-[#f4f3ec] rounded-lg p-1 gap-1">
                  {TIME_PERIODS.map((period) => {
                    const isSelected = selectedTimeOfDay === period;
                    return (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setSelectedTimeOfDay(period)}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-md ttw-type-body font-medium transition-colors ${
 isSelected
 ? "bg-[#0b1220] text-[#fafaf5]"
 : "bg-transparent text-[#8a93a6] hover:text-[#0b1220]"
 }`}
                      >
                        {period}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {props?.data?.rating && (
              <div className="flex items-center gap-1">
                {props.data?.rating && (
                  <div
                    style={{ color: "#f7e700", marginBottom: "0.3rem" }}
                    className="flex flex-row gap-1"
                  >
                    {stars}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center" }}>
                  {props.data?.rating && (
                    <p
                      className="ttw-type-small font-mono text-[#445069]"
                      style={{ marginBlock: "auto" }}
                    >
                      {props.data.rating} ·
                    </p>
                  )}

                  {props.data?.user_ratings_total > 0 && (
                    <u className="ttw-type-small text-[#8a93a6]">
                      {props.data.user_ratings_total}
                      {" user reviews"}
                    </u>
                  )}
                </div>
              </div>
            )}
            {props.data?.tags && (
              <div className="ttw-type-body flex flex-row items-center gap-1 flex-wrap">
                {props.data.tags?.map((e, i) => (
                  <span
                    key={i}
                    className={`border-2 border-transparent rounded-full px-2 py-1 text-[#1a2436]`}
                    style={{ backgroundColor: colors[i % colors.length] }}
                  >
                    {e}
                  </span>
                ))}
              </div>
            )}
            {props.data?.short_description && (
              <div className="flex flex-col gap-2">
                <div className="ttw-type-body text-[#445069]">
                  {props.data.short_description}
                </div>
              </div>
            )}
          </div>

          {/* <div className="flex flex-col gap-3 md:flex-row md:items-center justify-end">
          <Travelers
            travelers={props.filterState.pax.number_of_travelers}
            travelerAges={props.filterState.pax.traveler_ages}
            setFilterState={props.setFilterState}
          />
        </div> */}

          <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between">
            {props.data?.prices?.total_price ? (
              <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-2 items-center ttw-type-body text-[#445069]">
                  <span className="font-bold font-mono ttw-type-h4 md:ttw-type-h2 text-[#0b1220]">
                    ₹{getIndianPrice(Math.round(props.data.prices.total_price))}
                  </span>
                  {`for ${props.data.prices?.total_pax} people`}
                </div>

                {inclusiveCost.length ? (
                  <div className="ttw-type-body flex flex-row items-center gap-1 flex-wrap text-[#445069]">
                    Inclusive of{" "}
                    {inclusiveCost.map((item, index) => (
                      <span
                        key={index}
                        className="border-2 border-[#ececec] rounded-full px-2 py-1 text-[#1a2436]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div>
            {props.data?.general_guidelines &&
              props.data?.general_guidelines?.length ? (
              <div className="flex flex-col">
                <div className="ttw-type-h3 font-semibold">
                  <div>General guidelines</div>
                  <div className="border-b-[1px] border-[#ececec] mt-2 mb-2"></div>
                  {/* {!boolDetails?.generalGuidelines ? (
                    <IoIosArrowDown
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          generalGuidelines: true,
                        }))
                      }
                    />
                  ) : (
                    <IoIosArrowUp
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          generalGuidelines: false,
                        }))
                      }
                    />
                  )} */}
                </div>
                {boolDetails?.generalGuidelines && (
                  <div className="ttw-type-body">
                    <ul style={{ paddingLeft: "0.5rem" }}>
                      {props.data.general_guidelines?.map((e, i) => (
                        <li key={i}>- {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}

            {props.data?.things_to_bring &&
              props.data?.things_to_bring?.length ? (
              <div className="flex flex-col">
                <div className="ttw-type-h3 font-semibold">
                  <div>Things to bring</div>
                  <div className="border-b-[1px] border-[#ececec] mt-2 mb-2"></div>
                  {/* {!boolDetails?.thingsToBring ? (
                    <IoIosArrowDown
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          thingsToBring: true,
                        }))
                      }
                    />
                  ) : (
                    <IoIosArrowUp
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          thingsToBring: flase,
                        }))
                      }
                    />
                  )} */}
                </div>
                {!boolDetails?.thingsToBring && (
                  <div className="ttw-type-body">
                    <ul style={{ paddingLeft: "0.5rem" }}>
                      {props.data.things_to_bring?.map((e, i) => (
                        <li key={i}>- {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}

            {props.data?.not_suitable_for &&
              props.data?.not_suitable_for?.length ? (
              <div className="flex flex-col">
                <div className="ttw-type-h3 font-semibold">
                  <div>Not suitable for</div>
                  <div className="border-b-[1px] border-[#ececec] mt-2 mb-2"></div>
                  {/* {!boolDetails?.notSuitableFor ? (
                    <IoIosArrowDown
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          notSuitableFor: true,
                        }))
                      }
                    />
                  ) : (
                    <IoIosArrowUp
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          notSuitableFor: false,
                        }))
                      }
                    />
                  )} */}
                </div>
                {boolDetails?.notSuitableFor && (
                  <div className="ttw-type-body">
                    <ul style={{ paddingLeft: "0.5rem" }}>
                      {props.data.not_suitable_for?.map((e, i) => (
                        <li key={i}>- {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}

            {props.data?.tips_tricks && props.data?.tips_tricks?.length ? (
              <div className="flex flex-col">
                <div className="ttw-type-h3 font-semibold">
                  <div>Tips, Tricks and Cautions</div>
                  <div className="border-b-[1px] border-[#ececec] mt-2 mb-2"></div>
                  {/* {!boolDetails?.tipsTricks ? (
                    <IoIosArrowDown
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          tipsTricks: true,
                        }))
                      }
                    />
                  ) : (
                    <IoIosArrowUp
                      className="cursor-pointer"
                      onClick={() =>
                        setBoolDetail((prev) => ({
                          ...prev,
                          tipsTricks: false,
                        }))
                      }
                    />
                  )} */}
                </div>
                {boolDetails?.tipsTricks && (
                  <div className="ttw-type-body">
                    <ul style={{ paddingLeft: "0.5rem" }}>
                      {props.data.tips_tricks?.map((e, i) => (
                        <li key={i}>- {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        {props.data?.timings && (
          <div>
            <Heading>Timings</Heading>
            <Text>
              {
                <div>
                  {props.data.timings?.map((e, i) => {
                    const index = e.indexOf(":");
                    const day = e.slice(0, index).trim();
                    const time = e.slice(index + 1).trim();

                    return (
                      <div key={i} className="flex gap-[22px] mb-2">
                        <div className="ttw-type-body font-semibold text-[#445069]">{day}</div>
                        <div
                          className={`ttw-type-body font-mono bg-[#f4f3ec] text-[#0b1220] px-[8px] py-[2px] rounded-[10px] ${time == "Closed"
 ? " bg-[rgba(184,64,52,0.1)] text-[#b84034]"
 : ""
 }`}
                        >
                          {time}
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
            </Text>
          </div>
        )}
        {props?.data?.reviews && (
          <div className="flex flex-col gap-[12px]">
            <div id="reviews-poi" className="flex justify-between">
              <Heading>Reviews</Heading>

              <Reviews>
                {props.data.rating ? (
                  <div
                    style={{ color: "#f7e700" }}
                    className="flex flex-row gap-1"
                  >
                    {stars}
                  </div>
                ) : null}

                <div className="flex items-center">
                  {props.data?.rating ? (
                    <p className="m-0 font-mono">{props.data.rating}</p>
                  ) : null}

                  {/* {props.data?.user_ratings_total ? (
                      <u> {props.data.user_ratings_total} user reviews</u>
                    ) : null} */}
                </div>
              </Reviews>
            </div>
            {isSmallScreen ? (
              <div className="flex flex-col gap-2">
                {props?.data?.reviews?.map((item) => (
                  <div className="w-full">
                    <ReviewPoi review={item} />
                  </div>
                ))}
              </div>
            ) : (
              <ScrollContainer>
                {props?.data?.reviews?.map((item) => (
                  <div className="!w-[289px]">
                    <ReviewPoi review={item} />
                  </div>
                ))}
              </ScrollContainer>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <div>
            <svg
              width="23"
              height="24"
              viewBox="0 0 23 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_9135_4118)">
                <rect
                  y="0.800781"
                  width="22.4"
                  height="22.4"
                  rx="4"
                  fill="#169873"
                  fill-opacity="0.09"
                />
                <path
                  d="M13.2 18L9.20001 16.6L6.10001 17.8C5.87779 17.8889 5.67223 17.8639 5.48335 17.725C5.29446 17.5861 5.20001 17.4 5.20001 17.1667V7.83333C5.20001 7.68889 5.24168 7.56111 5.32501 7.45C5.40835 7.33889 5.52223 7.25556 5.66668 7.2L9.20001 6L13.2 7.4L16.3 6.2C16.5222 6.11111 16.7278 6.13611 16.9167 6.275C17.1056 6.41389 17.2 6.6 17.2 6.83333V16.1667C17.2 16.3111 17.1583 16.4389 17.075 16.55C16.9917 16.6611 16.8778 16.7444 16.7333 16.8L13.2 18ZM12.5333 16.3667V8.56667L9.86668 7.63333V15.4333L12.5333 16.3667ZM13.8667 16.3667L15.8667 15.7V7.8L13.8667 8.56667V16.3667ZM6.53335 16.2L8.53335 15.4333V7.63333L6.53335 8.3V16.2Z"
                  fill="#169873"
                />
              </g>
              <defs>
                <clipPath id="clip0_9135_4118">
                  <rect
                    y="0.800781"
                    width="22.4"
                    height="22.4"
                    rx="4"
                    fill="white"
                  />
                </clipPath>
              </defs>
              <g
                xmlns="http://www.w3.org/2000/svg"
                clip-path="url(#clip0_9135_4118)"
              >
                <rect
                  y="0.800781"
                  width="22.4"
                  height="22.4"
                  rx="4"
                  fill="#169873"
                  fill-opacity="0.09"
                />
                <path
                  d="M13.2 18L9.20001 16.6L6.10001 17.8C5.87779 17.8889 5.67223 17.8639 5.48335 17.725C5.29446 17.5861 5.20001 17.4 5.20001 17.1667V7.83333C5.20001 7.68889 5.24168 7.56111 5.32501 7.45C5.40835 7.33889 5.52223 7.25556 5.66668 7.2L9.20001 6L13.2 7.4L16.3 6.2C16.5222 6.11111 16.7278 6.13611 16.9167 6.275C17.1056 6.41389 17.2 6.6 17.2 6.83333V16.1667C17.2 16.3111 17.1583 16.4389 17.075 16.55C16.9917 16.6611 16.8778 16.7444 16.7333 16.8L13.2 18ZM12.5333 16.3667V8.56667L9.86668 7.63333V15.4333L12.5333 16.3667ZM13.8667 16.3667L15.8667 15.7V7.8L13.8667 8.56667V16.3667ZM6.53335 16.2L8.53335 15.4333V7.63333L6.53335 8.3V16.2Z"
                  fill="#169873"
                />
              </g>
              <defs xmlns="http://www.w3.org/2000/svg">
                <clipPath id="clip0_9135_4118">
                  <rect
                    y="0.800781"
                    width="22.4"
                    height="22.4"
                    rx="4"
                    fill="white"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="text-[#445069]">{props?.data?.address}</div>
        </div>

        <div className="flex justify-between">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              justifyContent: "left",
            }}
          >
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${props?.data?.gmaps_place_id}`}
              target="_blank"
              style={{ color: "#0b1220", fontSize: "14px", textDecoration: "underline" }}
            >
              View on Google Maps
            </a>
          </div>
        </div>

        <div className="border-t-2 border-[#ececec] fixed bottom-0 right-0 left-0 flex justify-end gap-1 py-[12px] px-[20px] bg-[#fafaf5] shadow-md z-50">
          <div className="flex flex-col gap-1 text-[#445069]">
            <button onClick={handleUpdate} className="ttw-btn-fill-yellow">
              Add to Itinerary
            </button>
            <>on {dateFormat(props?.date)}</>
          </div>
        </div>
      </div>
    </div>
  );
}

const Amenity = ({ index, amenity, handleAmenityChange, travelers }) => {
  const [included, setIncluded] = useState(amenity?.included);

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
    <div key={index} className=" gap-3 bg-[#f4f3ec] p-[10px] rounded-[4px]">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-2 ttw-type-body font-medium text-[#0b1220]">
          {/* {getAmenityIcon(amenity?.type)} */}
          {amenity.name}
        </div>
        <div className="ttw-type-body text-[#445069]">{amenity.description}</div>
        <div className="flex ttw-type-small font-medium text-[#445069]">
          <Image src="/ticket.svg" alt="ticket" width={13.33} height={10.67} />
          {travelers} tickets
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="font-semibold font-mono ttw-type-h2 text-[#0b1220]">
          ₹{getIndianPrice(amenity.price)}{" "}
          <span className="ttw-type-body font-normal font-sans text-[#8a93a6]">per person*</span>
        </div>

        <button
          disabled={amenity.mandatory}
          onClick={handleSelect}
          className="flex flex-row items-center gap-1 cursor-pointer"
        >
          <CheckboxFormComponent checked={included} />
        </button>
      </div>
    </div>
  );
};
