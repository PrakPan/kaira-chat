import { useState } from "react";
import { IoMdClose, IoMdStar } from "react-icons/io";
import Drawer from "../../../ui/Drawer";
import ButtonYellow from "../../../ButtonYellow";
import PropertyType from "./PropertyType";
import Facilities from "./Facilities";
import Tags from "./Tags";

export default function Filters(props) {
    const [selectedUserStar, setSelectedUserStar] = useState([]);
    const [selectedFacilities, setSelectedFacilities] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [type, setType] = useState(null);

    const handleSelectOption = (option) => {
        setType(option);
    };

    const handleUserStar = (star) => {
        if (selectedUserStar.includes(star)) {
            setSelectedUserStar(prev => prev.filter(item => item !== star));
        } else {
            setSelectedUserStar(prev => [...prev, star])
        }
    }

    const isSelectedUserStar = (star) => {
        return selectedUserStar.includes(star);
    }

    const handleApply = () => {
        props.updateUserStarHandler(selectedUserStar);
        props._addFilterHandler(selectedFacilities, "facilities");
        props._addFilterHandler(type, "type");
        props.setshowFilter(false)
    }

    return (
        <Drawer
            show={props.showFilter}
            anchor={"right"}
            backdrop
            style={{ zIndex: 1508 }}
            className="font-lexend"
            onHide={() => props.setshowFilter(false)}
        >
            <div className="w-[25vw] px-2 h-[98vh] flex flex-col gap-3 justify-between items-start mx-auto ">
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

                    <div className="flex flex-col justify-start items-baseline">
                        <div className="mb-2 font-semibold">User Ratings</div>
                        <div className="flex flex-row gap-1">
                            {props.FILTERS["user_ratings"].map((star, i) => (
                                <button
                                    onClick={() => handleUserStar(star)}
                                    className={`flex font-normal  text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${isSelectedUserStar(star)
                                        ? "text-white border-0 bg-black "
                                        : "border-2 bg-white text-black"
                                        } active:text-white  border-[#D0D5DD]  rounded-lg px-2 py-1`}
                                    key={i}
                                >
                                    {star}
                                    <IoMdStar />
                                </button>
                            ))}
                        </div>
                    </div>

                    {props.FILTERS.type.length ? (
                        <PropertyType types={props.FILTERS.type} handleSelectOption={handleSelectOption} />
                    ) : null}

                    {props.FILTERS.facilities.length ? (
                        <Facilities
                            facilities={props.FILTERS.facilities}
                            selectedFacilities={selectedFacilities}
                            setSelectedFacilities={setSelectedFacilities} />
                    ) : null}

                    {props.FILTERS.tags.length ? (
                        <Tags
                            tags={props.FILTERS.tags}
                            selectedTags={selectedTags}
                            setSelectedTags={setSelectedTags} />
                    ) : null}
                </div>

                <div className="w-full flex gap-3 flex-row justify-between mt-0">
                    <ButtonYellow
                        primary={false}
                        className="w-1/2 "
                        onClick={() => props.setshowFilter(false)}
                    >
                        <div className="text-[#01202B] ">Cancel</div>
                    </ButtonYellow>
                    <ButtonYellow
                        className="w-1/2"
                        onClick={handleApply}
                    >
                        <div className="text-[#01202B] ">Apply</div>
                    </ButtonYellow>
                </div>
            </div>
        </Drawer>
    );
}
