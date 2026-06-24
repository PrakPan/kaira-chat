import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import Drawer from "../../../ui/Drawer";
import ButtonYellow from "../../../ButtonYellow";
import CheckboxFormComponent from "../../../FormComponents/CheckboxFormComponent";
import Rating from "./Rating";
import Category from "./Category";
import TourType from "./TourType";
import Guide from "./Guide";
import useMediaQuery from "../../../../hooks/useMedia";
import ExperienceFilters from "./ExperienceFilters";

export default function DyamicFilters(props) {
  const [selectedRating, setSelectedRating] = useState([]);
  const [recommended, setRecommended] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(
    props?.filterState?.category
  );
  const [selectedTourTypes, setSelectedTourTypes] = useState(
    props?.filterState?.tour_type
  );
  const [selectedGuide, setSelectedGuide] = useState(props?.filterState?.guide);
  const [experienceFilters, setExperienceFilters] = useState(
    props?.filterState?.experienceFilters
  );
  const [experienceFiltersActivity, setExperienceFiltersActivity] = useState(
    props?.filterState?.experienceFiltersActivity
  );
  const handleApply = () => {
    props.setFilterState((prev) => ({
      ...prev,
      rating: selectedRating,
      recommended_only: recommended,
      category: selectedCategories,
      tour_type: selectedTourTypes,
      guide: selectedGuide,
      experienceFilters: experienceFilters,
      experienceFiltersActivity:experienceFiltersActivity
    }));
    props.setshowFilter(false);
  };

  return (
    <>
      {props?.showFilter && (
        <>
          {props?.elementType === "Activity" ? (
            <div className="w-full sm:w-[452px] flex flex-col gap-3 justify-between items-start mx-auto">
              <div className="flex flex-col gap-3 justify-between w-full px-6 max-ph:px-4 mt-4">
                <div className="border-b border-b-[#ececec] flex justify-between items-center">
                  <div className="ttw-type-h3 line-clamp-1 font-semibold text-[#0b1220]">
                    Filters
                  </div>
                  <div
                    className="ttw-type-small font-500 text-[#0b1220] cursor-pointer underline"
                    onClick={() => {
                      setSelectedRating([]);
                      setRecommended(false);
                      setSelectedCategories(["All"]);
                      setSelectedTourTypes(["All"]);
                      setSelectedGuide(["All"]);
                      props.setChanged(false);
                    }}
                  >
                    Reset all
                  </div>
                </div>
                {props.FILTERS.tour_type && props.FILTERS.tour_type.length ? (
                  <TourType
                    tourTypes={props.FILTERS.tour_type}
                    selectedTourTypes={selectedTourTypes}
                    setSelectedTourTypes={setSelectedTourTypes}
                    setChanged={props.setChanged}
                  />
                ) : null}

                {props.FILTERS.guide && props.FILTERS.guide.length ? (
                  <Guide
                    guide={props.FILTERS.guide}
                    selectedGuide={selectedGuide}
                    setSelectedGuide={setSelectedGuide}
                    setChanged={props.setChanged}
                  />
                ) : null}
                {props.FILTERS.category && props.FILTERS.category.length ? (
                  <Category
                    categories={props.FILTERS.category}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    setChanged={props.setChanged}
                  />
                ) : null}
                <ExperienceFilters
                  experienceFilters={experienceFiltersActivity}
                  setExperienceFilters={setExperienceFiltersActivity}
                  setChanged={props.setChanged}
                />
                <Rating
                  ratings={props.filters.ratings}
                  selectedRating={selectedRating}
                  setSelectedRating={setSelectedRating}
                  setChanged={props.setChanged}
                />
              </div>

              <div className="w-full px-6 max-ph:px-4 flex gap-3 flex-row justify-between mt-0">
                <button
                  className="ttw-btn-secondary w-1/2 whitespace-nowrap ttw-type-body"
                  onClick={() => props.setshowFilter(false)}
                >
                  Cancel
                </button>
                <button
                  id="apply-button"
                  className="w-1/2 bg-[#f7e700] text-black font-500 ttw-type-body py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                  onClick={handleApply}
                >
                  Apply
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full sm:w-[452px] flex flex-col gap-3 justify-between items-start mx-auto">
              <div className="flex flex-col gap-3 justify-between w-full px-6 max-ph:px-4 mt-4">
                <div className="border-b border-b-[#ececec] flex justify-between items-center">
                  <div className="ttw-type-h3 line-clamp-1 font-semibold text-[#0b1220]">
                    Filters
                  </div>
                  <div
                    className="ttw-type-small font-500 text-[#0b1220] cursor-pointer underline"
                    onClick={() => {
                      setSelectedRating([]);
                      setRecommended(false);
                      setSelectedCategories(["All"]);
                      setSelectedTourTypes(["All"]);
                      setSelectedGuide(["All"]);
                      props.setChanged(false);
                      setExperienceFilters(["All"]);
                    }}
                  >
                    Reset all
                  </div>
                </div>
                <ExperienceFilters
                  experienceFilters={experienceFilters}
                  setExperienceFilters={setExperienceFilters}
                  setChanged={props.setChanged}
                />
              </div>

              <div className="w-full px-6 max-ph:px-4 flex gap-3 flex-row justify-between mt-0">
                <button
                  className="ttw-btn-secondary w-1/2 whitespace-nowrap ttw-type-body"
                  onClick={() => props.setshowFilter(false)}
                >
                  Cancel
                </button>
                <button
                  id="apply-button"
                  className="w-1/2 bg-[#f7e700] text-black font-500 ttw-type-body py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                  onClick={handleApply}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
