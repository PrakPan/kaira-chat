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
            <div className="sm:w-[452px]  flex flex-col gap-3 justify-between items-start mx-auto">
              <div className="flex flex-col gap-3 justify-between w-[95%] mx-auto mt-4">
                <div className="border-b border-b-[#CAC3C3] flex justify-between items-center">
                  <div className="text-[20px] font-normal line-clamp-1 font-semibold">
                    Filters
                  </div>
                  <div
                    className="!text-blue-500 cursor-pointer underline"
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

              <div className="w-full flex gap-3 flex-row justify-between mt-0">
                <ButtonYellow
                  primary={false}
                  className="w-1/2 "
                  onClick={() => props.setshowFilter(false)}
                >
                  <div className="text-[#01202B] ">Cancel</div>
                </ButtonYellow>
                <ButtonYellow className="w-1/2 " onClick={handleApply}>
                  <div id="apply-button">Apply</div>
                </ButtonYellow>
              </div>
            </div>
          ) : (
            <div className="sm:w-[452px]  flex flex-col gap-3 justify-between items-start mx-auto">
              <div className="flex flex-col gap-3 justify-between w-[95%] mx-auto mt-4">
                <div className="border-b border-b-[#CAC3C3] flex justify-between items-center">
                  <div className="text-[20px] font-normal line-clamp-1 font-semibold">
                    Filters
                  </div>
                  <div
                    className="!text-blue-500 cursor-pointer underline"
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

              <div className="w-full flex gap-3 flex-row justify-between mt-0">
                <ButtonYellow
                  primary={false}
                  className="w-1/2 "
                  onClick={() => props.setshowFilter(false)}
                >
                  <div className="text-[#01202B] ">Cancel</div>
                </ButtonYellow>
                <ButtonYellow className="w-1/2 " onClick={handleApply}>
                  <div id="apply-button">Apply</div>
                </ButtonYellow>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
