import React, { useEffect } from "react";
import { useState } from "react";
import media from "../../media";
import ImageLoader from "../../ImageLoader";
import SkeletonCard from "../../ui/SkeletonCard";
import CheckboxFormComponent from "../../../components/FormComponents/CheckboxFormComponent";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { dateFormat } from "../../../helper/DateUtils";
import { FaStar, FaStarHalfAlt, FaClock } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { IoFastFood, IoTicket } from "react-icons/io5";
import { MdTransferWithinAStation } from "react-icons/md";
import { BiSolidCustomize } from "react-icons/bi";


export default function ActivityDetails(props) {
    let isPageWide = media("(min-width: 768px)");
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageFail, setImageFail] = useState(false);
    const [stars, setStars] = useState([]);
    const [inclusiveCost, setInclusiveCost] = useState([]);

    useEffect(() => {
        if (props.data?.amenities?.length) {
            for (let amenity of props.data.amenities) {
                if (amenity?.included) {
                    setInclusiveCost((prev) => [...prev, amenity.name]);
                }
            }
        }

        return () => {
            setInclusiveCost([])
        }
    }, [props.data])

    useEffect(() => {
        var stars = [];
        for (let i = 0; i < Math.floor(props.data.rating); i++) {
            stars.push(<FaStar />);
        }

        if (Math.floor(props.data.rating) < props.data.rating)
            stars.push(<FaStarHalfAlt />);

        setStars(stars);
    }, [])

    const handleUpdate = () => {
        props.updatedActivityBooking();
    }

    const handleAmenityChange = (index, included) => {
        let amenities = props.data?.amenities.filter((amenity, i) => i !== index && amenity.included);

        if (included) {
            amenities.push(props.data?.amenities[index]);
        }

        props.fetchData({
            amenities: amenities.map(amenity => amenity?.id).join(","),
        });
    }

    return (
        <div className="flex flex-col gap-2 px-4 pb-4">
            <div className="sticky top-0 z-1 flex flex-row items-center gap-2 py-4 bg-white">
                <IoMdClose
                    className="hover-pointer"
                    onClick={(e) => {
                        props.handleCloseDrawer(e);
                    }}
                    style={{ fontSize: "2rem" }}
                ></IoMdClose>
                <div className="text-[1.5rem] leading-[2rem]">Back to Itinerary</div>
            </div>

            {props.updateAmenities && (
                <div className="fixed top-[65%] left-[50%] -translate-x-[50%] z-50 flex flex-row items-center gap-2">
                    Updating
                    <div className="w-5 h-5 border-2 rounded-full border-t-black animate-spin"></div>
                </div>
            )}

            <div className={`flex flex-col gap-4 ${props.updateAmenities && "opacity-50"}`}>
                <div className="h-[180px] md:h-[300px] relative">
                    <div style={{ display: imageLoaded ? "initial" : "none" }}>
                        <ImageLoader
                            borderRadius="8px"
                            marginTop="23px"
                            widthMobile="100%"
                            width="100%"
                            height="100%"
                            url={
                                props.data.image && !imageFail
                                    ? props.data.image
                                    : "media/icons/bookings/notfounds/noroom.png"
                            }
                            dimensionsMobile={{ width: 500, height: 280 }}
                            dimensions={{ width: 468, height: 188 }}
                            onload={() => {
                                setTimeout(() => {
                                    setImageLoaded(true);
                                }, 1000);
                            }}
                            onfail={() => {
                                setImageFail(true);
                                setImageLoaded(true);
                            }}
                            noLazy
                        ></ImageLoader>

                        {props.data?.ideal_duration_number ? (
                            <div className="absolute bottom-1 right-1 bg-[#000000bf] text-white px-4 py-2 rounded-lg flex flex-row items-center gap-2">
                                <FaClock />
                                {props.data.ideal_duration_number}{" "}
                                {props.data.ideal_duration_number > 1 ? props.data?.ideal_duration_unit.toLowerCase() : props.data?.ideal_duration_unit.toLowerCase().slice(0, -1)}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>

                    <div
                        style={{
                            display: !imageLoaded ? "initial" : "none",
                        }}
                    >
                        <SkeletonCard width={"100%"} height={isPageWide ? "300px" : "180px"} />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="text-[20px] font-[800]">{props.data.name}</div>

                    {props.data?.city && (
                        <div>
                            <span className="font-bold pr-1">Address:</span>{" "}
                            {props.data.city}
                        </div>
                    )}

                    <div className="flex items-center gap-1">
                        {props.data?.rating && (
                            <div
                                style={{ color: "#FFD201", marginBottom: "0.3rem" }}
                                className="flex flex-row gap-1"
                            >
                                {stars}
                            </div>
                        )}

                        <div style={{ display: "flex", alignItems: "center" }}>
                            {props.data?.rating && (
                                <p className="text-[12px] text-[#7a7a7a]" style={{ marginBlock: "auto" }}>{props.data.rating} ·</p>
                            )}

                            {props.data?.user_ratings_total && (
                                <u className="text-[12px] text-[#7a7a7a]">
                                    {props.data.user_ratings_total}{" user reviews"}
                                </u>
                            )}
                        </div>
                    </div>

                    {props.data?.experience_filters && (
                        <div className="text-[14px] flex flex-row items-center gap-1 flex-wrap">
                            {props.data.experience_filters?.map((e, i) => (
                                <span key={i} className="border-2 rounded-full px-2 py-1">
                                    {e}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between">
                    {props.data?.prices?.total_price ? (
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-row gap-2 items-center text-sm">
                                <span className="font-bold text-lg md:text-2xl">₹{getIndianPrice(props.data.prices.total_price)}</span>{`for ${props.data.prices?.total_pax} people`}
                            </div>

                            {inclusiveCost.length ? (
                                <div className="text-sm flex flex-row items-center gap-1 flex-wrap">
                                    Inclusive of {inclusiveCost.map((item, index) => (
                                        <span key={index} className="border-2 rounded-full px-2 py-1">{item}</span>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="flex flex-row">
                            Cost: Complimentary Activity
                        </div>
                    )}

                    <div className="flex flex-col gap-1">
                        <button onClick={handleUpdate} className="bg-[#F7E700] py-2 px-4 border-2 border-black rounded-lg">
                            {props.data?.city ? `Add to ${props.data?.city} Itinerary` : 'Add to Itinerary'}
                        </button>
                        <div className="text-sm px-2">on {dateFormat(props.date)}</div>
                    </div>
                </div>

                {props.data?.short_description && (
                    <div className="flex flex-col gap-2">
                        <div className="text-[18px] font-[800]">About</div>
                        <div className="text-[14px]">
                            {props.data.short_description}
                        </div>
                    </div>
                )}

                {props.data?.timings && (
                    <div className="h-[31px] py-[4px] px-[8px] border-[20px] text-white text-[14px] font-[600] absolute left-[10px] bottom-[10px] md:left-[300px]">
                        <div className="text-[18px] font-[800]">Timings</div>
                        <div className="text-[14px]">
                            {
                                <ul>
                                    {props.data.timings.weekday_text?.map((e, i) => (
                                        <li key={i}>{e}</li>
                                    ))}
                                </ul>
                            }
                        </div>
                    </div>
                )}

                {props.data?.tips && props.data?.tips?.length ? (
                    <div className="flex flex-col gap-2">
                        <div className="text-[18px] font-[800]">Tips</div>
                        <div className="text-[14px]">
                            <ul style={{ paddingLeft: "0.5rem" }}>
                                {props.data.tips?.map((e, i) => (
                                    <li key={i}>- {e}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <></>
                )}

                {props.data?.amenities && props.data?.amenities?.length ? (
                    <div className="flex flex-col gap-2 relative">
                        <div className="text-[18px] font-[800]">Add-ons</div>
                        <div className="flex flex-col gap-2">
                            {props.data.amenities.map((amenity, index) => (
                                <Amenity key={index} index={index} amenity={amenity} handleAmenityChange={handleAmenityChange} />
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

const Amenity = ({ index, amenity, handleAmenityChange }) => {
    const [included, setIncluded] = useState(amenity?.included)

    useEffect(() => {
        setIncluded(amenity?.included)
    }, [amenity])

    const getAmenityIcon = (type) => {
        switch (type) {
            case 'Guide':
                return <FaPerson />
            case 'Transportation':
                return <MdTransferWithinAStation />
            case 'Meal':
                return <IoFastFood />
            case 'Entry Ticket':
                return <IoTicket />
            default:
                return <BiSolidCustomize />;
        }
    }

    const handleSelect = () => {
        handleAmenityChange(index, !included)
        setIncluded(prev => !prev)
    }

    return (
        <div key={index} className="flex flex-row gap-3 items-center justify-between bg-gray-200 p-2 rounded-lg">
            <div className="flex flex-col gap-1">
                <div className="flex flex-row items-center gap-2">
                    {getAmenityIcon(amenity?.type)}
                    {amenity.name}
                </div>
                <div className="text-sm">
                    {amenity.description}
                </div>
            </div>

            <div className="flex flex-col items-end">
                <div className="font-bold">₹{getIndianPrice(amenity.price)}</div>

                <button disabled={amenity.mandatory} onClick={handleSelect} className="flex flex-row items-center gap-1 cursor-pointer">
                    <CheckboxFormComponent checked={included} />
                    {included ? "Selected" : "Select"}
                </button>
            </div>
        </div>
    );
}
