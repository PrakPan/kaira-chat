import { useState, useEffect } from "react";
import Rating from "./Rating";
import CheckboxFormComponent from "../../../FormComponents/CheckboxFormComponent";
import Travelers from "./Travelers";
import DyamicFilters from "./DynamicFilters";
import useMediaQuery from "../../../../hooks/useMedia";

export default function Filters({ filters, filterState, setFilterState, showDynamicfilters, setShowDynamicfilters }) {
    const isDesktop = useMediaQuery("(min-width:767px)");
    const [selectedRating, setSelectedRating] = useState([])
    const [recommended, setRecommended] = useState(false)

    useEffect(() => {
        let handler;
        if (filterState.rating !== selectedRating) {
            handler = setTimeout(() => {
                setFilterState(prev => ({
                    ...prev,
                    "rating": selectedRating,
                }));
            }, 2000)
        }

        return () => {
            clearTimeout(handler);
        };
    }, [selectedRating])

    const handleRecommneded = () => {
        setRecommended(prev => !prev);
        setFilterState(prev => ({
            ...prev,
            "recommended_only": !recommended,
        }))
    }

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
                        <button onClick={handleRecommneded} className="flex flex-row items-center gap-1 cursor-pointer">
                            <CheckboxFormComponent checked={recommended} />
                            Recommended
                        </button>
                    </div>
                </div>
            )}

            <Travelers
                travelers={filterState.pax.number_of_travelers}
                travelerAges={filterState.pax.traveler_ages}
                setFilterState={setFilterState}
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
