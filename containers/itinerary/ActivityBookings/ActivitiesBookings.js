import React, { useState } from "react";
import ImageLoader from "../../../components/ImageLoader";
import { BsCalendar2, BsPeopleFill } from "react-icons/bs";
import { FaBed, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { IoTicket } from "react-icons/io5";
import { ImSpoonKnife } from "react-icons/im";
import FullScreenGallery from "../../../components/fullscreengallery/Index";
import * as ga from "../../../services/ga/Index";
import ButtonYellow from "../../../components/ButtonYellow";
import { getDate } from "../../../helper/ConvertDateFormat";
import { connect } from "react-redux";
import { BiTimeFive } from "react-icons/bi";
import POIDetailsDrawer from "../../../components/drawers/poiDetails/POIDetailsDrawer";

const ActivitiesBookings = (props) => {
  const [images, setImages] = useState(null);
  const [viewMoreDiscription, setViewMoreDiscription] = useState(null);
  const [showMore, setShowMore] = useState(false);

  function Addons(Shorthand) {
    switch (Shorthand) {
      case "EP":
        return "Room Only";
      case "CP":
        return "Complementary Breakfast Included";
      case "MAP":
        return "Breakfast/Lunch Included";
      case "AP":
        return "All Meals Included";
      case "TBO":
        return null;
      default:
        return null;
    }
  }

  const starRating = (rating) => {
    var stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<FaStar />);
    }
    if (Math.floor(rating) < rating) stars.push(<FaStarHalfAlt />);
    return stars;
  };

  const noOfWords = (sentence, number) => {
    if (sentence) {
      const words = sentence.trim().split(/\s+/);
      if (words.length > number) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleMoreDiscription = (e) => {
    setViewMoreDiscription(e.currentTarget.id);
    setShowMore(true);

    ga.logEvent({
      action: "Details_View",
      params: {
        page: "Itinerary Page",
        event_category: "Click",
        event_label: "View More Discription",
        event_action: "Activities",
      },
    });
  };

  const handleCloseDrawer = (e) => {
    setViewMoreDiscription();
    if (e) e.stopPropagation(e);
    setShowMore(false);
  };

  return (
    <div id="activities" className="lg:w-[60vw] w-full">
      <div className="cursor-pointer font-lexend mb-2  mt-8 font-bold text-3xl group text-[#262626] transition duration-300 max-w-fit">
        Activities
        <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </div>
      {props.activityBookings
        ? props.activityBookings.map((booking, index) => (
            <div
              id={booking.id}
              key={index}
              className="flex gap-1 pt-4  flex-col justify-start"
            >
              <div className="font-bold lg:text-2xl text-xl pb-2 text-[#01202B]">
                {booking?.city}{" "}
                {booking.duration && <span>({booking?.duration}N)</span>}
              </div>
              <div
                id={index}
                onClick={handleMoreDiscription}
                className="cursor-pointer shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-4 p-3"
              >
                <div className="relative flex lg:flex-row w-full flex-col gap-4  grayscale-0 ">
                  <div className="relative lg:h-[15rem] lg:w-[30%] w-full h-[12rem]">
                    <ImageLoader
                      dimensions={{ width: 400, height: 400 }}
                      dimensionsMobile={{ width: 400, height: 400 }}
                      borderRadius="16px"
                      hoverpointer
                      onclick={() => console.log("")}
                      width="100%"
                      height="100%"
                      leftalign
                      widthmobile="100%"
                      url={booking.images[0]?.image}
                    ></ImageLoader>
                    {booking.star_category ? (
                      <div
                        className={`text-white bg-[#01202B] lg:px-3 px-2 lg:py-2 py-1 m-2 shadow-sm shadow-[#00000060] absolute top-0 rounded-2xl`}
                      >
                        {booking.star_category} star hotel
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-4 text-[#01202B] lg:w-[70%]">
                    <div className="text-2xl font-semibold ">
                      {booking?.name}
                    </div>
                    <div className="flex flex-col gap-2 -mt-2">
                      <div className="text-sm font-normal">
                        {booking?.costings_breakdown?.activity_data?.address}
                      </div>
                      {booking?.costings_breakdown?.activity_data?.rating ? (
                        <div className="gap-1 flex flex-row  items-center">
                          <div className="flex flex-row text-[#ffa500]">
                            {starRating(
                              booking?.costings_breakdown?.activity_data?.rating
                            )}
                          </div>
                          <div>
                            {booking?.costings_breakdown?.activity_data?.rating}
                          </div>
                          {booking?.costings_breakdown?.activity_data
                            ?.user_ratings_total && (
                            <div className="text-sm text-[#7A7A7A] font-medium underline">
                              {
                                booking?.costings_breakdown?.activity_data
                                  ?.user_ratings_total
                              }{" "}
                              Reviews
                            </div>
                          )}
                        </div>
                      ) : null}

                      {booking?.points && booking?.points.length ? (
                        booking.points.map((data, i) => (
                          <div className="flex flex-col gap-0">
                            {data !== "" && (
                              <div className="flex flex-row gap-1 text-sm font-[400] line-clamp-1">
                                <div>{i + 1}. </div>
                                <div>{data}</div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="font-light">
                          {booking?.costings_breakdown?.activity_data?.short_description.slice(
                            0,
                            250
                          )}
                          <button
                            id={index}
                            onClick={handleMoreDiscription}
                            className="font-semibold text-gray-500 ml-1"
                          >
                            {"...more"}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {booking.check_in && (
                        <div className="flex flex-row gap-2 items-center">
                          <BsCalendar2 className="text-sm font-[400] line-clamp-1 text-[#7A7A7A]" />
                          <div>
                            <div className="text-sm font-[400] line-clamp-1">
                              {booking.check_in && getDate(booking.check_in)}
                              {booking.check_out &&
                                " - " + " " + getDate(booking.check_out)}
                            </div>
                          </div>
                        </div>
                      )}
                      {booking?.ideal_duration_hours_text && (
                        <div className="flex flex-row gap-1 items-center">
                          <BiTimeFive className="text-md font-[400] line-clamp-1 text-[#7A7A7A]" />
                          <div>
                            <div className="text-sm font-[400] line-clamp-1">
                              {booking.ideal_duration_hours_text}
                            </div>
                          </div>
                        </div>
                      )}

                      {booking?.costings_breakdown?.no_of_tickets && (
                        <div>
                          <div className="flex flex-row gap-2 items-center">
                            <IoTicket className="text-sm font-[400] line-clamp-1 text-[#7A7A7A]" />
                            <div className="text-sm font-[400] line-clamp-1">
                              {booking?.costings_breakdown?.no_of_tickets}{" "}
                              {booking?.costings_breakdown?.no_of_tickets <= "1"
                                ? "Ticket"
                                : "Tickets"}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {booking.costings_breakdown[0] && (
                      <div>
                        <div
                          className={`flex ${
                            noOfWords(
                              booking.costings_breakdown[0]?.room_type,
                              4
                            )
                              ? "lg:flex-row flex-col"
                              : "flex-row"
                          } gap-3`}
                        >
                          <div className="text-md font-medium gap-2 flex flex-row items-center">
                            <BsPeopleFill className="text-md text-[#7A7A7A]" />
                            <div className="text-md font-medium min-w-fit">
                              {booking.number_of_adults} Adults
                            </div>
                          </div>
                          <div className="text-md font-medium gap-2 flex flex-row items-center">
                            <FaBed className="text-md text-[#7A7A7A]" />
                            <div className="text-md font-medium">
                              {booking.costings_breakdown[0].room_type}
                            </div>
                          </div>
                        </div>
                        {Addons(booking.costings_breakdown[0].pricing_type) ? (
                          <div className="flex flex-row gap-2 items-center">
                            <ImSpoonKnife className="text-md text-[#7A7A7A]" />
                            <div className="text-md font-medium">
                              {Addons(
                                booking.costings_breakdown[0].pricing_type
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}

                    <div className="flex flex-row gap-3 items-center w-full">
                      {booking.accommodation && (
                        <ButtonYellow className="lg:w-fit w-1/2">
                          <div className="text-[#01202B] ">View Detail</div>
                        </ButtonYellow>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        : null}

      {images ? (
        <FullScreenGallery
          closeGalleryHandler={() => setImages(null)}
          images={images}
        ></FullScreenGallery>
      ) : null}

      <POIDetailsDrawer
        itineraryDrawer
        show={showMore}
        iconId={
          props?.activityBookings[viewMoreDiscription]?.costings_breakdown
            ?.activity_data?.id
        }
        ActivityiconId={
          props?.activityBookings[viewMoreDiscription]?.costings_breakdown
            ?.activity_data?.id
        }
        handleCloseDrawer={handleCloseDrawer}
        name={props?.activityBookings[viewMoreDiscription]?.name}
        image={props?.activityBookings[viewMoreDiscription]?.images[0]?.image}
        text={
          props?.activityBookings[viewMoreDiscription]?.costings_breakdown
            ?.activity_data?.short_description
        }
        Topheading={"Select Our Point Of Interest"}
      />
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    name: state.auth.name,
    emailFail: state.auth.emailFail,
    token: state.auth.token,
    phone: state.auth.phone,
    email: state.auth.email,
    authRedirectPath: state.auth.authRedirectPath,
    loadingsocial: state.auth.loadingsocial,
    emailfailmessage: state.auth.emailfailmessage,
    loginmessage: state.auth.loginmessage,
    hideloginclose: state.auth.hideloginclose,
  };
};

export default connect(mapStateToPros)(ActivitiesBookings);
