import { useState } from "react";
import Drawer from "../../../ui/Drawer";
import PropertyType from "./PropertyType";
import Facilities from "./Facilities";
import Tags from "./Tags";
import UserRatings from "./UserRatings";
import Image from "next/image";
import PriceRange from "./PriceRange";
import StarCategory from "./StarCategory";

export default function Filters(props) {
  const [selectedUserStar, setSelectedUserStar] = useState((props?.filters?.user_ratings?.length == 0 || !props?.filters?.user_ratings) ? [] : props?.filters?.user_ratings);
  const [selectedFacilities, setSelectedFacilities] = useState((props?.filters?.facilities?.length == 0 || !props?.filters?.facilities) ? [] : props?.filters?.facilities);
  const [selectedTags, setSelectedTags] = useState((props?.filters?.tags?.length == 0 || !props?.filters?.tags) ? [] : props?.filters?.tags);
  const [selectedTypes, setSelectedTypes] = useState((props?.filters?.type?.length == 0 || !props?.filters?.type) ? ["All"] : props?.filters?.type);
  const [budget, setBudget] = useState([props.filters.budget.price_lower_range || props.defaultBudget.price_lower_range, props.filters.budget.price_upper_range || props.defaultBudget.price_upper_range]);
  const [selectedStarCategory, setSelectedStarCategory] = useState(props.filters.star_category || null);

  const handleApply = () => {
    props.updateUserStarHandler(selectedUserStar);
    props._addFilterHandler(selectedFacilities, "facilities");
    props._addFilterHandler(selectedTags, "tags");
    props._addFilterHandler(selectedTypes, "type");
    props._updateStarFilterHandler(selectedStarCategory);
    props.setFilters((prev) => ({
      ...prev,
      budget: {
        price_lower_range: budget[0],
        price_upper_range: budget[1]
      },
    }));
    props.setshowFilter(false);
    props?.setIsFilterChangesApplied(true);
  };

  const removeAllFilter = () => {
    props._removeFilterHandler();
    props.setshowFilter(false);
    props?.setIsFilterChangesApplied(false);
  }

  return (
    <Drawer
      show={props.showFilter}
      anchor={"right"}
      backdrop
      style={{ zIndex: 1508 }}
      className=""
      onHide={() => props.setshowFilter(false)}
    >
      <div className="w-[80vw] md:w-[27vw] h-[100vh] flex flex-col">
        {/* Header - Fixed at top */}
        <div className="px-lg pt-md pb-sm border-b border-border-subtle">
          <div className="mb-md">
            <Image 
              src="/backarrow.svg" 
              className="cursor-pointer" 
              width={22} 
              height={22} 
              onClick={() => props.setshowFilter(false)} 
            />
          </div>
          
          <div className="flex w-full flex-row justify-between items-center">
            <div className="text-xl font-600 leading-2xl">Filters</div>
            {props?.isFilterChangesApplied && (
              <button 
                className="font-md font-500 leading-lg-md underline text-text-error" 
                onClick={removeAllFilter}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-lg py-lg scrollbar-hide">
          <div className="flex flex-col gap-xl">
            <PriceRange budget={budget} setBudget={setBudget} setFilters={props?.setFilters} />

            <hr className="m-zero" />

            <StarCategory
              starCategory={props.FILTERS.star_category}
              selectedStarCategory={selectedStarCategory}
              setSelectedStarCategory={setSelectedStarCategory}
            />

            <hr className="m-zero" />
            
            <UserRatings
              userRatings={props.FILTERS?.user_ratings}
              userRatingsLabel={props.FILTERS?.user_ratings_label}
              selectedUserStar={selectedUserStar}
              setSelectedUserStar={setSelectedUserStar}
            />

            {props.FILTERS?.type.length ? (
              <>
                <hr className="m-zero" />
                <PropertyType
                  types={props.FILTERS?.type}
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                />
              </>
            ) : null}

            {props.FILTERS?.facilities.length ? (
              <>
                <hr className="m-zero" />
                <Facilities
                  facilities={props.FILTERS?.facilities}
                  selectedFacilities={selectedFacilities}
                  setSelectedFacilities={setSelectedFacilities}
                />
              </>
            ) : null}

            {props.FILTERS?.tags.length ? (
              <>
                <hr className="m-zero" />
                <Tags
                  tags={props.FILTERS?.tags}
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                />
              </>
            ) : null}

            <hr className="m-zero" />
            
            {/* Add padding at bottom to prevent content from being hidden behind buttons */}
            <div className="h-4"></div>
          </div>
        </div>

        {/* Sticky footer buttons */}
        <div className="border-t border-border-subtle bg-white px-lg py-md">
          <div className="flex gap-3 justify-end">
            <button className="ttw-btn-secondary-flat" onClick={() => props.setshowFilter(false)}>
              Cancel
            </button>
            <button className="ttw-btn-secondary-fill" onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </Drawer>
  );
}