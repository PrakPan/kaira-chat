import React, { useState } from "react";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdOutlineDownhillSkiing } from "react-icons/md";

// ─── Icons ───────────────────────────────────────────────────────────────────

const HotelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
    <g opacity="0.3">
      <path d="M19.25 18.25V1.25C19.25 0.984784 19.1446 0.73043 18.9571 0.542893C18.7696 0.355357 18.5152 0.25 18.25 0.25H8.25C7.98478 0.25 7.73043 0.355357 7.54289 0.542893C7.35536 0.73043 7.25 0.984784 7.25 1.25V18.25H4.25V14.25H5.25C5.51522 14.25 5.76957 14.1446 5.95711 13.9571C6.14464 13.7696 6.25 13.5152 6.25 13.25V8.25C6.25 7.98478 6.14464 7.73043 5.95711 7.54289C5.76957 7.35536 5.51522 7.25 5.25 7.25H1.25C0.984784 7.25 0.73043 7.35536 0.542893 7.54289C0.355357 7.73043 0.25 7.98478 0.25 8.25V13.25C0.25 13.5152 0.355357 13.7696 0.542893 13.9571C0.73043 14.1446 0.984784 14.25 1.25 14.25H2.25V18.25H1.25C0.984784 18.25 0.73043 18.3554 0.542893 18.5429C0.355357 18.7304 0.25 18.9848 0.25 19.25C0.25 19.5152 0.355357 19.7696 0.542893 19.9571C0.73043 20.1446 0.984784 20.25 1.25 20.25H19.25C19.5152 20.25 19.7696 20.1446 19.9571 19.9571C20.1446 19.7696 20.25 19.5152 20.25 19.25C20.25 18.9848 20.1446 18.7304 19.9571 18.5429C19.7696 18.3554 19.5152 18.25 19.25 18.25ZM2.25 9.25H4.25V12.25H2.25V9.25ZM12.25 18.25V15.25C12.25 14.9848 12.3554 14.7304 12.5429 14.5429C12.7304 14.3554 12.9848 14.25 13.25 14.25C13.5152 14.25 13.7696 14.3554 13.9571 14.5429C14.1446 14.7304 14.25 14.9848 14.25 15.25V18.25H12.25ZM16.25 18.25V15.25C16.25 14.4544 15.9339 13.6913 15.3713 13.1287C14.8087 12.5661 14.0456 12.25 13.25 12.25C12.4544 12.25 11.6913 12.5661 11.1287 13.1287C10.5661 13.6913 10.25 14.4544 10.25 15.25V18.25H9.25V2.25H17.25V18.25H16.25Z" fill="black" stroke="white" strokeWidth="0.5"/>
      <path d="M12.25 4.25H10.25V6.25H12.25V4.25Z" fill="black"/>
      <path d="M16.25 4.25H14.25V6.25H16.25V4.25Z" fill="black"/>
      <path d="M12.25 8.25H10.25V10.25H12.25V8.25Z" fill="black"/>
      <path d="M16.25 8.25H14.25V10.25H16.25V8.25Z" fill="black"/>
    </g>
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g clipPath="url(#clip0_star)">
      <path d="M9.944 6.4L8 0L6.056 6.4H0L4.944 9.928L3.064 16L8 12.248L12.944 16L11.064 9.928L16 6.4H9.944Z" fill="#F7E700"/>
    </g>
    <defs>
      <clipPath id="clip0_star">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const RecommendationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 11 13" fill="none">
    <path d="M2.46801 12.0306C2.14424 12.1386 1.8099 11.8976 1.8099 11.5563V7.59375C1.8099 7.50113 1.78417 7.41033 1.73559 7.33147L0.0757254 4.63739C-0.0233917 4.47652 -0.0233509 4.27351 0.0758306 4.11267L2.46549 0.237556C2.55654 0.0899072 2.71761 0 2.89107 0H7.72872C7.90218 0 8.06326 0.0899073 8.15431 0.237556L10.544 4.11267C10.6431 4.27351 10.6432 4.47652 10.5441 4.63739L8.8842 7.33147C8.83562 7.41033 8.8099 7.50113 8.8099 7.59375V11.5563C8.8099 11.8976 8.47555 12.1386 8.15178 12.0306L5.46801 11.136C5.36538 11.1018 5.25442 11.1018 5.15178 11.136L2.46801 12.0306ZM2.97656 9.93891C2.97656 10.2798 3.31019 10.5207 3.63379 10.4135L5.15267 9.91041C5.25476 9.8766 5.36503 9.8766 5.46712 9.91041L6.98601 10.4135C7.3096 10.5207 7.64323 10.2798 7.64323 9.93891V9.25C7.64323 8.97386 7.41937 8.75 7.14323 8.75H3.47656C3.20042 8.75 2.97656 8.97386 2.97656 9.25V9.93891ZM3.54696 1.16667C3.37369 1.16667 3.21277 1.25637 3.12167 1.40376L1.44742 4.11209C1.34782 4.27321 1.34782 4.47679 1.44742 4.63791L3.12167 7.34624C3.21277 7.49363 3.37369 7.58333 3.54696 7.58333H7.07283C7.2461 7.58333 7.40702 7.49363 7.49813 7.34624L9.17237 4.63791C9.27197 4.47679 9.27197 4.27321 9.17237 4.11209L7.49813 1.40376C7.40702 1.25637 7.2461 1.16667 7.07283 1.16667H3.54696ZM5.0497 6.39822C4.85505 6.59373 4.53883 6.59464 4.34307 6.40025L2.98262 5.04938C2.78618 4.85433 2.78562 4.53678 2.98137 4.34103L3.10426 4.21814C3.29952 4.02287 3.6161 4.02287 3.81137 4.21814L4.3428 4.74957C4.53847 4.94524 4.85585 4.94477 5.05095 4.74852L6.81154 2.97751C7.00542 2.78249 7.32039 2.78063 7.51655 2.97335L7.63418 3.08892C7.83209 3.28336 7.83385 3.60175 7.63811 3.79836L5.0497 6.39822Z" fill="#AD5BE7"/>
  </svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────

interface SlabElement {
  type?: string;
  element_type?: string;
  name?: string;
  heading?: string;
  icon?: string;
  time?: string;
  rating?: number;
  activity?: string | number;
  poi?: string | number;
  restaurant?: string | number;
  booking?: { id: string | number };
}

interface DayData {
  date: string;
  day?: string;
  slab_elements: SlabElement[];
}

interface CityData {
  id: string | number;
  name: string;
  duration: number;
  accent?: string;
}

interface Hotel {
  id: string | number;
  name: string;
  rating?: number;
}

interface Route {
  city: CityData;
  hotels?: Hotel[] | string;
  day_by_day: DayData[];
}

interface CitySectionProps {
  route: Route;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const imgBase = "https://d31aoa0ehgvjdi.cloudfront.net/";

const fallbackImg =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop";

const getItemImage = (item: SlabElement) => {
  if (!item?.icon) return fallbackImg;
  if (item.icon.startsWith("http")) {
    return item.icon;
  }

  return imgBase + item.icon;
};

const getItemName = (item: SlabElement) => item?.heading || item?.name || "";

const formatDateLabel = (dateString: string) => {
  const date = new Date(dateString);
  const d = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const suffix =
    d > 3 && d < 21
      ? "th"
      : d % 10 === 1
      ? "st"
      : d % 10 === 2
      ? "nd"
      : d % 10 === 3
      ? "rd"
      : "th";
  return `${d}${suffix} ${month}`;
};

// ─── ActivityRow — matches renderActivityItem in CityDay exactly ──────────────

const ActivityRow: React.FC<{ item: SlabElement; index: number }> = ({
  item,
  index,
}) => {
  const itemName = getItemName(item);

  if (item?.element_type === "recommendation" || item?.type === "recommendation") {
    return (
      <div className="flex items-center gap-2 md:gap-3 min-w-0 md:flex-1">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#F3E8FF] flex items-center justify-center flex-shrink-0">
          <RecommendationIcon />
        </div>
        <div className="flex flex-col min-w-0 justify-center">
          <h4 className="text-sm text-[#111827] font-normal truncate mb-0 leading-4">
            {itemName}
          </h4>
          {item?.time && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-xs text-[#666666]">{item.time}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 md:gap-3 min-w-0 md:flex-1">
      <img
        src={getItemImage(item)}
        alt="activity"
        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex flex-col items-start justify-center gap-1 min-w-0 flex-1">
        <div className="flex items-center gap-2 w-full">
          <h4 className="text-xs md:text-sm text-[#000] !font-normal truncate mb-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:text-[#0066CC]">
            {itemName}
          </h4>
        </div>
        <div className="flex items-center gap-2">

          {item?.type === "activity" && (
          <span className="flex items-center px-1.5 md:px-2 py-0.5 bg-[#5CBA66] text-white text-[10px] md:text-xs rounded-full font-medium flex-shrink-0 whitespace-nowrap">
            Activity
          </span>
        )}
        {item?.type === "restaurant" && (
          <span className="flex items-center px-1.5 md:px-2 py-0.5 bg-[#FDECEA] text-[#C62828] text-[10px] md:text-xs rounded-full font-medium flex-shrink-0 whitespace-nowrap">
            Restaurant
          </span>
        )}
        {(item?.type === "poi" || (!item?.type && item?.poi)) && (
          <span className="flex items-center px-1.5 md:px-2 py-0.5 bg-[#EEF2FF] text-[#4338CA] text-[10px] md:text-xs rounded-full font-medium flex-shrink-0 whitespace-nowrap">
            Self Exploration
          </span>
        )}

        {/* Included tag — only for included activities */}
        {/* {(item?.activity || (item?.type === "activity" && item?.time)) && (
          <span className="flex gap-2 items-center px-1.5 md:px-2 py-0.5 bg-[#5CBA66] text-white text-[10px] md:text-xs rounded-full font-medium flex-shrink-0 whitespace-nowrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path
                d="M8.25 10C8.03333 10 7.82292 9.98374 7.61875 9.95122C7.41458 9.9187 7.21667 9.86992 7.025 9.80488L0 7.30488L0.25 6.60976L3.7 7.84146L4.5625 5.67073L2.775 3.85366C2.55 3.62602 2.46042 3.35569 2.50625 3.04268C2.55208 2.72967 2.71667 2.49187 3 2.32927L4.7375 1.35366C4.87917 1.27236 5.02292 1.22561 5.16875 1.21341C5.31458 1.20122 5.45833 1.22358 5.6 1.28049C5.74167 1.32927 5.86458 1.4065 5.96875 1.5122C6.07292 1.61789 6.15 1.7439 6.2 1.89024L6.3625 2.41463C6.47083 2.76423 6.64792 3.07317 6.89375 3.34146C7.13958 3.60976 7.43333 3.81301 7.775 3.95122L8.0375 3.17073L8.75 3.39024L8.1875 5.07317C7.57083 4.97561 7.025 4.73984 6.55 4.36585C6.075 3.99187 5.725 3.52846 5.5 2.97561L4.2375 3.68293L5.75 5.36585L4.6375 8.17073L6.1875 8.71951L7.2375 5.58537C7.35417 5.62602 7.47083 5.6626 7.5875 5.69512C7.70417 5.72764 7.825 5.7561 7.95 5.78049L6.8875 8.97561L7.275 9.10976C7.425 9.15854 7.58125 9.19715 7.74375 9.22561C7.90625 9.25406 8.075 9.26829 8.25 9.26829C8.46667 9.26829 8.67292 9.24797 8.86875 9.20732C9.06458 9.16667 9.25417 9.10569 9.4375 9.02439L10 9.57317C9.73333 9.71138 9.45417 9.81707 9.1625 9.89024C8.87083 9.96341 8.56667 10 8.25 10ZM7.25 1.95122C6.975 1.95122 6.73958 1.85569 6.54375 1.66463C6.34792 1.47358 6.25 1.2439 6.25 0.97561C6.25 0.707317 6.34792 0.477642 6.54375 0.286585C6.73958 0.0955284 6.975 0 7.25 0C7.525 0 7.76042 0.0955284 7.95625 0.286585C8.15208 0.477642 8.25 0.707317 8.25 0.97561C8.25 1.2439 8.15208 1.47358 7.95625 1.66463C7.76042 1.85569 7.525 1.95122 7.25 1.95122Z"
                fill="white"
              />
            </svg>{" "}
            Included
          </span>
        )} */}
         
          {item?.time && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-xs text-[#666666]">{item.time}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── DayRow — matches CityDay layout exactly ─────────────────────────────────

interface DayRowProps {
  day: DayData;
  isLastDay: boolean;
  cityName: string;
  index: number;
  isLoading?: boolean;
}

const DayRow: React.FC<DayRowProps> = ({ day, isLastDay, cityName, index, isLoading }) => {
  const activities: SlabElement[] = [];
  const pois: SlabElement[] = [];
  const restaurants: SlabElement[] = [];
  const recommendations: SlabElement[] = [];

  for (const elem of day.slab_elements || []) {
    if (elem?.activity || elem?.type === "activity") {
      activities.push(elem);
    } else if (elem?.type === "poi" || elem?.poi) {
      pois.push(elem);
    } else if (elem?.type === "restaurant" || elem?.restaurant) {
      restaurants.push(elem);
    } else if (elem?.type === "recommendation") {
      recommendations.push(elem);
    }
  }

  const elements = day?.slab_elements || [];

  return (
    <div className="flex border-b border-[#E8E8E8] hover:bg-[#FAFAFA] transition-colors">
      {/* Date column — matches CityDay exactly: w-20 md:w-24, px-2 md:px-4, py-3 md:py-4 */}
      <div className="w-20 md:w-24 px-2 md:px-4 py-3 md:py-4 border-r border-[#E8E8E8] flex items-start">
        <span className="text-xs md:text-sm text-[#000]">
          {day.day ? day.day : formatDateLabel(day.date)}
        </span>
      </div>

      {/* Content column — matches CityDay: flex-1 px-2 md:px-4 py-2 md:py-3 */}
     <div className="flex-1 px-2 md:px-4 py-2 md:py-3 min-w-0">
  {isLoading ? (
    <div className="flex flex-col gap-3 py-1">
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gray-200 animate-pulse" />
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: `${50 + i * 15}%` }} />
            <div className="flex gap-2">
              <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : elements.length > 0 ? (
    <div className="flex flex-col gap-2">
      {elements.map((item, i) => (
        <ActivityRow key={i} item={item} index={i} />
      ))}
    </div>
  ) : isLastDay ? (
    <div className="flex items-center gap-2 md:gap-3">
      <IoBagCheckOutline size={16} className="w-[30px] md:w-[40px] h-[20px] md:h-[27px]" />
      <div className="flex-1 min-w-0">
        <div className="text-xs md:text-sm mt-1">Check out from {cityName}</div>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <MdOutlineDownhillSkiing size={16} className="w-[30px] md:w-[40px] h-[20px] md:h-[27px]" />
      <span className="text-xs md:text-sm">No activity is added.</span>
    </div>
  )}
</div>
    </div>
  );
};

// ─── HotelRow — matches ItineraryCity hotel display exactly ──────────────────

interface HotelRowProps {
  hotels: Hotel[] | string | undefined;
}

const HotelRow: React.FC<HotelRowProps> = ({ hotels }) => {
  if (!hotels) return null;


  const hotelList: Hotel[] = typeof hotels === "string"
    ? [{ id: "single", name: hotels }]
    : Array.isArray(hotels)
      ? hotels
      : [hotels as Hotel]; 
  if (hotelList.length === 0) return null;

  return (
    <>
      {hotelList.map((hotel) => (
        <div key={hotel.id} className="flex flex-col gap-1">
          {hotel?.name && (
            <div className="flex flex-row">
              <div className="flex gap-2 pr-[8px]">
                <HotelIcon />
                <div className="text-[14px] font-400 leading-0 cursor-pointer">
                  {hotel.name}
                </div>
              </div>
              {hotel?.rating && hotel.rating !== 0 && (
                <div className="flex flex-row items-center pl-[8px]">
                  <div className="text-[#000] text-[12px] ml-1 mr-1 font-[500]">
                    {hotel.rating}
                  </div>
                  <StarIcon />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

// ─── CitySection ─────────────────────────────────────────────────────────────

const CitySection: React.FC<CitySectionProps & { isLoading?: boolean }> = ({ route, isLoading }) => {
  return (
    <div className="border-1 rounded-t-lg flex flex-col w-full bg-[#FFF5EF]">
      {/* City header — matches ItineraryCity top bar exactly */}
      <div className="flex items-start justify-between p-3 rounded-t-lg w-full border-1 border-[#FBEAC7]">
        <div className="space-y-1 font-inter w-full">
          {/* City name + duration — matches ItineraryCity md:text-[18px] font-semibold leading-0 */}
          <div className="md:text-[18px] font-semibold leading-0">
            {route.city.name}
            {" - "}
            {route.city.duration}{" "}
            {route.city.duration > 1 ? "Nights" : "Night"}
            {route.city.duration === 0 ? " (Transit City)" : ""}
          </div>

          {/* Hotel rows — matches ItineraryCity multiHotelStays map */}
          <div className="flex flex-col gap-2">
            <HotelRow hotels={route.hotels} />
          </div>
        </div>
      </div>

      {/* Day-by-day — matches CityDaybyDay: bg-[#FBFBFB], inner bg-white rounded-lg shadow-sm overflow-hidden */}
      <div id="citydaybyday" className="bg-[#FBFBFB]">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {route.day_by_day?.map((day, dayIndex) => (
            <DayRow
  key={day.date}
  day={day}
  index={dayIndex}
  isLastDay={dayIndex === route.day_by_day.length - 1}
  cityName={route.city.name}
  isLoading={isLoading}
/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitySection;