import React, { useState } from "react";
import { PiForkKnifeFill } from "react-icons/pi";
import { BsCalendar2, BsPeopleFill } from "react-icons/bs";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import ImageLoader from "../../../ImageLoader";
import Skeleton from "../../../ui/SkeletonCard";
import { getDate } from "../../../../helper/ConvertDateFormat";
import { getIndianPrice } from "../../../../services/getIndianPrice";
import { logEvent } from "../../../../services/ga/Index";
import ImageCarousel from "../../Carousel/ImageCarousel";

export default function NewHotelBooking({
    currentBooking,
    booking,
    banner_image,
    openDetails,
}) {
    const [imageFail, setImageFail] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);


    const starRating = (rating) => {
        var stars = [];
        for (let i = 0; i < Math.floor(rating); i++) {
            stars.push(<FaStar />);
        }
        if (Math.floor(rating) < rating) stars.push(<FaStarHalfAlt />);
        return stars;
    };

    const handleViewHotel = () => {
        openDetails();

        logEvent({
            action: "Details_View",
            params: {
                page: "Itinerary Page",
                event_category: "Click",
                event_value: booking?.name,
                event_action: "Stays",
            },
        });
    };

    let img = "";
    if (banner_image) img = banner_image;
    if (booking && booking.images && booking.images.length && !banner_image)
        for (let i = 0; i < booking.images.length; i++) {
            if (booking.images[i].image) {
                img = booking.images[i].image;
                break;
            }
        }


    return (
        <div
            id={booking?.id}
            className={`flex gap-1 pt-4 flex-col justify-start `}
        >
            <div>
                <div className="cursor-pointer relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-4 p-3">
                    <div
                        onClick={() => {
                            handleViewHotel()
                        }}
                        className={`relative flex lg:flex-row w-full flex-col gap-4 grayscale-0`}
                    >
                        <div
                            className={`relative  ${currentBooking
                                ? "lg:h-[12rem]"
                                : "lg:h-[12rem]"} lg:w-[30%] w-full  h-[12rem]`}
                        >
                            <div className="w-full h-full">
                                <ImageCarousel images={booking.images} />
                                {/* <ImageLoader
                                    dimensions={{ width: 400, height: 400 }}
                                    dimensionsMobile={{ width: 400, height: 400 }}
                                    borderRadius="16px"
                                    hoverpointer
                                    onclick={() => console.log("")}
                                    width="100%"
                                    height="100%"
                                    leftalign
                                    widthmobile="100%"
                                    noLazy
                                    url={
                                        img && !imageFail
                                            ? img
                                            : "media/icons/bookings/notfounds/noroom.png"
                                    }
                                    onfail={() => {
                                        setImageFail(true);
                                        setImageLoaded(true);
                                    }}
                                    onload={() => {
                                        setTimeout(() => {
                                            setImageLoaded(true);
                                        }, 1000);
                                    }}
                                ></ImageLoader> */}
                            </div>

                            {/* <div
                                style={{
                                    height: "100%",
                                    overflow: "hidden",
                                    borderRadius: "16px",
                                    display: !imageLoaded ? "block" : "none",
                                }}
                            >
                                <Skeleton />
                            </div> */}

                            {booking.star_category ? (
                                <starHotel
                                    starHotel
                                    className={`text-white bg-[#01202B] lg:px-4 px-3 lg:py-3 py-2 m-2 text-sm font-[400]nsition-all shadow-slate-700/70 shadow-md hover:drop-shadow-xl   absolute top-0 rounded-3xl`}
                                >
                                    {booking.star_category} star hotel
                                </starHotel>
                            ) : null}
                        </div>

                        <div className="flex flex-col gap-2 text-[#01202B] lg:w-[70%] w-full justify-between">
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-row justify-between items-center">
                                    <div
                                        className={`text-2xl font-semibold `}
                                    >
                                        {booking?.name}
                                    </div>
                                </div>

                                {booking && (
                                    <div className="flex flex-col gap-1">
                                        {booking?.addr1 && (
                                            <div className="text-sm font-normal line-clamp-2">
                                                {booking?.addr1}{booking?.addr2 && `, ${booking.addr2}`}
                                            </div>
                                        )}

                                        {booking?.rating_ext ? (
                                            <div className="gap-1 flex flex-row  items-center">
                                                <div className="flex flex-row text-[#FFD201]">
                                                    {starRating(booking?.rating_ext)}
                                                </div>
                                                <div>{booking?.rating_ext}</div>
                                                {booking?.num_reviews_ext && (
                                                    <div className="text-sm text-[#7A7A7A] font-[400] underline">
                                                        {booking?.num_reviews_ext} User reviews
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                )}

                                {currentBooking && (
                                    <div className="flex flex-row gap-3 lg:mt-2 mt-0">
                                        {currentBooking?.check_in && (
                                            <div className="flex flex-row gap-2 items-center">
                                                <BsCalendar2 className="text-sm text-[#7A7A7A]" />
                                                <div>
                                                    <div className="text-sm font-[400] ">
                                                        {getDate(currentBooking?.check_in)}-
                                                        {getDate(currentBooking?.check_out)}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="text-sm font-[400] gap-2 flex flex-row items-center">
                                            <BsPeopleFill className="text-sm text-[#7A7A7A]" />
                                            <div className=" text-sm font-[400] min-w-fit">
                                                {currentBooking?.number_of_adults}{" "}
                                                Adults
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {(
                                    <div className="flex flex-row gap-2 items-center lg:my-2 my-0">
                                        <PiForkKnifeFill className="text-lg text-[#7A7A7A]" />
                                        <div className="text-sm font-[400]">Complimentary breakfast available</div>
                                    </div>
                                )}
                            </div>

                            {booking?.price && (
                                <div>
                                    <div className="font-[300] text-sm">Starting from</div>
                                    <div className="flex flex-row gap-1 items-center w-full font-bold">
                                        <div className="text-2xl font-bold">
                                            {booking?.source === "Agoda"
                                                ? "₹" +
                                                getIndianPrice(Math.round(+booking.price / 100)) +
                                                "/-"
                                                : "₹" +
                                                getIndianPrice(Math.round(booking?.price)) +
                                                "/-"}
                                        </div>
                                        <div
                                            className="font-normal text-base self-end"
                                            style={{
                                                height: "auto",
                                                marginBottom: "0.15rem",
                                                fontWeight: 300,
                                            }}
                                        >
                                            {booking?.source === "Agoda" ? (
                                                <>per night</>
                                            ) : (
                                                <>for {currentBooking?.duration} nights</>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="absolute bottom-[28px] right-8 -m-3">
                        <div
                            className=" z-50"
                            onClick={() => handleViewHotel()}
                        >
                            <div className="cursor-pointer bg-[#F7E700] px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-all border-2 border-black">
                                <label className="text-center">
                                    View Details
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
