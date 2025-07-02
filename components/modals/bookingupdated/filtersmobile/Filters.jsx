import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import Drawer from "../../../ui/Drawer";
import ButtonYellow from "../../../ButtonYellow";
import PropertyType from "./PropertyType";
import Facilities from "./Facilities";
import Tags from "./Tags";
import UserRatings from "./UserRatings";

export default function Filters(props) {

  const [selectedUserStar, setSelectedUserStar] = useState((props?.filters?.user_ratings?.length==0 || !props?.filters?.user_ratings )?[]:props?.filters?.user_ratings);
  const [selectedFacilities, setSelectedFacilities] = useState((props?.filters?.facilities?.length==0 || !props?.filters?.facilities )?[]:props?.filters?.facilities);
  const [selectedTags, setSelectedTags] = useState((props?.filters?.tags?.length==0 || !props?.filters?.tags )?[]:props?.filters?.tags);
  const [selectedTypes, setSelectedTypes] = useState((props?.filters?.type?.length==0 || !props?.filters?.type )?["All"]:props?.filters?.type);
console.log("type is:",(props?.filters?.type?.length==0 || !props?.filters?.type )?["All"]:props?.filters?.type)
  const handleApply = () => {
    props.updateUserStarHandler(selectedUserStar);
    props._addFilterHandler(selectedFacilities, "facilities");
    props._addFilterHandler(selectedTags, "tags");
    props._addFilterHandler(selectedTypes, "type");
    props.setshowFilter(false);
  };

  return (
    <Drawer
      show={props.showFilter}
      anchor={"right"}
      backdrop
      style={{ zIndex: 1508 }}
      className="font-lexend"
      onHide={() => props.setshowFilter(false)}
    >
      <div className="w-[44vw] md:w-[25vw]  px-2 h-[98vh] flex flex-col gap-3 justify-between items-start mx-auto ">
        <div className="flex flex-col gap-3 justify-between w-[95%] mx-auto mt-4">
          <div className="flex flex-row gap-3 my-0 justify-start items-center">
            <IoMdClose
              onClick={() => props.setshowFilter(false)}
              className="hover-pointer"
              style={{
                fontSize: "1.75rem",
                textAlign: "right",
              }}
            ></IoMdClose>
            <div className="text-2xl font-normal line-clamp-1">Filters</div>
          </div>

          {props.FILTERS?.type.length ? (
            <PropertyType
              types={props.FILTERS?.type}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
            />
          ) : null}

          {props.FILTERS?.facilities.length ? (
            <Facilities
              facilities={props.FILTERS?.facilities}
              selectedFacilities={selectedFacilities}
              setSelectedFacilities={setSelectedFacilities}
            />
          ) : null}

          {props.FILTERS?.tags.length ? (
            <Tags
              tags={props.FILTERS?.tags}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          ) : null}

          <UserRatings
            userRatings={props.FILTERS?.user_ratings}
            selectedUserStar={selectedUserStar}
            setSelectedUserStar={setSelectedUserStar}
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
          <ButtonYellow className="w-1/2" onClick={handleApply}>
            <div className="text-[#01202B] ">Apply</div>
          </ButtonYellow>
        </div>
      </div>
    </Drawer>
  );
}
