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

export default function DyamicFilters(props) {
    const isDesktop = useMediaQuery("(min-width:767px)");
    const [selectedRating, setSelectedRating] = useState([])
    const [recommended, setRecommended] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState(["All"])
    const [selectedTourTypes, setSelectedTourTypes] = useState(["All"])
    const [selectedGuide, setSelectedGuide] = useState(["All"])

    const handleApply = () => {
        props.setFilterState(prev => ({
            ...prev,
            "rating": selectedRating,
            "recommended_only": recommended,
            "category": selectedCategories,
            "tour_type": selectedTourTypes,
            "guide": selectedGuide,
        }));
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
            <div className="w-[100vw] md:w-[25vw] px-2 h-[98vh] flex flex-col gap-3 justify-between items-start mx-auto ">
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

                    {!isDesktop && (
                        <>
                            <Rating
                                ratings={props.filters.ratings}
                                selectedRating={selectedRating}
                                setSelectedRating={setSelectedRating}
                            />

                            <div>
                                <button onClick={() => setRecommended(prev => !prev)} className="flex flex-row items-center gap-1 cursor-pointer">
                                    <CheckboxFormComponent checked={recommended} />
                                    Recommended
                                </button>
                            </div>
                        </>
                    )}

                    {props.FILTERS.category && props.FILTERS.category.length ? (
                        <Category
                            categories={props.FILTERS.category}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                        />
                    ) : null}

                    {props.FILTERS.tour_type && props.FILTERS.tour_type.length ? (
                        <TourType
                            tourTypes={props.FILTERS.tour_type}
                            selectedTourTypes={selectedTourTypes}
                            setSelectedTourTypes={setSelectedTourTypes}
                        />
                    ) : null}

                    {props.FILTERS.guide && props.FILTERS.guide.length ? (
                        <Guide
                            guide={props.FILTERS.guide}
                            selectedGuide={selectedGuide}
                            setSelectedGuide={setSelectedGuide}
                        />
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
