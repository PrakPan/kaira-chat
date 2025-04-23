import { useState, useEffect, useRef } from "react";
import Rating from "./Rating";
import CheckboxFormComponent from "../../../FormComponents/CheckboxFormComponent";
import Travelers from "./Travelers";
import DyamicFilters from "./DynamicFilters";
import useMediaQuery from "../../../../hooks/useMedia";
import { useSelector } from "react-redux";
import { Pax } from "../../activityDetails/Pax";

export default function Filters({
  filters,
  filterState,
  setFilterState,
  showDynamicfilters,
  setShowDynamicfilters,
}) {
  const isDesktop = useMediaQuery("(min-width:767px)");
  const [selectedRating, setSelectedRating] = useState([]);
  const [recommended, setRecommended] = useState(false);
  const [pax, setPax] = useState(
    useSelector((state) => state.ItineraryFilters).occupancies
  );
  const [showPax, setShowPax] = useState(false);
  const prevPaxRef = useRef(pax);

  useEffect(() => {
    // This will return true if arrays have different values, regardless of order
    const hasRatingChanged =
      filterState.rating.length !== selectedRating.length ||
      filterState.rating.some((rating) => !selectedRating.includes(rating)) ||
      selectedRating.some((rating) => !filterState.rating.includes(rating)) ||
      JSON.stringify(prevPaxRef.current) !== JSON.stringify(pax);
    prevPaxRef.current=pax;
    let handler;
    if (hasRatingChanged) {
      handler = setTimeout(() => {
        setFilterState((prev) => ({
          ...prev,
          rating: selectedRating,
          num_adults:4,
          num_children:pax.children
        }));
      }, 2000);
    }

    return () => {
      clearTimeout(handler);
    };
  }, [pax,selectedRating]);

  const handleRecommneded = () => {
    setRecommended((prev) => !prev);
    setFilterState((prev) => ({
      ...prev,
      recommended_only: !recommended,
    }));
  };

  return (
    <div className="w-full flex flex-col gap-3 md:flex-row md:items-end justify-between">
      {isDesktop && (
        <div className="flex flex-col gap-3 justify-start items-baseline">
          <Rating
            ratings={filters.ratings}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
          />

          <div>
            <button
              onClick={handleRecommneded}
              className="flex flex-row items-center gap-1 cursor-pointer"
            >
              <CheckboxFormComponent checked={recommended} />
              Top Recommended
            </button>
          </div>
        </div>
      )}

      <Pax
        setShowPax={setShowPax}
        pax={pax}
        setPax={setPax}
        showPax={showPax}
      />


      <DyamicFilters
        filters={filters}
        showFilter={showDynamicfilters}
        setshowFilter={setShowDynamicfilters}
        filterState={filterState}
        setFilterState={setFilterState}
        FILTERS={filters}
      />
    </div>
  );
}
