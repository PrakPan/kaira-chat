import { useState } from "react";
import { IoMdClose, IoMdStar } from "react-icons/io";
import Drawer from "../../../ui/Drawer";
import UiDropdown from "../../../UiDropdown";
import ButtonYellow from "../../../ButtonYellow";


export default function Filters(props) {
    const [selectedUserStar, setSelectedUserStar] = useState(-1);

    const onUserStarSelect = (i, currentfilter) => {
        if (selectedUserStar == i) {
            setSelectedUserStar(-1);
            props.updateUserStarHandler("");
            return;
        }
        setSelectedUserStar(i);
        props.updateUserStarHandler(currentfilter);
    }

    const handleSelectOption = (option) => {
        props._addFilterHandler(option, "type");
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
                        <div className="mb-2 text-sm font-normal">User Ratings</div>
                        <div className="flex flex-row gap-1">
                            {props.FILTERS["user_ratings"].map((currentfilter, i) => (
                                <button
                                    onClick={() => onUserStarSelect(i, currentfilter)}
                                    className={`flex font-normal  text-sm cursor-pointer  justify-center items-center hover:bg-gray-100 active:bg-[#111] active:border-0 ${selectedUserStar == i
                                        ? "text-white border-0 bg-black "
                                        : "border-2 bg-white text-black"
                                        } active:text-white  border-[#D0D5DD]  rounded-lg px-2 py-1`}
                                    key={i}
                                >
                                    {currentfilter}
                                    <IoMdStar />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col justify-start items-baseline">
                        <div className="mb-2 text-sm font-normal">Property type</div>
                        <div className="w-[12rem]">
                            <UiDropdown
                                options={props.FILTERS["type"]}
                                onSelect={handleSelectOption}
                            ></UiDropdown>
                        </div>
                    </div>
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
                        onClick={() => props.setshowFilter(false)}
                    >
                        <div className="text-[#01202B] ">Apply</div>
                    </ButtonYellow>
                </div>
            </div>
        </Drawer>
    );
}
