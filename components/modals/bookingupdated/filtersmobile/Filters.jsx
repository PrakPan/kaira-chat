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
  const [selectedStarCategory, setSelectedStarCategory] = useState(props.filters.star_category || []);

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
      <div className="w-[80vw] md:w-[27vw] px-lg h-[100vh] flex flex-col items-start mx-auto">
        <div className="my-[1rem]">
          <Image src="/backarrow.svg" className="cursor-pointer" width={22} height={2} onClick={() => props.setshowFilter(false)} />
        </div>
        <div className="flex w-100 flex-row my-0 justify-between items-center">
          <div className="text-xl font-600 leading-2xl">Filters</div>
          {props?.isFilterChangesApplied && <button className="font-md font-500 leading-lg-md underline text-text-error" onClick={removeAllFilter}>Clear</button>}
        </div>

        <div className="flex flex-col gap-xl mt-lg overflow-y-auto h-[80%]  w-full">

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
        </div>

        <div className="w-full flex gap-3 flex-row mx-auto my-zero justify-end fixed bottom-zero bg-text-white left-zero p-md scrollbar-hide">
          <button className="ttw-btn-secondary-flat" onClick={() => props.setshowFilter(false)}>
            Cancel
          </button>
          <button className="ttw-btn-secondary-fill" onClick={handleApply}>
            Apply
          </button>
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
      </div>
    </Drawer>
  );
}
