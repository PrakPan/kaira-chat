import React, { useState } from "react";
import ImageLoader from "../ImageLoader";
import { BsCalendar2 } from "react-icons/bs";
import FullScreenGallery from "../fullscreengallery/Index";
import * as ga from "../../services/ga/Index";
import Button from "../ui/button/Index";
import { getDate } from "../../helper/ConvertDateFormat";
import { BiTimeFive } from "react-icons/bi";
import { IoTicket } from "react-icons/io5";
import { connect } from "react-redux";
import { useRouter } from "next/router";

const ActivitiesSummary = (props) => {
  const router = useRouter();
  const [images, setImages] = useState(null);

  const handleView = async (poi, type) => {
    try {
      router.push(
        {
          pathname: `/itinerary/${router.query.id}`,
          query: {
            drawer: "showPoiDetail",
            poi_id: poi,
            type: type,
            dayIndex: props?.index1,
          },
        },
        undefined,
        {
          scroll: false,
        }
      );
    } catch (error) {
      console.log("error is:", error);
    }
  };

  return (
    <>
      <div
        id={props?.item.id}
        key={props?.index}
        className="flex gap-1 pt-4  flex-col justify-start w-full  md:max-w-[56vw]"
      >
        <div className="font-bold lg:text-2xl text-xl pb-2 text-[#01202B]">
          {props?.city?.city?.name}
        </div>
        <div
          id={props?.index}
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
                url={
                  props?.item?.image
                    ? props?.item.image
                    : props?.item.activity?.image
                }
              ></ImageLoader>
            </div>
            <div className="flex flex-col gap-4 text-[#01202B] lg:w-[70%]">
              <div className="text-2xl font-semibold ">{props?.item?.name}</div>

              <div className="flex flex-col gap-2 -mt-2">
                <div className="text-sm font-normal">
                  {props?.item?.activity?.address}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {props?.item.check_in && (
                  <div className="flex flex-row gap-2 items-center">
                    <BsCalendar2 className="text-sm font-[400] line-clamp-1 text-[#7A7A7A]" />
                    <div>
                      <div className="text-sm font-[400] line-clamp-1">
                        {props?.item.check_in && getDate(props?.item.check_in)}
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-sm font-[400] line-clamp-1"></div>
                {props?.item.activity?.ideal_duration_hours_text && (
                  <div className="flex flex-row gap-1 items-center ">
                    <BiTimeFive className="text-md font-[400] line-clamp-1 text-[#7A7A7A]" />
                    <div>
                      <div className="text-sm font-[400] ">
                        {props?.item.activity.ideal_duration_hours_text}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <IoTicket className="text-sm font-[400] line-clamp-1 text-[#7A7A7A]" />
                    <div className="text-sm line-clamp-1">
                      {props?.item?.pax ||
                        props?.item?.number_of_adults +
                          props?.item?.number_of_children}{" "}
                      {(props?.item?.pax ||
                        props?.item?.number_of_adults +
                          props?.item?.number_of_children) > 1
                        ? "Tickets"
                        : "Ticket"}
                    </div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.32734 0.417969C3.01534 0.417969 0.333344 3.10597 0.333344 6.41797C0.333344 9.72997 3.01534 12.418 6.32734 12.418C9.64534 12.418 12.3333 9.72997 12.3333 6.41797C12.3333 3.10597 9.64534 0.417969 6.32734 0.417969ZM6.33334 11.218C3.68134 11.218 1.53334 9.06997 1.53334 6.41797C1.53334 3.76597 3.68134 1.61797 6.33334 1.61797C8.98534 1.61797 11.1333 3.76597 11.1333 6.41797C11.1333 9.06997 8.98534 11.218 6.33334 11.218ZM6.20134 3.41797H6.16534C5.92534 3.41797 5.73334 3.60997 5.73334 3.84997V6.68197C5.73334 6.89197 5.84134 7.08997 6.02734 7.19797L8.51734 8.69197C8.72134 8.81197 8.98534 8.75197 9.10534 8.54797C9.23134 8.34397 9.16534 8.07397 8.95534 7.95397L6.63334 6.57397V3.84997C6.63334 3.60997 6.44134 3.41797 6.20134 3.41797Z"
                        fill="black"
                      />
                    </svg>
                    <div className="text-sm">{props?.item?.duration}</div>
                  </div>
                </div>
              </div>

              <div className="pr-2 w-full">
                <button
                  onClick={() => handleView(props?.item?.id, "activity")}
                  className="lg:hidden mt-2 w-full text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap"
                >
                  View Details
                </button>
              </div>

              <div className="hidden lg:!flex flex-row gap-3 items-center w-full justify-end">
                <Button
                  color="#111"
                  fontWeight="600"
                  fontSize="0.85rem"
                  borderWidth="2px"
                  width="10rem"
                  borderRadius="8px"
                  bgColor="#ffffff"
                  onclick={() => handleView(props?.item?.id, "activity")}
                >
                  <div>View Detail</div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {images ? (
        <FullScreenGallery
          closeGalleryHandler={() => setImages(null)}
          images={images}
        ></FullScreenGallery>
      ) : null}
    </>
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
    itinerary: state.Itinerary,
  };
};

export default connect(mapStateToPros)(ActivitiesSummary);
