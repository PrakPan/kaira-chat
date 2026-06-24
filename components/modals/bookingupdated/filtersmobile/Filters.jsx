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
        price_upper_range: budget[1] === 10000 ? null : budget[1]
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
      width="50%"
      mobileWidth="100%"
      bgColor="#fafaf5"
      style={{ zIndex: props.zIndex ?? 1508 }}
      className="!overflow-y-hidden"
      onHide={() => props.setshowFilter(false)}
    >
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header - sticky at top */}
        <div className="px-6 max-ph:px-4 py-4 bg-[#fafaf5] z-[900] sticky top-0 flex flex-col gap-3 pb-2 border-b border-[#ececec]">
          <Image
            src="/backarrow.svg"
            className="cursor-pointer"
            width={22}
            height={2}
            onClick={() => props.setshowFilter(false)}
          />

          <div className="flex w-full flex-row justify-between items-center">
            <div className="ttw-type-h2 font-semibold text-[#0b1220]">Filters</div>
            {props?.isFilterChangesApplied && (
              <button
                className="ttw-type-small font-500 underline text-[#CD2026]"
                onClick={removeAllFilter}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-scroll px-6 max-ph:px-4 py-6 pb-24 scrollbar-hide">
          <div className="flex flex-col gap-6">
            <PriceRange budget={budget} setBudget={setBudget} setFilters={props?.setFilters} />

            <hr className="border-t border-[#ececec] m-0" />

            <StarCategory
              starCategory={props.FILTERS.star_category}
              selectedStarCategory={selectedStarCategory}
              setSelectedStarCategory={setSelectedStarCategory}
            />

            {/* <hr className="border-t border-[#ececec] m-0" /> */}
            
            {/* <UserRatings
              userRatings={props.FILTERS?.user_ratings}
              userRatingsLabel={props.FILTERS?.user_ratings_label}
              selectedUserStar={selectedUserStar}
              setSelectedUserStar={setSelectedUserStar}
            /> */}

            {props.FILTERS?.type.length ? (
              <>
                <hr className="border-t border-[#ececec] m-0" />
                <PropertyType
                  types={props.FILTERS?.type}
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                />
              </>
            ) : null}

            {props.FILTERS?.facilities.length ? (
              <>
                <hr className="border-t border-[#ececec] m-0" />
                <Facilities
                  facilities={props.FILTERS?.facilities}
                  selectedFacilities={selectedFacilities}
                  setSelectedFacilities={setSelectedFacilities}
                />
              </>
            ) : null}

            {props.FILTERS?.tags.length ? (
              <>
                <hr className="border-t border-[#ececec] m-0" />
                <Tags
                  tags={props.FILTERS?.tags}
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                />
              </>
            ) : null}

            <hr className="border-t border-[#ececec] m-0" />
            
            {/* Add padding at bottom to prevent content from being hidden behind buttons */}
            <div className="h-4"></div>
          </div>
        </div>

        {/* Sticky footer buttons */}
        <div className="sticky bottom-0 z-10 border-t border-[#ececec] bg-[#fafaf5] px-6 max-ph:px-4 py-4">
          <div className="flex gap-3 items-center">
            <button
              className="ttw-btn-secondary whitespace-nowrap ttw-type-body"
              onClick={() => props.setshowFilter(false)}
            >
              Cancel
            </button>
            <button
              className="w-full bg-[#f7e700] text-black font-500 ttw-type-body py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
              onClick={handleApply}
            >
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